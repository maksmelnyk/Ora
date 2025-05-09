package messaging

import (
	"context"
	"encoding/json"
	"fmt"
	"sync"
	"time"

	"github.com/google/uuid"
	amqp "github.com/rabbitmq/amqp091-go"

	"github.com/maksmelnyk/scheduling/config"
	"github.com/maksmelnyk/scheduling/internal/logger"
)

type Publisher struct {
	provider *ConnectionProvider
	exchange string
	timeout  time.Duration
	channel  *amqp.Channel
	log      *logger.AppLogger
	mu       sync.Mutex
}

func NewPublisher(provider *ConnectionProvider, config *config.RabbitMqConfig, log *logger.AppLogger) *Publisher {
	return &Publisher{
		provider: provider,
		exchange: config.Exchange,
		timeout:  time.Duration(config.PublishConfirmTimeoutMs) * time.Millisecond,
		log:      log,
	}
}

func (p *Publisher) Initialize(ctx context.Context) error {
	p.mu.Lock()
	defer p.mu.Unlock()

	if p.channel != nil && !p.channel.IsClosed() {
		return nil
	}

	conn, err := p.provider.GetConnection(ctx)
	if err != nil {
		return fmt.Errorf("failed to get connection for publisher: %w", err)
	}

	channel, err := conn.Channel()
	if err != nil {
		return fmt.Errorf("failed to create channel for publisher: %w", err)
	}

	if err := channel.Confirm(false); err != nil {
		channel.Close()
		return fmt.Errorf("failed to put publisher channel in confirm mode: %w", err)
	}

	err = declareExchange(channel, p.exchange, "topic")
	if err != nil {
		channel.Close()
		return fmt.Errorf("failed to declare exchange '%s': %w", p.exchange, err)
	}

	go p.handleReturn(channel.NotifyReturn(make(chan amqp.Return)))
	go p.monitorChannel(channel)

	p.channel = channel
	return nil
}

func (p *Publisher) GetChannel(ctx context.Context) (*amqp.Channel, error) {
	p.mu.Lock()
	defer p.mu.Unlock()

	if p.channel == nil || p.channel.IsClosed() {
		if err := p.Initialize(ctx); err != nil {
			return nil, fmt.Errorf("failed to get or re-initialize publisher channel: %w", err)
		}
	}

	if p.channel == nil || p.channel.IsClosed() {
		return nil, fmt.Errorf("failed to get a valid publisher channel")
	}

	return p.channel, nil
}

func (p *Publisher) Publish(ctx context.Context, routingKey string, event EventBase) error {
	channel, err := p.GetChannel(ctx)
	if err != nil {
		return fmt.Errorf("failed to get publisher channel: %w", err)
	}

	headers := amqp.Table{
		"__TypeId__": event.GetEventType(),
	}

	body, err := json.Marshal(event)
	if err != nil {
		return fmt.Errorf("failed to marshal event: %w", err)
	}

	props := amqp.Publishing{
		DeliveryMode:  amqp.Persistent,
		ContentType:   "application/json",
		Timestamp:     time.Now().UTC(),
		MessageId:     uuid.New().String(),
		CorrelationId: uuid.New().String(),
		Body:          body,
		Headers:       headers,
	}

	confirmCtx, cancel := context.WithTimeout(ctx, p.timeout)
	defer cancel()

	confirmChan := make(chan amqp.Confirmation, 1)
	channel.NotifyPublish(confirmChan)

	err = channel.PublishWithContext(
		ctx,
		p.exchange,
		routingKey,
		true,
		false,
		props,
	)
	if err != nil {
		return fmt.Errorf("failed to publish message: %w", err)
	}

	select {
	case confirm := <-confirmChan:
		if !confirm.Ack {
			return fmt.Errorf("message not acknowledged by server")
		}
		return nil
	case <-confirmCtx.Done():
		return fmt.Errorf("publisher confirmation timeout after %s", p.timeout)
	}
}

func (p *Publisher) Close() error {
	p.mu.Lock()
	defer p.mu.Unlock()

	if p.channel != nil && !p.channel.IsClosed() {
		return p.channel.Close()
	}
	return nil
}

func (p *Publisher) handleReturn(returns chan amqp.Return) {
	for r := range returns {
		p.log.Warnf("Message returned: ReplyCode=%d, ReplyText=%s, Exchange=%s, RoutingKey=%s, Body=%s",
			r.ReplyCode, r.ReplyText, r.Exchange, r.RoutingKey, r.Body)
		// Implement logic to handle returned messages, e.g., logging, alerting, or re-queueing
	}
}

func (p *Publisher) monitorChannel(ch *amqp.Channel) {
	closeErr := <-ch.NotifyClose(make(chan *amqp.Error))

	p.mu.Lock()
	if p.channel == ch {
		p.channel = nil
		p.log.Warnf("Publisher channel closed: %v", closeErr)
	}
	p.mu.Unlock()
}
