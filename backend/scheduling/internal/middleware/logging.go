package middleware

import (
	"net/http"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"

	"github.com/maksmelnyk/scheduling/internal/logger"
)

type statusWriter struct {
	http.ResponseWriter
	statusCode int
}

func (w *statusWriter) WriteHeader(code int) {
	w.statusCode = code
	w.ResponseWriter.WriteHeader(code)
}

func getUserIdFromToken(authHeader string) string {
	if authHeader != "" {
		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		token, _, err := new(jwt.Parser).ParseUnverified(tokenString, jwt.MapClaims{})
		if err == nil {
			if claims, ok := token.Claims.(jwt.MapClaims); ok {
				userID, _ := claims["sub"].(string)
				return userID
			}
		}
	}

	return ""
}

func LoggingMiddleware(log *logger.AppLogger) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			start := time.Now()
			sw := &statusWriter{ResponseWriter: w, statusCode: http.StatusOK}

			midLogger := log.With(
				logger.Field{Key: "request_id", Value: uuid.New().String()},
				logger.Field{Key: "http_method", Value: r.Method},
				logger.Field{Key: "http_path", Value: r.URL.Path},
				logger.Field{Key: "http_query", Value: r.URL.RawQuery},
				logger.Field{Key: "client_ip", Value: r.RemoteAddr},
				logger.Field{Key: "user_id", Value: getUserIdFromToken(r.Header.Get("Authorization"))},
			)

			r = r.WithContext(logger.WithLogger(r.Context(), midLogger))

			next.ServeHTTP(sw, r)

			duration := time.Since(start)

			midLogger = midLogger.With(
				logger.Field{Key: "status_code", Value: sw.statusCode},
				logger.Field{Key: "duration_ms", Value: duration.Milliseconds()},
			)

			if sw.statusCode >= 500 {
				midLogger.Error("Request completed with server error")
			} else if sw.statusCode >= 400 {
				midLogger.Warn("Request completed with user error")
			} else {
				midLogger.Info("Request completed successfully")
			}
		})
	}
}
