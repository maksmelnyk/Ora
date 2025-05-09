package auth

import (
	"crypto/rsa"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"math/big"
	"net/http"
	"sync"
	"time"
)

// JWK represents a single JSON Web Key
type JWK struct {
	Kid string `json:"kid"`
	N   string `json:"n"`
	E   string `json:"e"`
}

// JWKSet represents a set of JWKs
type JWKSet struct {
	Keys []JWK `json:"keys"`
}

// JWKManager handles fetching and caching JWKs
type JWKManager struct {
	jwksURI    string
	cache      JWKSet
	cacheMutex sync.RWMutex
	cacheTTL   time.Duration
	lastUpdate time.Time
}

// NewJWKManager initializes a new JWKManager
func NewJWKManager(jwksURI string, cacheTTL time.Duration) *JWKManager {
	return &JWKManager{
		jwksURI:  jwksURI,
		cacheTTL: cacheTTL,
	}
}

// GetJWK fetches and caches the JWK set, and retrieves the key by kid
func (j *JWKManager) GetJWK(kid string) (*rsa.PublicKey, error) {
	j.cacheMutex.RLock()
	if time.Since(j.lastUpdate) < j.cacheTTL && j.cache.Keys != nil {
		defer j.cacheMutex.RUnlock()
		return j.findKeyByID(kid)
	}
	j.cacheMutex.RUnlock()

	j.cacheMutex.Lock()
	defer j.cacheMutex.Unlock()

	resp, err := http.Get(j.jwksURI)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch JWKs: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("failed to fetch JWKs: received status %d", resp.StatusCode)
	}

	var jwkSet JWKSet
	if err := json.NewDecoder(resp.Body).Decode(&jwkSet); err != nil {
		return nil, fmt.Errorf("failed to parse JWKs: %w", err)
	}

	j.cache = jwkSet
	j.lastUpdate = time.Now()
	return j.findKeyByID(kid)
}

// findKeyByID finds a key in the cached JWK set by its kid
func (j *JWKManager) findKeyByID(kid string) (*rsa.PublicKey, error) {
	for _, key := range j.cache.Keys {
		if key.Kid == kid {
			return convertJWKToPublicKey(key)
		}
	}
	return nil, errors.New("key with the given kid not found")
}

// convertJWKToPublicKey converts a JWK to an rsa.PublicKey
func convertJWKToPublicKey(jwk JWK) (*rsa.PublicKey, error) {
	nBytes, err := base64.RawURLEncoding.DecodeString(jwk.N)
	if err != nil {
		return nil, fmt.Errorf("failed to decode modulus: %w", err)
	}

	eBytes, err := base64.RawURLEncoding.DecodeString(jwk.E)
	if err != nil {
		return nil, fmt.Errorf("failed to decode exponent: %w", err)
	}

	return &rsa.PublicKey{
		N: new(big.Int).SetBytes(nBytes),
		E: int(new(big.Int).SetBytes(eBytes).Uint64()),
	}, nil
}
