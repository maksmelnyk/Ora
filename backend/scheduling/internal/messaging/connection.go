package messaging

import (
	"context"
	"fmt"
	"math"
	"math/rand/v2"
	"sync"
	"time"

	amqp "github.com/rabbitmq/amqp091-go"

	"github.com/maksmelnyk/scheduling/config"
	"github.com/maksmelnyk/scheduling/internal/logger"
)

const (
	// Queue names
	SchedulingQueueName     = "scheduling-events-queue"
	SchedulingDLQName       = "scheduling-events-dlq"
	SchedulingDLQRoutingKey = "dlq.scheduling"

	// Routing patterns
	PaymentToSchedulingPattern = "payment.to.scheduling.#"

	// Routing keys for publishing
	BookingCompletedKey = "scheduling.to.learning.booking.completed"
	EventScheduledKey   = "scheduling.to.learning.event.scheduled"

	// Event types
	BookingCreationRequested = "BOOKING_CREATION_REQUESTED"
	BookingCompleted         = "BOOKING_COMPLETED"
	EventScheduled           = "EVENT_SCHEDULED"
)

type ConnectionProvider struct {
	config *config.RabbitMqConfig
	log    *logger.AppLogger
	conn   *amqp.Connection
	mu     sync.RWMutex
}

func NewConnectionProvider(config *config.RabbitMqConfig, log *logger.AppLogger) *ConnectionProvider {
	return &ConnectionProvider{
		config: config,
		log:    log,
	}
}

func (p *ConnectionProvider) Connect(ctx context.Context) error {
	p.mu.Lock()
	defer p.mu.Unlock()

	if p.conn != nil && !p.conn.IsClosed() {
		return nil
	}

	maxRetries := p.config.RetryCount
	var conErr error

	for attempt := 1; attempt <= maxRetries; attempt++ {
		select {
		case <-ctx.Done():
			return ctx.Err()
		default:
		}

		conn, err := p.createConnection()
		if err == nil {
			p.conn = conn
			go p.handleConnectionClose(conn)
			return nil
		}

		conErr = err

		if attempt >= maxRetries {
			return fmt.Errorf("failed to connect to RabbitMQ after %d attempts: %w", maxRetries, err)
		}

		delayMs := calculateRetryDelay(attempt, p.config.InitialRetryIntervalMs, p.config.MaxRetryIntervalMs, p.config.RetryMultiplier)
		p.log.Warnf("Failed to connect to RabbitMQ (attempt %d/%d): %v. Retrying in %dms",
			attempt, maxRetries, err, delayMs)
		time.Sleep(time.Duration(delayMs) * time.Millisecond)
	}

	return conErr
}

func (p *ConnectionProvider) GetConnection(ctx context.Context) (*amqp.Connection, error) {
	p.mu.RLock()
	conn := p.conn
	p.mu.RUnlock()

	if conn == nil || conn.IsClosed() {
		if err := p.Connect(ctx); err != nil {
			return nil, fmt.Errorf("failed to get or re-establish connection: %w", err)
		}
		p.mu.RLock()
		conn = p.conn
		p.mu.RUnlock()
	}

	if conn == nil || conn.IsClosed() {
		return nil, fmt.Errorf("failed to get a valid connection")
	}

	return conn, nil
}

func (p *ConnectionProvider) Close() error {
	p.mu.Lock()
	defer p.mu.Unlock()

	if p.conn != nil && !p.conn.IsClosed() {
		p.log.Warn("Closing RabbitMQ connection")
		return p.conn.Close()
	}
	return nil
}

func (p *ConnectionProvider) createConnection() (*amqp.Connection, error) {
	url := fmt.Sprintf("amqp://%s:%s@%s:%d/%s",
		p.config.UserName,
		p.config.Password,
		p.config.HostName,
		p.config.Port,
		p.config.VirtualHost)

	return amqp.Dial(url)
}

func (p *ConnectionProvider) handleConnectionClose(conn *amqp.Connection) {
	err := <-conn.NotifyClose(make(chan *amqp.Error))
	if err != nil {
		p.log.Error("Connection closed with error", err)
		go func() {
			for {
				err := <-conn.NotifyClose(make(chan *amqp.Error))
				if err != nil {
					p.log.Warnf("RabbitMQ connection lost: %v", err)
					_ = p.Connect(context.Background())
				}
			}
		}()
	} else {
		p.log.Warn("Connection closed gracefully")
	}

	p.mu.Lock()
	p.conn = nil
	p.mu.Unlock()
}

func calculateRetryDelay(attempt int, initialDelayMs int, maxDelayMs int, multiplier float64) int {
	delayMs := float64(initialDelayMs) * math.Pow(multiplier, float64(attempt-1))

	jitter := 0.8 + (rand.Float64() * 0.4)
	delayMs = min(delayMs*jitter, float64(maxDelayMs))

	return int(delayMs)
}

func declareExchange(ch *amqp.Channel, name string, exchangeType string) error {
	return ch.ExchangeDeclare(
		name,         // name
		exchangeType, // type
		true,         // durable
		false,        // auto-deleted
		false,        // internal
		false,        // no-wait
		nil,          // arguments
	)
}

func declareQueue(ch *amqp.Channel, name string, args amqp.Table) (amqp.Queue, error) {
	return ch.QueueDeclare(
		name,  // name
		true,  // durable
		false, // delete when unused
		false, // exclusive
		false, // no-wait
		args,  // arguments
	)
}

func bindQueue(ch *amqp.Channel, queueName, routingKey, exchangeName string) error {
	return ch.QueueBind(
		queueName,    // queue name
		routingKey,   // routing key
		exchangeName, // exchange
		false,        // no-wait
		nil,          // arguments
	)
}
