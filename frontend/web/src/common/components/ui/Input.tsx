import { ReactNode, InputHTMLAttributes, forwardRef } from "react";
import { cn } from "../../utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  variant?: "default" | "search";
  error?: string;
}

const baseInputStyles = "block w-full rounded-xl focus:outline-none";
const textStyles = "text-ora-navy placeholder-ora-gray sm:text-sm";

const getVariantStyles = (hasError: boolean) => ({
  default: cn(
    "px-4 py-2.5 h-11",
    hasError ? "border-1 border-ora-error" : "border-1 border-ora-gray/20"
  ),
  search: cn("px-4 py-2 h-10", hasError ? "border-1 border-ora-error" : ""),
});

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      leftIcon,
      rightIcon,
      fullWidth = true,
      variant = "default",
      className,
      error,
      ...rest
    },
    ref
  ) => {
    const hasError = Boolean(error);
    const variantStyles = getVariantStyles(hasError);

    const inputClasses = cn(
      baseInputStyles,
      textStyles,
      variantStyles[variant],
      leftIcon && "pl-10",
      rightIcon && hasError ? "pr-16" : rightIcon && "pr-10",
      !fullWidth && "w-auto"
    );

    return (
      <div className={cn(fullWidth && "w-full", "relative")}>
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ora-gray">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(inputClasses, className)}
          aria-invalid={hasError ? "true" : undefined}
          {...rest}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-ora-gray">
            {rightIcon}
          </div>
        )}
        {hasError && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-ora-error"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>
    );
  }
);

export default Input;
