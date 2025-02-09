package booking

import (
	"net/http"

	"github.com/jmoiron/sqlx"

	"github.com/maksmelnyk/scheduling/internal/logger"
)

func InitializeBookingModule(log logger.Logger, db *sqlx.DB) http.Handler {
	repo := NewBookingRepository(db)
	service := NewBookingService(log, repo)
	handler := NewBookingHandler(service)
	return Routes(handler)
}
