import React from "react";
import { cn } from "../../utils";

export type LabelVariant = "default" | "checkbox" | "inline";
export type LabelSize = "sm" | "md" | "lg";

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  required?: boolean;
  variant?: LabelVariant;
  size?: LabelSize;
}

const variantStyles = {
  default: "block ora-body",
  checkbox: "ora-body cursor-pointer",
  inline: "ora-body text-ora-gray",
};

const sizeStyles = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

export const Label: React.FC<LabelProps> = ({
  children,
  required = false,
  variant = "default",
  size = "lg",
  className,
  ...rest
}) => {
  return (
    <label
      className={cn(variantStyles[variant], sizeStyles[size], className)}
      {...rest}
    >
      {children}
      {required && (
        <span className="text-ora-error ml-1" aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
};

export default Label;
