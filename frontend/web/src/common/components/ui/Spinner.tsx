import React from "react";
import { cn } from "../../utils";

type SpinnerSize = "xs" | "sm" | "md" | "lg" | "xl";
type SpinnerVariant =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "error"
  | "white";

interface SpinnerProps {
  message?: string;
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  showMessage?: boolean;
  fullScreen?: boolean;
  className?: string;
  spinnerClassName?: string;
  messageClassName?: string;
}

const sizeConfig = {
  xs: {
    spinner: "h-4 w-4",
    container: "min-h-[100px]",
    spacing: "space-y-2",
    text: "text-xs",
  },
  sm: {
    spinner: "h-6 w-6",
    container: "min-h-[200px]",
    spacing: "space-y-2",
    text: "text-sm",
  },
  md: {
    spinner: "h-8 w-8",
    container: "min-h-[300px]",
    spacing: "space-y-3",
    text: "text-base",
  },
  lg: {
    spinner: "h-12 w-12",
    container: "min-h-[400px]",
    spacing: "space-y-4",
    text: "text-lg",
  },
  xl: {
    spinner: "h-16 w-16",
    container: "min-h-[500px]",
    spacing: "space-y-4",
    text: "text-xl",
  },
};

const variantConfig = {
  primary: "border-t-blue-900",
  secondary: "border-t-slate-700",
  success: "border-t-green-500",
  warning: "border-t-yellow-500",
  error: "border-t-red-500",
  white: "border-t-white",
};

const textVariantConfig = {
  primary: "text-gray-600",
  secondary: "text-slate-700",
  success: "text-green-600",
  warning: "text-yellow-600",
  error: "text-red-600",
  white: "text-white",
};

export const Spinner: React.FC<SpinnerProps> = ({
  message = "Loading...",
  size = "lg",
  variant = "primary",
  showMessage = true,
  fullScreen = false,
  className,
  spinnerClassName,
  messageClassName,
}) => {
  const config = sizeConfig[size];
  const textColor = textVariantConfig[variant];

  const containerClasses = cn(
    "flex justify-center items-center",
    fullScreen
      ? "fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
      : config.container,
    className
  );

  const contentClasses = cn("text-center", showMessage ? config.spacing : "");

  const spinnerClasses = cn(
    "animate-spin rounded-full border-2 border-gray-200 mx-auto",
    config.spinner,
    variantConfig[variant],
    spinnerClassName
  );

  const messageClasses = cn(config.text, textColor, messageClassName);

  return (
    <div className={containerClasses} role="status" aria-live="polite">
      <div className={contentClasses}>
        <div className={spinnerClasses} aria-hidden="true"></div>
        {showMessage && message && <p className={messageClasses}>{message}</p>}
      </div>
    </div>
  );
};

export const InlineSpinner: React.FC<Omit<SpinnerProps, "fullScreen">> = (
  props
) => <Spinner {...props} className="min-h-0 py-4" />;

export const FullScreenSpinner: React.FC<SpinnerProps> = (props) => (
  <Spinner {...props} fullScreen={true} />
);

export const ButtonSpinner: React.FC<{
  size?: "xs" | "sm";
  variant?: "white" | "primary";
}> = ({ size = "xs", variant = "white" }) => (
  <div
    className={cn(
      "animate-spin rounded-full border-2 border-gray-200",
      size === "xs" ? "h-3 w-3" : "h-4 w-4",
      variant === "white" ? "border-t-white" : "border-t-blue-500"
    )}
    aria-hidden="true"
  />
);

export default Spinner;
