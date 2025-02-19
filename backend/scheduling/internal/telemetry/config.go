package telemetry

import (
	"context"
	"fmt"
	"net/url"
	"strings"

	"github.com/maksmelnyk/scheduling/config"
	"github.com/maksmelnyk/scheduling/internal/logger"
	otelmetric "go.opentelemetry.io/otel/metric"
	"go.opentelemetry.io/otel/sdk/log"
	"go.opentelemetry.io/otel/sdk/resource"
	semconv "go.opentelemetry.io/otel/semconv/v1.26.0"
	oteltrace "go.opentelemetry.io/otel/trace"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

type Telemetry struct {
	shutdownFuncs []func(context.Context) error
	Logger        *logger.AppLogger
	Tracer        oteltrace.Tracer
	Meter         otelmetric.Meter
}

func parseEndpoint(endpoint string) (string, error) {
	if endpoint = strings.TrimSpace(endpoint); endpoint == "" {
		return "", nil
	}

	if !strings.Contains(endpoint, "://") {
		return endpoint, nil
	}

	parsedURL, err := url.Parse(endpoint)
	if err != nil {
		return "", err
	}

	return parsedURL.Host, nil
}

func initConn(endpoint string) (*grpc.ClientConn, error) {
	parsedEndpoint, err := parseEndpoint(endpoint)
	if err != nil {
		return nil, err
	}

	conn, err := grpc.NewClient(parsedEndpoint, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		return nil, fmt.Errorf("failed to create gRPC connection to collector: %w", err)
	}

	return conn, err
}

func Init(ctx context.Context, cfg config.Config) (*Telemetry, error) {
	tel := &Telemetry{}

	if !cfg.Telemetry.EnableOtelLogging && !cfg.Telemetry.EnableOtelMetrics && !cfg.Telemetry.EnableOtelTracing {
		log, err := logger.NewAppLogger(cfg.Log, nil)
		if err != nil {
			return tel, err
		}
		tel.Logger = log
		return tel, nil
	}

	conn, err := initConn(cfg.Telemetry.OtelEndpoint)
	if err != nil {
		return nil, err
	}

	res, err := resource.Merge(resource.Default(), resource.NewWithAttributes(semconv.SchemaURL, semconv.ServiceName(cfg.Server.Name)))
	if err != nil {
		return nil, err
	}

	var loggerProvider *log.LoggerProvider
	if cfg.Telemetry.EnableOtelLogging {
		lp, err := InitLoggerProvider(ctx, res, conn)
		if err != nil {
			return nil, err
		}
		loggerProvider = lp
		tel.shutdownFuncs = append(tel.shutdownFuncs, lp.Shutdown)
	}

	log, err := logger.NewAppLogger(cfg.Log, loggerProvider)
	if err != nil {
		return tel, err
	}
	tel.Logger = log

	if cfg.Telemetry.EnableOtelTracing {
		tp, err := InitTracerProvider(ctx, res, conn)
		if err != nil {
			return nil, err
		}
		tel.shutdownFuncs = append(tel.shutdownFuncs, tp.Shutdown)
		tel.Tracer = tp.Tracer(cfg.Server.Name)
	}

	if cfg.Telemetry.EnableOtelMetrics {
		mp, err := InitMeterProvider(ctx, res, conn)
		if err != nil {
			return nil, err
		}
		tel.shutdownFuncs = append(tel.shutdownFuncs, mp.Shutdown)
		tel.Meter = mp.Meter(cfg.Server.Name)
	}

	return tel, nil
}

func (t *Telemetry) Shutdown(ctx context.Context) error {
	var errs []error
	for _, fn := range t.shutdownFuncs {
		if err := fn(ctx); err != nil {
			errs = append(errs, err)
		}
	}
	if len(errs) > 0 {
		return fmt.Errorf("shutdown errors: %v", errs)
	}
	return nil
}
