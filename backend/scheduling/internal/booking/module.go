package booking

import (
	"net/http"

	"github.com/jmoiron/sqlx"

	"github.com/maksmelnyk/scheduling/config"
	"github.com/maksmelnyk/scheduling/internal/logger"
	"github.com/maksmelnyk/scheduling/internal/messaging"
	"github.com/maksmelnyk/scheduling/internal/products"
)

func InitializeBookingService(
	log logger.Logger,
	db *sqlx.DB,
	cfg *config.ExternalServiceConfig,
	httpClient *http.Client,
	publisher *messaging.Publisher,
) *BookingService {
	repo := NewBookingRepository(db)
	client := products.NewProductServiceClient(*cfg, httpClient)
	service := NewBookingService(log, repo, client, publisher)
	return service
}

func InitializeBookingHTTPHandler(service *BookingService) http.Handler {
	handler := NewBookingHandler(service)
	return Routes(handler)
}
