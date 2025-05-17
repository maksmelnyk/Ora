package auth

import (
	"context"
	"errors"

	"github.com/google/uuid"
)

type userClaimsKey string
type userIdKey string

const UserIdKey userIdKey = "user_id"
const UserRolesKey userClaimsKey = "user_roles"

func GetUserID(ctx context.Context) (uuid.UUID, error) {
	userId, ok := ctx.Value(UserIdKey).(uuid.UUID)
	if !ok {
		return uuid.Nil, errors.New("user ID not found in context")
	}
	return userId, nil
}
