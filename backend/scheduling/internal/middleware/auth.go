package middleware

import (
	"context"
	"net/http"
	"strings"

	ec "github.com/maksmelnyk/scheduling/internal/errors"
	hh "github.com/maksmelnyk/scheduling/internal/http"

	"github.com/google/uuid"
	"github.com/maksmelnyk/scheduling/internal/auth"
	"github.com/maksmelnyk/scheduling/internal/logger"
)

type userClaimsKey string
type userIdKey string

const UserIdKey userIdKey = "user_id"
const UserRolesKey userClaimsKey = "user_roles"

// AuthMiddleware validates JWT tokens
func AuthMiddleware(validator *auth.JWTValidator, log *logger.AppLogger) func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			authHeader := r.Header.Get("Authorization")
			if authHeader == "" {
				hh.WriteError(w, hh.NewUnauthorizedError(ec.ErrAuthFailed.Error(), "missing authorization header"))
				return
			}

			tokenString := strings.TrimPrefix(authHeader, "Bearer ")
			if tokenString == authHeader {
				hh.WriteError(w, hh.NewUnauthorizedError(ec.ErrAuthFailed.Error(), "invalid authorization header format"))
				return
			}

			claims, err := validator.ValidateToken(tokenString)
			if err != nil {
				log.Error("invalid token", err)
				hh.WriteError(w, hh.NewUnauthorizedError(ec.ErrAuthFailed.Error(), "invalid token"))
				return
			}

			userId, err := uuid.Parse(claims["sub"].(string))
			if err != nil {
				log.Error("invalid user id", err)
				hh.WriteError(w, hh.NewUnauthorizedError(ec.ErrAuthFailed.Error(), "invalid user id"))
				return
			}

			ctx := context.WithValue(r.Context(), UserIdKey, userId)

			realmAccess, ok := claims["realm_access"].(map[string]interface{})
			if ok {
				roles, ok := realmAccess["roles"].([]interface{})
				if ok {
					ctx = context.WithValue(ctx, UserRolesKey, roles)
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
			roles, ok := r.Context().Value(UserRolesKey).([]interface{})
			if !ok {
				hh.WriteError(w, hh.NewUnauthorizedError(ec.ErrAuthFailed.Error(), "unauthorized"))
				return
			}

			for _, role := range roles {
				if role == requiredRole {
					next.ServeHTTP(w, r)
					return
				}
			}

			hh.WriteError(w, hh.NewForbiddenError(ec.ErrAuthFailed.Error(), "forbidden"))
		})
	}
}
