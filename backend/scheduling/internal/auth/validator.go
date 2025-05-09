package auth

import (
	"errors"
	"fmt"

	"github.com/golang-jwt/jwt/v5"
)

type JWTValidator struct {
	jwkManager *JWKManager
	issuer     string
	audience   string
}

// NewJWTValidator initializes a JWTValidator
func NewJWTValidator(jwkManager *JWKManager, issuer, audience string) *JWTValidator {
	return &JWTValidator{jwkManager: jwkManager, issuer: issuer, audience: audience}
}

// ValidateToken validates a JWT token using the JWKManager
func (v *JWTValidator) ValidateToken(tokenString string) (map[string]any, error) {
	x := func(token *jwt.Token) (any, error) {
		kid, ok := token.Header["kid"].(string)
		if !ok {
			return nil, errors.New("kid header is missing")
		}

		return v.jwkManager.GetJWK(kid)
	}

	parsedToken, err := jwt.Parse(tokenString, x, jwt.WithAudience(v.audience), jwt.WithIssuer(v.issuer))

	if err != nil {
		return nil, fmt.Errorf("failed to validate token: %w", err)
	}

	if !parsedToken.Valid {
		return nil, errors.New("invalid token")
	}

	claims, ok := parsedToken.Claims.(jwt.MapClaims)
	if !ok {
		return nil, fmt.Errorf("failed to parse claims")
	}

	return claims, nil
}
