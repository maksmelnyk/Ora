package messaging

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"sync"

	"github.com/google/uuid"
	"github.com/maksmelnyk/scheduling/config"
	"github.com/maksmelnyk/scheduling/internal/logger"
	"github.com/rabbitmq/amqp091-go"
)

type DeadLetterConsumer struct {
	provider      *ConnectionProvider
	config        *config.RabbitMqConfig
	queue         string
	exchange      string
	routingKey    string
	prefetchCount int
	log           *logger.AppLogger
	channel       *amqp091.Channel
	mu            sync.Mutex
	isConsuming   bool
	stopChan      chan struct{}
	consumerTag   string
}

func NewDeadLetterConsumer(provider *ConnectionProvider, config *config.RabbitMqConfig, log *logger.AppLogger) *DeadLetterConsumer {
	return &DeadLetterConsumer{
		provider:      provider,
		config:        config,
		queue:         SchedulingDLQName,
		exchange:      config.DeadLetterExchange,
		routingKey:    SchedulingDLQRoutingKey,
		prefetchCount: 1,
		log:           log,
		stopChan:      make(chan struct{}),
	}
}

func (c *DeadLetterConsumer) Initialize(ctx context.Context) error {
	c.mu.Lock()
	defer c.mu.Unlock()

	if c.channel != nil && !c.channel.IsClosed() {
		return nil
	}

	conn, err := c.provider.GetConnection(ctx)
	if err != nil {
		return fmt.Errorf("dlq consumer: failed to get connection: %w", err)
	}

	channel, err := conn.Channel()
	if err != nil {
		return fmt.Errorf("dlq consumer: failed to create channel: %w", err)
	}

	err = channel.Qos(c.prefetchCount, 0, false)
	if err != nil {
		channel.Close()
		return fmt.Errorf("dlq consumer: failed to set QoS: %w", err)
	}

	err = declareExchange(channel, c.exchange, "topic")
	if err != nil {
		channel.Close()
		return fmt.Errorf("dlq consumer: failed to declare dead letter exchange '%s': %w", c.exchange, err)
	}
	_, err = declareQueue(channel, c.queue, nil)
	if err != nil {
		channel.Close()
		return fmt.Errorf("dlq consumer: failed to declare dead letter queue '%s': %w", c.queue, err)
	}

	err = bindQueue(channel, c.queue, c.routingKey, c.exchange)
	if err != nil {
		channel.Close()
		return fmt.Errorf("dlq consumer: failed to bind queue '%s' to exchange '%s' with key '%s': %w", c.queue, c.exchange, c.routingKey, err)
	}

	go c.monitorChannel(channel)

	c.channel = channel
	return nil
}

func (c *DeadLetterConsumer) StartConsuming(ctx context.Context) error {
	c.mu.Lock()
	if c.isConsuming {
		c.mu.Unlock()
		return fmt.Errorf("dlq consumer: already consuming")
	}
	if err := c.Initialize(ctx); err != nil {
		c.mu.Unlock()
		return fmt.Errorf("dlq consumer: failed to initialize before consuming: %w", err)
	}
	c.isConsuming = true
	c.stopChan = make(chan struct{})
	channel := c.channel
	c.mu.Unlock()

	tag := fmt.Sprintf("dlq-consumer-%s", uuid.New().String())
	c.consumerTag = tag // Store the tag

	messages, err := channel.Consume(
		c.queue, // queue
		tag,     // consumer tag
		false,   // auto-ack = false
		false,   // exclusive
		false,   // no-local
		false,   // no-wait
		nil,     // args
	)
	if err != nil {
		c.mu.Lock()
		c.isConsuming = false
		c.mu.Unlock()
		return fmt.Errorf("dlq consumer: failed to start consuming: %w", err)
	}

	go func() {
		consumerCtx, cancel := context.WithCancel(ctx)
		defer cancel()

		for {
			select {
			case <-consumerCtx.Done():
				c.log.Warnf("DLQ Consumer stopping due to context cancellation (tag: %s)", tag)
				c.mu.Lock()
				c.isConsuming = false
				c.mu.Unlock()
				return
			case <-c.stopChan:
				c.log.Warnf("DLQ Consumer stopping due to shutdown request (tag: %s)", tag)
				c.mu.Lock()
				c.isConsuming = false
				c.mu.Unlock()
				return
			case msg, ok := <-messages:
				if !ok {
					c.log.Errorf("DLQ Consumer messages channel closed unexpectedly (tag: %s)", tag)
					c.mu.Lock()
					c.isConsuming = false
					c.mu.Unlock()
					return
				}
				c.handleDLQMessage(msg)
			}
		}
	}()

	return nil
}

func (c *DeadLetterConsumer) handleDLQMessage(msg amqp091.Delivery) {
	c.log.Errorf("DLQ Received Message ID: %s, CorrelationID: %s, Type: %v",
		msg.MessageId, msg.CorrelationId, msg.Type)

	if xDeath, ok := msg.Headers["x-death"].([]any); ok {
		for i, death := range xDeath {
			if deathInfo, castOk := death.(amqp091.Table); castOk {
				// Extract details - handle potential type issues carefully
				count, _ := deathInfo["count"].(int64)
				reason, _ := deathInfo["reason"].(string)
				queue, _ := deathInfo["queue"].(string)
				exchange, _ := deathInfo["exchange"].(string)
				var routingKeysStr string
				if rkList, rkOk := deathInfo["routing-keys"].([]any); rkOk {
					var keys []string
					for _, rk := range rkList {
						if rkStr, rkStrOk := rk.(string); rkStrOk {
							keys = append(keys, rkStr)
						}
					}
					routingKeysStr = strings.Join(keys, ", ")
				}

				c.log.Warnf("  x-death[%d]: Count=%d, Reason=%s, Queue=%s, Exchange=%s, RoutingKeys=[%s]",
					i, count, reason, queue, exchange, routingKeysStr)
			}
		}
	} else {
		c.log.Warnf("  No x-death header found or header format incorrect for message %s", msg.MessageId)
	}

	var parsedBody map[string]interface{}
	err := json.Unmarshal(msg.Body, &parsedBody)
	if err == nil {
		c.log.Warnf("  DLQ Message Body (parsed): %+v", parsedBody)
	} else {
		c.log.Warnf("  DLQ Message Body (raw): %s", string(msg.Body))
		c.log.Warnf("  DLQ Message Body JSON parsing error: %v", err)
	}

	// Alerting (TODO: Implement)
	// Persistence (TODO: Implement)
	// ACK the message from DLQ
	err = msg.Ack(false)
	if err != nil {
		c.log.Errorf("  Failed to ACK DLQ message %s: %v", msg.MessageId, err)
	}
}

func (c *DeadLetterConsumer) Shutdown(ctx context.Context) error {
	c.mu.Lock()
	if !c.isConsuming {
		c.mu.Unlock()
		if c.channel != nil && !c.channel.IsClosed() {
			return c.channel.Close()
		}
		return nil
	}

	close(c.stopChan)
	channel := c.channel
	tag := c.consumerTag
	c.mu.Unlock()

	if channel != nil && !channel.IsClosed() && tag != "" {
		err := channel.Cancel(tag, false)
		if err != nil {
			c.log.Warnf("Error cancelling DLQ consumer tag '%s': %v", tag, err)
		}
		return channel.Close()
	} else if channel != nil && !channel.IsClosed() {
		return channel.Close()
	}
	return nil
}

func (c *DeadLetterConsumer) monitorChannel(ch *amqp091.Channel) {
	closeErr := <-ch.NotifyClose(make(chan *amqp091.Error))

	c.mu.Lock()
	if c.channel == ch {
		c.log.Warnf("DLQ Consumer channel closed: %v. Resetting internal channel.", closeErr)
		c.channel = nil
		c.isConsuming = false
	}
	c.mu.Unlock()
	// TODO: Consider adding automatic re-initialization logic here if desired
}
