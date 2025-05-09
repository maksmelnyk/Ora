package schedule

import (
	"net/http"

	"github.com/jmoiron/sqlx"

	"github.com/maksmelnyk/scheduling/config"
	"github.com/maksmelnyk/scheduling/internal/logger"
	"github.com/maksmelnyk/scheduling/internal/messaging"
	"github.com/maksmelnyk/scheduling/internal/products"
)

func InitializeScheduleService(
	log logger.Logger,
	db *sqlx.DB,
	cfg *config.ExternalServiceConfig,
	httpClient *http.Client,
	publisher *messaging.Publisher,
) *ScheduleService {
	repo := NewScheduleRepository(db)
	client := products.NewProductServiceClient(*cfg, httpClient)
	service := NewScheduleService(log, repo, client, publisher)
	return service
}

func InitializeScheduleHTTPHandler(service *ScheduleService) http.Handler {
	handler := NewScheduleHandler(service)
	return Routes(handler)
}
