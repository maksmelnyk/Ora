import React, {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useState,
} from "react";
import { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useKeycloak } from "./KeycloakContext";
import { authenticatedApis } from "../api/axiosInstance";
import { parseAxiosError } from "../utils";
import { UnauthorizedError } from "../errors/AppError";

interface AuthContextType {
  login: () => void;
  logout: () => void;
  error: string | null;
  isInitialized: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { keycloak, authenticated, initialized } = useKeycloak();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(() => {
    setError(null);

    const currentPath = window.location.pathname + window.location.search;
    const redirectUri =
      currentPath === "/signup"
        ? window.location.origin + "/"
        : window.location.origin + currentPath;

    keycloak?.login({ redirectUri });
  }, [keycloak]);

  const logout = useCallback(() => {
    setError(null);
    keycloak?.logout();
  }, [keycloak]);

  useEffect(() => {
    if (!initialized) {
      setIsLoading(true);
      return;
    }
    setIsLoading(false);
  }, [initialized]);

  useEffect(() => {
    if (!keycloak) return;

    const requestInterceptor = async (config: InternalAxiosRequestConfig) => {
      if (keycloak.authenticated && keycloak.token) {
        try {
          await keycloak.updateToken(30);
          config.headers = config.headers || {};
          config.headers["Authorization"] = `Bearer ${keycloak.token}`;
        } catch (error) {
          logout();
          return Promise.reject(new Error("Session issue. Please try again."));
        }
      }
      return config;
    };

    const responseErrorInterceptor = (error: AxiosError) => {
      const parsedError = parseAxiosError(error);
      console.warn(parsedError);
      if (parsedError instanceof UnauthorizedError) {
        logout();
      }
      return Promise.reject(parsedError);
    };

    const requestInterceptorIds: number[] = [];
    const responseInterceptorIds: number[] = [];

    authenticatedApis.forEach((api) => {
      requestInterceptorIds.push(
        api.interceptors.request.use(requestInterceptor)
      );
      responseInterceptorIds.push(
        api.interceptors.response.use((res) => res, responseErrorInterceptor)
      );
    });

    return () => {
      authenticatedApis.forEach((api, index) => {
        api.interceptors.request.eject(requestInterceptorIds[index]);
        api.interceptors.response.eject(responseInterceptorIds[index]);
      });
    };
  }, [keycloak, logout]);

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        error,
        isInitialized: initialized,
        isAuthenticated: authenticated,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
