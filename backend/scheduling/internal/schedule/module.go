package schedule

import (
	"net/http"

	"github.com/jmoiron/sqlx"
)

func InitializeScheduleModule(db *sqlx.DB) http.Handler {
	repo := NewScheduleRepository(db)
	service := NewScheduleService(repo)
	handler := NewScheduleHandler(service)
	return Routes(handler)
}
