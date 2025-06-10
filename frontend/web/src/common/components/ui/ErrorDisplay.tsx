import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import Button from "./Button";
import { cn } from "../../utils";

interface ErrorDisplayProps {
  error: any;
  onRetry?: () => void;
  onRedirect?: () => void;
  title?: string;
  className?: string;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeConfig = {
  sm: {
    container: "py-8",
    icon: "w-12 h-12",
    title: "text-lg",
    message: "text-sm",
    spacing: "space-y-3",
  },
  md: {
    container: "py-12",
    icon: "w-16 h-16",
    title: "text-xl",
    message: "text-base",
    spacing: "space-y-4",
  },
  lg: {
    container: "py-16",
    icon: "w-20 h-20",
    title: "text-2xl",
    message: "text-lg",
    spacing: "space-y-6",
  },
};

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  onRedirect,
  title = "Something went wrong",
  className,
  showIcon = true,
  size = "md",
}) => {
  const config = sizeConfig[size];
  const is404 = error?.statusCode === 404;
  const errorTitle = is404 ? "Page not found" : title;
  const errorMessage = is404
    ? "The page you're looking for doesn't exist or has been moved."
    : error?.message || "An unexpected error occurred. Please try again later.";

  return (
    <div
      className={cn("text-center", config.container, config.spacing, className)}
      role="alert"
    >
      {showIcon && (
        <div className="flex justify-center mb-4">
          <AlertTriangle className={cn(config.icon, "text-ora-error")} />
        </div>
      )}

      <div className="space-y-2">
        <h2 className={cn(config.title, "ora-heading text-ora-navy")}>
          {errorTitle}
        </h2>

        <p
          className={cn(
            config.message,
            "ora-body text-ora-gray max-w-md mx-auto"
          )}
        >
          {errorMessage}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
        {!is404 && onRetry && (
          <Button
            onClick={onRetry}
            variant="outline"
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Try Again
          </Button>
        )}

        {onRedirect && (
          <Button
            onClick={onRedirect}
            variant={is404 ? "primary" : "secondary"}
            leftIcon={<Home className="w-4 h-4" />}
          >
            {is404 ? "Go Home" : "Go Back"}
          </Button>
        )}
      </div>
    </div>
  );
};

export const NotFoundError: React.FC<Omit<ErrorDisplayProps, "error">> = (
  props
) => <ErrorDisplay {...props} error={{ statusCode: 404 }} />;

export const NetworkError: React.FC<
  Omit<ErrorDisplayProps, "error" | "title">
> = (props) => (
  <ErrorDisplay
    {...props}
    error={{
      message:
        "Unable to connect to the server. Please check your internet connection.",
    }}
    title="Connection Error"
  />
);

export const UnauthorizedError: React.FC<
  Omit<ErrorDisplayProps, "error" | "title">
> = (props) => (
  <ErrorDisplay
    {...props}
    error={{ message: "You don't have permission to access this resource." }}
    title="Access Denied"
  />
);

export default ErrorDisplay;
