import React, { InputHTMLAttributes } from "react";
import { cn } from "../../utils";

export type CheckboxVariant =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "error";
export type CheckboxSize = "sm" | "md" | "lg";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  error?: string;
  variant?: CheckboxVariant;
  size?: CheckboxSize;
  containerClassName?: string;
}

const sizeConfig = {
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

const variantConfig: Record<
  CheckboxVariant,
  {
    base: string;
    checked: string;
    focus: string;
    border: string;
    borderError: string;
  }
> = {
  primary: {
    base: "border-ora-gray-200",
    checked: "text-ora-blue border-ora-blue bg-ora-blue",
    focus: "focus:ring-2 focus:ring-ora-blue/20 focus:border-ora-blue",
    border: "border-ora-gray-200",
    borderError: "border-ora-error",
  },
  secondary: {
    base: "border-ora-gray-200",
    checked: "text-white border-ora-navy bg-ora-navy",
    focus: "focus:ring-2 focus:ring-ora-navy/20 focus:border-ora-navy",
    border: "border-ora-gray-200",
    borderError: "border-ora-error",
  },
  success: {
    base: "border-ora-gray-200",
    checked: "text-white border-green-500 bg-green-500",
    focus: "focus:ring-2 focus:ring-green-500/20 focus:border-green-500",
    border: "border-ora-gray-200",
    borderError: "border-ora-error",
  },
  warning: {
    base: "border-ora-gray-200",
    checked: "text-white border-yellow-500 bg-yellow-500",
    focus: "focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500",
    border: "border-ora-gray-200",
    borderError: "border-ora-error",
  },
  error: {
    base: "border-ora-gray-200",
    checked: "text-white border-ora-error bg-ora-error",
    focus: "focus:ring-2 focus:ring-ora-error/20 focus:border-ora-error",
    border: "border-ora-gray-200",
    borderError: "border-ora-error",
  },
};

export const Checkbox: React.FC<CheckboxProps> = ({
  error,
  variant = "primary",
  size = "md",
  className,
  containerClassName,
  disabled,
  ...rest
}) => {
  const hasError = Boolean(error);
  const sizeStyles = sizeConfig[size];
  const variantStyles = variantConfig[variant];

  const inputClassNames = cn(
    "rounded border-2 ora-transition cursor-pointer",
    "focus:outline-none focus:ring-offset-1",
    sizeStyles,
    hasError ? variantStyles.borderError : variantStyles.border,
    variantStyles.focus,
    variantStyles.checked,
    disabled && "opacity-60 cursor-not-allowed",
    className
  );

  return (
    <div className={cn("relative", containerClassName)}>
      <input
        type="checkbox"
        disabled={disabled}
        className={inputClassNames}
        aria-invalid={hasError ? "true" : undefined}
        {...rest}
      />
    </div>
  );
};

export default Checkbox;

const sizeWithLabelConfig = {
  sm: {
    label: "text-sm",
    description: "text-xs",
    container: "h-4",
  },
  md: {
    label: "text-sm",
    description: "text-sm",
    container: "h-5",
  },
  lg: {
    label: "text-base",
    description: "text-sm",
    container: "h-6",
  },
};

export interface CheckboxWithLabelProps extends CheckboxProps {
  label: string;
  description?: string;
  labelClassName?: string;
}

export const CheckboxWithLabel: React.FC<CheckboxWithLabelProps> = ({
  label,
  description,
  labelClassName,
  size = "md",
  disabled,
  containerClassName,
  ...checkboxProps
}) => {
  const sizeStyles = sizeWithLabelConfig[size];

  return (
    <div className={cn("relative flex items-start", containerClassName)}>
      <div className={cn("flex items-center", sizeStyles.container)}>
        <Checkbox size={size} disabled={disabled} {...checkboxProps} />
      </div>
      <div className="ml-3 text-sm leading-none">
        <label
          htmlFor={checkboxProps.id}
          className={cn(
            "ora-subheading text-ora-navy cursor-pointer",
            sizeStyles.label,
            disabled && "opacity-60 cursor-not-allowed",
            labelClassName
          )}
        >
          {label}
        </label>
        {description && (
          <p
            className={cn(
              "ora-body text-ora-gray mt-1",
              sizeStyles.description,
              disabled && "opacity-60"
            )}
          >
            {description}
          </p>
        )}
      </div>
    </div>
  );
};
