import { Navigate, Outlet } from "react-router-dom";
import { routes } from "../../constants/routes";
import { useAuth } from "../../contexts/AuthContext";
import { Spinner } from "../ui/Spinner";
import { useUser } from "../../contexts/UserContext";

interface AuthGuardProps {
  requiredRoles?: string[];
  redirectPath?: string;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  requiredRoles,
  redirectPath = routes.public.home,
}) => {
  const { isAuthenticated, isInitialized, isLoading } = useAuth();
  const { user } = useUser();

  if (isLoading || !isInitialized || (isAuthenticated && !user)) {
    return (
      <Spinner message="Loading authentication.." size="lg" variant="primary" />
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  if (
    requiredRoles &&
    !requiredRoles.some((role) => user?.roles?.includes(role))
  ) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default AuthGuard;
