package config

import (
	"os"
)

type Config struct {
	Server   ServerConfig
	Postgres PostgresConfig
	Keycloak KeycloakConfig
}

type ServerConfig struct {
	Port string
}

type PostgresConfig struct {
	Host     string
	Port     string
	User     string
	Password string
	DbName   string
	PgDriver string
}

type KeycloakConfig struct {
	JwksURI  string
	Issuer   string
	Audience string
}

func LoadConfig() Config {
	serverConfig := ServerConfig{
		//TODO: read from env
		Port: "8084", //GetEnv("SERVER_PORT"),
	}

	postgresConfig := PostgresConfig{
		Host:     GetEnv("POSTGRES_HOST"),
		Port:     GetEnv("POSTGRES_PORT"),
		User:     GetEnv("POSTGRES_USER"),
		Password: GetEnv("POSTGRES_PASSWORD"),
		PgDriver: GetEnv("POSTGRES_DRIVER"),
		DbName:   GetEnv("POSTGRES_SCHEDULING_DBNAME"),
	}

	keycloakConfig := KeycloakConfig{
		JwksURI:  GetEnv("KEYCLOAK_JWKS_URI"),
		Issuer:   GetEnv("KEYCLOAK_ISSUER_URI"),
		Audience: GetEnv("KEYCLOAK_SCHEDULING_CLIENT_ID"),
	}

	return Config{serverConfig, postgresConfig, keycloakConfig}
}

func GetEnv(key string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return ""
}
