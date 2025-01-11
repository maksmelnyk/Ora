package booking

import (
	"net/http"

	"github.com/jmoiron/sqlx"
)

func InitializeBookingModule(db *sqlx.DB) http.Handler {
	repo := NewBookingRepository(db)
	service := NewBookingService(repo)
	handler := NewBookingHandler(service)
	return Routes(handler)
}
