package schedule

import (
	"net/http"

	"github.com/jmoiron/sqlx"

	"github.com/maksmelnyk/scheduling/internal/logger"
)

func InitializeScheduleModule(log logger.Logger, db *sqlx.DB) http.Handler {
	repo := NewScheduleRepository(db)
	service := NewScheduleService(log, repo)
	handler := NewScheduleHandler(service)
	return Routes(handler)
}
