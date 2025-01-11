package main

import (
	"net/http"
	"time"

	"github.com/jmoiron/sqlx"

	"github.com/go-chi/chi/v5"
	cm "github.com/go-chi/chi/v5/middleware"

	"github.com/maksmelnyk/scheduling/config"
	"github.com/maksmelnyk/scheduling/internal/auth"
	"github.com/maksmelnyk/scheduling/internal/database"
	"github.com/maksmelnyk/scheduling/internal/logger"
	"github.com/maksmelnyk/scheduling/internal/middleware"

	"github.com/maksmelnyk/scheduling/internal/booking"
	"github.com/maksmelnyk/scheduling/internal/schedule"
)

func main() {
	logger.InitLogger()

	c := config.LoadConfig()

	jwksProvider := auth.NewJWKManager(c.Keycloak.JwksURI, time.Hour)
	validator := auth.NewJWTValidator(jwksProvider, c.Keycloak.Issuer, c.Keycloak.Audience)

	db, err := database.NewPgSqlDb(&c.Postgres)
	if err != nil {
		logger.Errorf("Postgresql init: %s", err)
	} else {
		logger.Infof("Postgres connected, Status: %#v", db.Stats())
	}
	defer func(db *sqlx.DB) {
		err := db.Close()
		if err != nil {
			logger.Errorf("Postgresql close error: %s", err)
		}
	}(db)

	r := chi.NewRouter()

	r.Use(cm.CleanPath)
	r.Use(middleware.LoggingMiddleware)
	r.Use(cm.Recoverer)
	r.Use(middleware.AuthMiddleware(validator))

	r.Mount("/api/v1/schedules", schedule.InitializeScheduleModule(db))
	r.Mount("/api/v1/bookings", booking.InitializeBookingModule(db))

	logger.Infof("Starting server on : %s", c.Server.Port)
	if err := http.ListenAndServe(":"+c.Server.Port, r); err != nil {
		logger.Errorf("Server failed to start: %v", err)
	}
}
