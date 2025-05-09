package config

import (
	"os"
	"strconv"
)

type Config struct {
	Server    ServerConfig
	Postgres  PostgresConfig
	Keycloak  KeycloakConfig
	Log       LogConfig
	Telemetry TelemetryConfig
	RabbitMq  RabbitMqConfig
	External  ExternalServiceConfig
}

type ServerConfig struct {
	Port string
	Name string
}

type PostgresConfig struct {
	Host     string
	Port     string
	User     string
	Password string
	DbName   string
	PgDriver string
}

type KeycloakConfig struct {
	JwksURI  string
	Issuer   string
	Audience string
}

type LogConfig struct {
	EnableCentralStorage bool
	ServiceName          string
	Level                string
	FilePath             string
	MaxSize              int
	MaxAge               int
	MaxBackups           int
	Compress             bool
}

type TelemetryConfig struct {
	OtelEndpoint      string
	EnableOtelTracing bool
	EnableOtelMetrics bool
	EnableOtelLogging bool
}

type RabbitMqConfig struct {
	HostName                string
	Port                    int
	VirtualHost             string
	UserName                string
	Password                string
	Exchange                string
	DeadLetterExchange      string
	MessageTTL              int
	RetryCount              int
	InitialRetryIntervalMs  int
	MaxRetryIntervalMs      int
	RetryMultiplier         float64
	PrefetchCount           int
	PublishConfirmTimeoutMs int
	ConcurrentConsumers     int
}

type ExternalServiceConfig struct {
	LearningServiceUrl string
}

func GetEnvWithDefault[T any](key string, defaultValue T) T {
	value, exists := os.LookupEnv(key)
	if !exists {
		return defaultValue
	}

	var result T
	switch any(defaultValue).(type) {
	case string:
		result = any(value).(T)
	case int:
		if v, err := strconv.Atoi(value); err == nil {
			result = any(v).(T)
		} else {
			result = defaultValue
		}
	case bool:
		if v, err := strconv.ParseBool(value); err == nil {
			result = any(v).(T)
		} else {
			result = defaultValue
		}
	case float64:
		if v, err := strconv.ParseFloat(value, 64); err == nil {
			result = any(v).(T)
		} else {
			result = defaultValue
		}
	default:
		result = defaultValue
	}

	return result
}

func LoadConfig() Config {
	serverConfig := ServerConfig{
		Port: GetEnvWithDefault("SCHEDULING_PORT", "8084"),
		Name: GetEnvWithDefault("SCHEDULING_NAME", "scheduling-service"),
	}

	postgresConfig := PostgresConfig{
		Host:     GetEnvWithDefault("POSTGRES_HOST", "localhost"),
		Port:     GetEnvWithDefault("POSTGRES_PORT", "5433"),
		User:     GetEnvWithDefault("POSTGRES_USER", "postgres"),
		Password: GetEnvWithDefault("POSTGRES_PASSWORD", ""),
		PgDriver: GetEnvWithDefault("POSTGRES_DRIVER", ""),
		DbName:   GetEnvWithDefault("SCHEDULING_DB_NAME", "scheduling"),
	}

	keycloakConfig := KeycloakConfig{
		JwksURI:  GetEnvWithDefault("KEYCLOAK_JWKS_URI", ""),
		Issuer:   GetEnvWithDefault("KEYCLOAK_ISSUER_URI", ""),
		Audience: GetEnvWithDefault("SCHEDULING_KEYCLOAK_CLIENT_ID", ""),
	}

	logConfig := LogConfig{
		EnableCentralStorage: GetEnvWithDefault("LOG_ENABLE_CENTRAL_STORAGE", false),
		ServiceName:          GetEnvWithDefault("SCHEDULING_NAME", "scheduling-service"),
		Level:                GetEnvWithDefault("SCHEDULING_LOG_LEVEL", "info"),
		FilePath:             GetEnvWithDefault("SCHEDULING_LOG_FILE_PATH", "../../logs/log.txt"),
		MaxSize:              GetEnvWithDefault("SCHEDULING_LOG_MAX_SIZE", 10),
		MaxAge:               GetEnvWithDefault("SCHEDULING_LOG_MAX_AGE", 30),
		MaxBackups:           GetEnvWithDefault("SCHEDULING_LOG_MAX_BACKUPS", 5),
		Compress:             GetEnvWithDefault("SCHEDULING_LOG_COMPRESS", true),
	}

	telemetryConfig := TelemetryConfig{
		OtelEndpoint:      GetEnvWithDefault("OTEL_GRPC_URL", "http://localhost:4317"),
		EnableOtelTracing: GetEnvWithDefault("SCHEDULING_OTEL_TRACING", true),
		EnableOtelMetrics: GetEnvWithDefault("SCHEDULING_OTEL_METRICS", true),
		EnableOtelLogging: GetEnvWithDefault("SCHEDULING_OTEL_LOGGING", true),
	}

	rabbitMqConfig := RabbitMqConfig{
		HostName:                GetEnvWithDefault("RABBITMQ_HOST", "localhost"),
		Port:                    GetEnvWithDefault("RABBITMQ_PORT", 5672),
		VirtualHost:             GetEnvWithDefault("RABBITMQ_VHOST", "/"),
		UserName:                GetEnvWithDefault("RABBITMQ_USER", "guest"),
		Password:                GetEnvWithDefault("RABBITMQ_PASS", "guest"),
		Exchange:                GetEnvWithDefault("RABBITMQ_EXCHANGE", ""),
		DeadLetterExchange:      GetEnvWithDefault("RABBITMQ_DLQ_EXCHANGE", ""),
		MessageTTL:              GetEnvWithDefault("RABBITMQ_MESSAGE_TTL", 30000),
		RetryCount:              GetEnvWithDefault("RABBITMQ_RETRY_COUNT", 3),
		InitialRetryIntervalMs:  GetEnvWithDefault("RABBITMQ_INITIAL_RETRY_INTERVAL", 1000),
		MaxRetryIntervalMs:      GetEnvWithDefault("RABBITMQ_MAX_RETRY_INTERVAL", 10000),
		RetryMultiplier:         GetEnvWithDefault("RABBITMQ_RETRY_MULTIPLIER", 2.0),
		PrefetchCount:           GetEnvWithDefault("RABBITMQ_PREFETCH_COUNT", 10),
		PublishConfirmTimeoutMs: GetEnvWithDefault("RABBITMQ_PUBLISH_CONFIRM_TIMEOUT", 5000),
		ConcurrentConsumers:     GetEnvWithDefault("RABBITMQ_CONCURRENT_CONSUMERS", 3),
	}

	externalServiceConfig := ExternalServiceConfig{
		LearningServiceUrl: GetEnvWithDefault("LEARNING_URL", ""),
	}

	return Config{serverConfig, postgresConfig, keycloakConfig, logConfig, telemetryConfig, rabbitMqConfig, externalServiceConfig}
}
