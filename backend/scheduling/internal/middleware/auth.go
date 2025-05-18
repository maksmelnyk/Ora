package middleware

import (
	"context"
	"net/http"
	"strings"

	"github.com/maksmelnyk/scheduling/internal/api"
	"github.com/maksmelnyk/scheduling/internal/apperrors"

	"github.com/google/uuid"
	"github.com/maksmelnyk/scheduling/internal/auth"
	"github.com/maksmelnyk/scheduling/internal/logger"
)

// AuthMiddleware validates JWT tokens
func AuthMiddleware(validator *auth.JWTValidator, log *logger.AppLogger, publicRoutes []string) func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			for _, route := range publicRoutes {
				if strings.HasPrefix(r.URL.Path, route) {
					next.ServeHTTP(w, r)
					return
				}
			}

			authHeader := r.Header.Get("Authorization")
			if authHeader == "" {
				log.Error("missing authorization header")
				api.WriteError(w, apperrors.NewUnauthorized("Missing authorization header"))
				return
			}

			tokenString := strings.TrimPrefix(authHeader, "Bearer ")
			if tokenString == authHeader {
				log.Error("invalid authorization header format")
				api.WriteError(w, apperrors.NewUnauthorized("Invalid token"))
				return
			}

			claims, err := validator.ValidateToken(tokenString)
			if err != nil {
				log.Error("invalid token", err)
				api.WriteError(w, apperrors.NewUnauthorized("Invalid token", err))
				return
			}

			userId, err := uuid.Parse(claims["sub"].(string))
			if err != nil {
				log.Error("invalid user id", err)
				api.WriteError(w, apperrors.NewUnauthorized("Invalid token", err))
				return
			}

			ctx := context.WithValue(r.Context(), auth.UserIdKey, userId)

			realmAccess, ok := claims["realm_access"].(map[string]any)
			if ok {
				roles, ok := realmAccess["roles"].([]any)
				if ok {
					ctx = context.WithValue(ctx, auth.UserRolesKey, roles)
				}
			}

			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

// RoleAuthMiddleware checks if the user has the required role
func RoleAuthMiddleware(requiredRole string) func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			roles, ok := r.Context().Value(auth.UserRolesKey).([]any)
			if !ok {
				api.WriteError(w, apperrors.NewUnauthorized("Invalid token"))
				return
			}

			for _, role := range roles {
				if role == requiredRole {
					next.ServeHTTP(w, r)
					return
				}
			}

			api.WriteError(w, apperrors.NewForbidden("Access denied"))
		})
	}
}
