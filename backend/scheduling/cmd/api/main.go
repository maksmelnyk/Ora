package main

import (
	"context"
	"log"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	cm "github.com/go-chi/chi/v5/middleware"
	"github.com/jmoiron/sqlx"
	"go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp"
	"go.opentelemetry.io/otel"

	"github.com/maksmelnyk/scheduling/config"
	"github.com/maksmelnyk/scheduling/internal/auth"
	"github.com/maksmelnyk/scheduling/internal/booking"
	"github.com/maksmelnyk/scheduling/internal/database"
	"github.com/maksmelnyk/scheduling/internal/middleware"
	"github.com/maksmelnyk/scheduling/internal/schedule"
	"github.com/maksmelnyk/scheduling/internal/telemetry"
)

func main() {
	cfg := config.LoadConfig()

	ctx := context.Background()

	tel, err := telemetry.Init(ctx, cfg)
	if err != nil {
		log.Fatalf("failed to initialize telemetry: %v", err)
	}
	defer func() {
		if err := tel.Shutdown(ctx); err != nil {
			log.Printf("failed to shutdown telemetry: %v", err)
		}
	}()

	jwksProvider := auth.NewJWKManager(cfg.Keycloak.JwksURI, time.Hour)
	validator := auth.NewJWTValidator(jwksProvider, cfg.Keycloak.Issuer, cfg.Keycloak.Audience)

	db, err := database.NewPgSqlDb(&cfg.Postgres)
	if err != nil {
		tel.Logger.Panicf("Postgresql init: %s", err)
	}
	defer func(db *sqlx.DB) {
		err := db.Close()
		if err != nil {
			tel.Logger.Panicf("Postgresql close error: %s", err)
		}
	}(db)

	r := chi.NewRouter()
	r.Use(cm.CleanPath)
	r.Use(cm.Recoverer)
	r.Use(otelhttp.NewMiddleware("HTTPServer",
		otelhttp.WithSpanNameFormatter(func(operation string, r *http.Request) string {
			return r.Method + " " + r.URL.Path
		}),
		otelhttp.WithMeterProvider(otel.GetMeterProvider()),
	))
	r.Use(middleware.LoggingMiddleware(tel.Logger))
	r.Use(middleware.AuthMiddleware(validator, tel.Logger))

	r.Mount("/api/v1/schedules", schedule.InitializeScheduleModule(tel.Logger, db))
	r.Mount("/api/v1/bookings", booking.InitializeBookingModule(tel.Logger, db))

	tel.Logger.Infof("Starting server on : %s", cfg.Server.Port)
	if err := http.ListenAndServe(":"+cfg.Server.Port, r); err != nil {
		tel.Logger.Panicf("Server failed to start: %v", err)
	}
}
