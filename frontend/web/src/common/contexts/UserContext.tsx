import React, { createContext, useContext } from "react";
import { User } from "../types/auth";
import { Spinner } from "../components/ui/Spinner";
import ErrorDisplay from "../components/ui/ErrorDisplay";
import { ROLES } from "../constants/roles";
import { useMyProfile } from "@/features/profiles/hooks/useProfile";
import { useKeycloak } from "./KeycloakContext";

interface UserContextType {
  user: User | null;
  isEducator: boolean;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { keycloak } = useKeycloak();
  const { data: myProfileData, isLoading, error } = useMyProfile();
  const roles = keycloak?.tokenParsed?.realm_access?.roles || [];
  const email = keycloak?.tokenParsed?.email;

  if (isLoading)
    return <Spinner message="Loading user.." size="lg" variant="primary" />;

  if (error)
    return <ErrorDisplay error={error} title={"Failed to Load User"} />;

  return (
    <UserContext.Provider
      value={{
        user: myProfileData
          ? {
              ...myProfileData,
              roles: roles,
              email: email,
            }
          : null,
        isEducator: myProfileData ? roles.includes(ROLES.EDUCATOR) : false,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const useRequiredUser = () => {
  const { user, isEducator } = useUser();

  if (!user) {
    throw new Error("Authenticated user required but not found.");
  }

  return { user, isEducator };
};
