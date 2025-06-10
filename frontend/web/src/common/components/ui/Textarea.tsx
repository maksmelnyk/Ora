import { forwardRef } from "react";
import { cn } from "../../utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  fullWidth?: boolean;
  variant?: "default" | "search";
  resize?: "none" | "vertical" | "horizontal" | "both";
  error?: string;
}

const baseTextareaStyles = "block w-full rounded-xl focus:outline-none";
const textStyles = "text-ora-navy placeholder-ora-gray sm:text-sm";

const getVariantStyles = (hasError: boolean) => ({
  default: cn(
    "border-2 px-4 py-2.5 min-h-[88px]",
    hasError ? "border-2 border-ora-error" : "border-1 border-ora-gray/20"
  ),
  search: cn(
    "border-2 px-4 py-2 min-h-[80px] bg-ora-bg",
    hasError ? "border-2 border-ora-error" : ""
  ),
});

const resizeClasses = {
  none: "resize-none",
  vertical: "resize-y",
  horizontal: "resize-x",
  both: "resize",
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      fullWidth = true,
      variant = "default",
      resize = "vertical",
      className,
      error,
      ...rest
    },
    ref
  ) => {
    const hasError = Boolean(error);
    const variantStyles = getVariantStyles(hasError);

    const textareaClasses = cn(
      baseTextareaStyles,
      textStyles,
      variantStyles[variant],
      resizeClasses[resize],
      className
    );

    return (
      <div className={cn(fullWidth && "w-full", "relative")}>
        <textarea
          ref={ref}
          className={textareaClasses}
          aria-invalid={hasError ? "true" : undefined}
          {...rest}
        />
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

export default Textarea;
