import { Spinner } from "../ui/Spinner";
import { useAuth } from "../../contexts/AuthContext";

export const InitialAuthLoader: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isLoading, isInitialized } = useAuth();

  if (!isInitialized || isLoading) {
    return (
      <Spinner message="Loading authentication.." size="lg" variant="primary" />
    );
  }

  return <>{children}</>;
};

export default InitialAuthLoader;
