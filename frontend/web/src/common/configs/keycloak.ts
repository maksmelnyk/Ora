import { env } from "./env";

interface KeycloakConfig {
  URL: string;
  REALM: string;
  CLIENT_ID: string;
}

export const KEYCLOAK_CONFIG: KeycloakConfig = {
  URL:
    env.REACT_APP_KEYCLOAK_BASE_URL ||
    env.VITE_KEYCLOAK_BASE_URL ||
    "http://localhost:8080",
  REALM: env.REACT_APP_KEYCLOAK_REALM || env.VITE_KEYCLOAK_REALM || "ora",
  CLIENT_ID:
    env.REACT_APP_KEYCLOAK_CLIENT_ID ||
    env.VITE_KEYCLOAK_CLIENT_ID ||
    "frontend-app",
};
