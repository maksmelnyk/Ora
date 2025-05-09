package logger

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"time"

	"go.opentelemetry.io/contrib/bridges/otelzap"
	"go.opentelemetry.io/otel/sdk/log"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
	"gopkg.in/natefinch/lumberjack.v2"

	"github.com/maksmelnyk/scheduling/config"
)

type Logger interface {
	Error(message string, err ...error)
	Errorf(format string, args ...any)
	Panic(message string, fields ...Field)
	Panicf(format string, args ...any)
	Info(message string, fields ...Field)
	Infof(format string, args ...any)
	Warn(message string, fields ...Field)
	Warnf(format string, args ...any)
	Debugf(format string, args ...any)
	With(fields ...Field) Logger
}

type ctxKey string

const loggerKey ctxKey = "logger"

type Field struct {
	Key   string
	Value any
}

var _ Logger = (*AppLogger)(nil)

type AppLogger struct {
	logger *zap.Logger
}

func CustomISO8601TimeEncoder(t time.Time, enc zapcore.PrimitiveArrayEncoder) {
	enc.AppendString(t.UTC().Format(time.RFC3339))
}

func NewAppLogger(cfg config.LogConfig, provider *log.LoggerProvider) (*AppLogger, error) {
	consoleEncoder := zapcore.NewConsoleEncoder(zap.NewDevelopmentEncoderConfig())

	consoleCore := zapcore.NewCore(consoleEncoder, zapcore.AddSync(os.Stdout), zapcore.InfoLevel)

	cores := []zapcore.Core{consoleCore}

	if cfg.FilePath != "" {
		if err := os.MkdirAll(filepath.Dir(cfg.FilePath), 0755); err != nil {
			return nil, fmt.Errorf("create logs directory: %w", err)
		}

		fileWriter := zapcore.AddSync(&lumberjack.Logger{
			Filename:   cfg.FilePath,
			MaxSize:    cfg.MaxSize,
			MaxAge:     cfg.MaxAge,
			MaxBackups: cfg.MaxBackups,
			Compress:   cfg.Compress,
		})

		encoderConfig := zapcore.EncoderConfig{
			TimeKey:     "timestamp",
			LevelKey:    "level",
			MessageKey:  "message",
			EncodeTime:  CustomISO8601TimeEncoder,
			EncodeLevel: zapcore.CapitalLevelEncoder,
		}

		fileEncoder := zapcore.NewJSONEncoder(encoderConfig)

		fileLevel := zapcore.InfoLevel
		if level, err := zapcore.ParseLevel(cfg.Level); err == nil {
			fileLevel = level
		}

		fileCore := zapcore.NewCore(fileEncoder, fileWriter, fileLevel)
		cores = append(cores, fileCore)
	}

	if provider != nil {
		otelCore := otelzap.NewCore("github.com/maksmelnyk/scheduling/internal/logger", otelzap.WithLoggerProvider(provider))
		cores = append(cores, otelCore)
	}

	core := zapcore.NewTee(cores...)
	logger := zap.New(core, zap.AddCaller()).With(zap.String("service_name", cfg.ServiceName))

	return &AppLogger{logger: logger}, nil
}

func (l *AppLogger) Error(message string, err ...error) {
	if len(err) > 0 && err[0] != nil {
		l.logger.Error(message, zap.Error(err[0]))
	} else {
		l.logger.Error(message)
	}
}

func (l *AppLogger) Errorf(format string, args ...any) {
	l.logger.Error(fmt.Sprintf(format, args...))
}

func (l *AppLogger) Panic(message string, fields ...Field) {
	l.logger.Panic(message, mapToZapFields(fields)...)
}

func (l *AppLogger) Panicf(format string, args ...any) {
	l.logger.Panic(fmt.Sprintf(format, args...))
}

func (l *AppLogger) Info(message string, fields ...Field) {
	l.logger.Info(message, mapToZapFields(fields)...)
}

func (l *AppLogger) Infof(format string, args ...any) {
	l.logger.Info(fmt.Sprintf(format, args...))
}

func (l *AppLogger) Warn(message string, fields ...Field) {
	l.logger.Info(message, mapToZapFields(fields)...)
}

func (l *AppLogger) Warnf(format string, args ...any) {
	l.logger.Warn(fmt.Sprintf(format, args...))
}

func (l *AppLogger) Debug(message string, fields ...Field) {
	l.logger.Debug(message, mapToZapFields(fields)...)
}

func (l *AppLogger) Debugf(format string, args ...any) {
	l.logger.Debug(fmt.Sprintf(format, args...))
}

func (l *AppLogger) With(fields ...Field) Logger {
	zapFields := mapToZapFields(fields)
	logger := l.logger.With(zapFields...)
	return &AppLogger{logger: logger}
}

func WithLogger(ctx context.Context, logger Logger) context.Context {
	return context.WithValue(ctx, loggerKey, logger)
}

func FromContext(ctx context.Context, logger Logger) Logger {
	if ctx == nil {
		return logger
	}
	if logger, ok := ctx.Value(loggerKey).(Logger); ok {
		return logger
	}
	return logger
}

func mapToZapFields(fields []Field) []zap.Field {
	zapFields := make([]zap.Field, len(fields))
	for i, f := range fields {
		zapFields[i] = zap.Any(f.Key, f.Value)
	}
	return zapFields
}
