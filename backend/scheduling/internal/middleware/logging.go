package middleware

import (
	"net/http"
	"time"

	log "github.com/maksmelnyk/scheduling/internal/logger"
)

func LoggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		log.Infof("Started %s %s", r.Method, r.URL.Path)

		next.ServeHTTP(w, r)

		duration := time.Since(start)
		log.Infof("Completed %s %s in %v", r.Method, r.URL.Path, duration)
	})
}
