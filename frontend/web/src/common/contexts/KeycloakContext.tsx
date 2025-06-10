import React, {
  useRef,
  useEffect,
  createContext,
  useContext,
  useState,
} from "react";
import Keycloak from "keycloak-js";
import { KEYCLOAK_CONFIG } from "../configs";
import { Spinner } from "../components/ui/Spinner";
import ErrorDisplay from "../components/ui/ErrorDisplay";

interface KeycloakContextType {
  keycloak: Keycloak | null;
  initialized: boolean;
  authenticated: boolean;
}

const KeycloakContext = createContext<KeycloakContextType | undefined>(
  undefined
);

let keycloakInstance: Keycloak | null = null;
const getKeycloak = (): Keycloak => {
  if (!keycloakInstance) {
    keycloakInstance = new Keycloak({
      url: KEYCLOAK_CONFIG.URL,
      realm: KEYCLOAK_CONFIG.REALM,
      clientId: KEYCLOAK_CONFIG.CLIENT_ID,
    });
  }
  return keycloakInstance;
};

export const KeycloakProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const didInit = useRef(false);
  const keycloak = getKeycloak();

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    keycloak
      .init({
        onLoad: "check-sso",
        pkceMethod: "S256",
        silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
        checkLoginIframe: false,
      })
      .then((authenticated) => {
        console.log(
          authenticated
            ? "Keycloak: User is authenticated."
            : "Keycloak: User is anonymous."
        );
        setAuthenticated(authenticated);
      })
      .catch((err) => setError(err))
      .finally(() => setInitialized(true));
  }, [keycloak]);

  useEffect(() => {
    if (!keycloak) return;

    keycloak.onAuthSuccess = async () => {};
    keycloak.onAuthError = (errorData) => {
      console.error("Keycloak Auth Error:", errorData);
    };
    keycloak.onAuthLogout = () => {
      console.log("Keycloak User logged out");
    };
    keycloak.onTokenExpired = () => {
      console.log("Keycloak Token expired, attempting refresh via updateToken");
      keycloak.updateToken(30).catch(() => {
        console.error("Failed to refresh token, logging out");
        keycloak.logout();
      });
    };
  }, [keycloak]);

  if (!didInit)
    return (
      <Spinner message="Loading authentication.." size="lg" variant="primary" />
    );

  if (error)
    return (
      <ErrorDisplay error={error} title={"Failed to Load Authentication"} />
    );

  return (
    <KeycloakContext.Provider value={{ keycloak, authenticated, initialized }}>
      {children}
    </KeycloakContext.Provider>
  );
};

export const useKeycloak = (): KeycloakContextType => {
  const context = useContext(KeycloakContext);
  if (!context) {
    throw new Error("useKeycloak must be used within KeycloakProvider");
  }
  return context;
};
