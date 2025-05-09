package messaging

import (
	"context"
	"fmt"
	"sync"
	"time"

	amqp "github.com/rabbitmq/amqp091-go"

	"github.com/maksmelnyk/scheduling/config"
	"github.com/maksmelnyk/scheduling/internal/logger"
)

type Consumer struct {
	provider        *ConnectionProvider
	config          *config.RabbitMqConfig
	queue           string
	routingPatterns []string
	channel         *amqp.Channel
	log             *logger.AppLogger
	mu              sync.Mutex
	isConsuming     bool
	stopChan        chan any
}

func NewConsumer(provider *ConnectionProvider, config *config.RabbitMqConfig, log *logger.AppLogger, routingPatterns []string) *Consumer {
	return &Consumer{
		provider:        provider,
		config:          config,
		queue:           SchedulingQueueName,
		routingPatterns: routingPatterns,
		log:             log,
		stopChan:        make(chan any),
	}
}

func (c *Consumer) Initialize(ctx context.Context) error {
	c.mu.Lock()
	defer c.mu.Unlock()

	if c.channel != nil && !c.channel.IsClosed() {
		return nil
	}

	conn, err := c.provider.GetConnection(ctx)
	if err != nil {
		return fmt.Errorf("failed to get connection for consumer: %w", err)
	}

	channel, err := conn.Channel()
	if err != nil {
		return fmt.Errorf("failed to create channel for consumer: %w", err)
	}

	err = channel.Qos(c.config.PrefetchCount, 0, false)
	if err != nil {
		channel.Close()
		return fmt.Errorf("failed to set QoS: %w", err)
	}

	err = declareExchange(channel, c.config.DeadLetterExchange, "topic")
	if err != nil {
		channel.Close()
		return fmt.Errorf("failed to declare dead letter exchange '%s': %w", c.config.DeadLetterExchange, err)
	}

	_, err = declareQueue(channel, SchedulingDLQName, nil)
	if err != nil {
		channel.Close()
		return fmt.Errorf("failed to declare dead letter queue '%s': %w", SchedulingDLQName, err)
	}

	err = declareExchange(channel, c.config.Exchange, "topic")
	if err != nil {
		channel.Close()
		return fmt.Errorf("failed to declare main exchange '%s': %w", c.config.Exchange, err)
	}

	args := amqp.Table{
		"x-dead-letter-exchange":    c.config.DeadLetterExchange,
		"x-dead-letter-routing-key": SchedulingDLQRoutingKey,
		"x-message-ttl":             c.config.MessageTTL,
	}
	_, err = declareQueue(channel, c.queue, args)
	if err != nil {
		channel.Close()
		return fmt.Errorf("failed to declare main queue '%s': %w", c.queue, err)
	}

	if len(c.routingPatterns) == 0 {
		c.log.Warnf("Warning: No routing keys provided for queue '%s'. It will not receive messages.", c.queue)
	}
	for _, pattern := range c.routingPatterns {
		err = bindQueue(channel, c.queue, pattern, c.config.Exchange)
		if err != nil {
			channel.Close()
			return fmt.Errorf("failed to bind queue '%s' to exchange '%s' with pattern '%s': %w", c.queue, c.config.Exchange, pattern, err)
		}
	}

	go c.monitorChannel(channel)

	c.channel = channel
	return nil
}

func (c *Consumer) GetChannel(ctx context.Context) (*amqp.Channel, error) {
	c.mu.Lock()
	defer c.mu.Unlock()

	if c.channel == nil || c.channel.IsClosed() {
		if err := c.Initialize(ctx); err != nil {
			return nil, fmt.Errorf("failed to get or re-initialize publisher channel: %w", err)
		}
	}

	if c.channel == nil || c.channel.IsClosed() {
		return nil, fmt.Errorf("failed to get a valid publisher channel")
	}

	return c.channel, nil
}

func (c *Consumer) StartConsuming(ctx context.Context, messageHandler func(ctx context.Context, msg amqp.Delivery) error) error {
	c.mu.Lock()
	if c.isConsuming {
		c.mu.Unlock()
		return fmt.Errorf("consumer is already consuming messages")
	}
	c.isConsuming = true
	c.stopChan = make(chan any)
	c.mu.Unlock()

	channel, err := c.GetChannel(ctx)
	if err != nil {
		c.mu.Lock()
		c.isConsuming = false
		c.mu.Unlock()
		return fmt.Errorf("failed to get consumer channel: %w", err)
	}

	messages, err := channel.Consume(
		c.queue, // queue
		"",      // consumer tag - auto-generated
		false,   // auto-ack - set to false for manual acknowledgment
		false,   // exclusive
		false,   // no-local
		false,   // no-wait
		nil,     // args
	)
	if err != nil {
		c.mu.Lock()
		c.isConsuming = false
		c.mu.Unlock()
		return fmt.Errorf("failed to start consuming from queue '%s': %w", c.queue, err)
	}

	var wg sync.WaitGroup
	consumerErrors := make(chan error, c.config.ConcurrentConsumers)
	consumerCtx, cancelConsumers := context.WithCancel(ctx)
	defer cancelConsumers()

	for i := range c.config.ConcurrentConsumers {
		wg.Add(1)
		go func(consumerID int) {
			defer wg.Done()
			c.log.Infof("Starting consumer %d", consumerID)

			for {
				select {
				case msg, ok := <-messages:
					if !ok {
						c.log.Warnf("Consumer %d: messages channel closed", consumerID)
						consumerErrors <- fmt.Errorf("consumer %d: messages channel closed", consumerID)
						return
					}

					maxRetries := c.config.RetryCount
					initialDelay := time.Duration(c.config.InitialRetryIntervalMs) * time.Millisecond
					maxDelay := time.Duration(c.config.MaxRetryIntervalMs) * time.Millisecond
					var processingErr error

					for attempt := 0; attempt <= maxRetries; attempt++ {
						msgCtx, cancel := context.WithTimeout(consumerCtx, 30*time.Second)
						processingErr = messageHandler(msgCtx, msg)
						cancel()

						if processingErr == nil {
							err := msg.Ack(false)
							if err != nil {
								c.log.Errorf("Consumer %d: Failed to ACK message %s after successful processing: %v", consumerID, msg.MessageId, err)
							} else {
								c.log.Debugf("Consumer %d: Successfully processed and ACKed message %s", consumerID, msg.MessageId)
							}
							break
						}

						c.log.Warnf("Consumer %d: Error processing message %s (attempt %d/%d): %v",
							consumerID, msg.MessageId, attempt+1, maxRetries+1, processingErr)

						if attempt >= maxRetries {
							c.log.Errorf("Consumer %d: Final attempt failed for message %s. Nacking to DLQ.", consumerID, msg.MessageId)
							err := msg.Nack(false, false)
							if err != nil {
								c.log.Errorf("Consumer %d: Failed to NACK message %s after final retry: %v", consumerID, msg.MessageId, err)
							}
							break
						}

						delayMs := calculateRetryDelay(attempt+1, int(initialDelay.Milliseconds()), int(maxDelay.Milliseconds()), c.config.RetryMultiplier)
						retryDelay := time.Duration(delayMs) * time.Millisecond
						c.log.Infof("Consumer %d: Retrying message %s in %v", consumerID, msg.MessageId, retryDelay)

						select {
						case <-time.After(retryDelay):
						case <-consumerCtx.Done():
							c.log.Warnf("Consumer %d: Context cancelled during retry delay for message %s. Nacking.", consumerID, msg.MessageId)
							_ = msg.Nack(false, false)
							return
						case <-c.stopChan:
							c.log.Warnf("Consumer %d: Shutdown requested during retry delay for message %s. Nacking.", consumerID, msg.MessageId)
							_ = msg.Nack(false, false)
							return
						}
					}

				case <-consumerCtx.Done():
					c.log.Debugf("Consumer %d stopping: context cancelled", consumerID)
					return

				case <-c.stopChan:
					c.log.Debugf("Consumer %d stopping: shutdown requested", consumerID)
					return
				}
			}
		}(i)
	}

	select {
	case err := <-consumerErrors:
		cancelConsumers()
		c.mu.Lock()
		c.isConsuming = false
		c.mu.Unlock()
		c.log.Errorf("Consumer error: %v", err)
		wg.Wait()
		return err

	case <-ctx.Done():
		cancelConsumers()
		c.mu.Lock()
		c.isConsuming = false
		c.mu.Unlock()
		c.log.Debug("All consumers stopping due to context cancellation")
		wg.Wait()
		return ctx.Err()

	case <-c.stopChan:
		cancelConsumers()
		c.mu.Lock()
		c.isConsuming = false
		c.mu.Unlock()
		c.log.Debug("All consumers stopping due to shutdown request")
		wg.Wait()
		return nil
	}
}

func (c *Consumer) Close() error {
	c.mu.Lock()
	defer c.mu.Unlock()

	if c.channel != nil && !c.channel.IsClosed() {
		return c.channel.Close()
	}
	return nil
}

func (c *Consumer) Shutdown(ctx context.Context) error {
	c.mu.Lock()
	isConsuming := c.isConsuming
	c.mu.Unlock()

	if isConsuming {
		close(c.stopChan)

		select {
		case <-ctx.Done():
			c.log.Warn("Shutdown context expired during consumer shutdown")
			return ctx.Err()
		case <-time.After(5 * time.Second):
			c.log.Debug("Consumer shutdown grace period expired")
		}
	}

	shutdownCtx, cancel := context.WithTimeout(ctx, 30*time.Second)
	defer cancel()

	c.mu.Lock()
	defer c.mu.Unlock()

	if c.channel != nil && !c.channel.IsClosed() {
		c.log.Debugf("Gracefully shutting down RabbitMQ consumer")
		if err := c.channel.Cancel("", false); err != nil {
			c.log.Warnf("Error cancelling consumer: %v", err)
		}

		select {
		case <-shutdownCtx.Done():
			c.log.Warn("Shutdown timeout exceeded, forcing close")
		case <-time.After(500 * time.Millisecond):
		}

		return c.channel.Close()
	}
	return nil
}

func (c *Consumer) monitorChannel(ch *amqp.Channel) {
	closeErr := <-ch.NotifyClose(make(chan *amqp.Error))

	c.mu.Lock()
	if c.channel == ch {
		c.channel = nil
		c.log.Warnf("Consumer channel closed: %v", closeErr)
	}
	c.mu.Unlock()
}
