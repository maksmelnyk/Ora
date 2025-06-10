import React from "react";
import { cn } from "../../utils";
import { Label, LabelSize, LabelVariant } from "../ui/Label";
import { FormError } from "./FormError";

export type LabelPosition = "top" | "left" | "right";

export interface LabelOptions {
  variant?: LabelVariant;
  size?: LabelSize;
  className?: string;
  position?: LabelPosition;
  width?: string;
  props?: React.LabelHTMLAttributes<HTMLLabelElement>;
}

export interface FormGroupProps {
  label?: string;
  htmlFor?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  helperText?: string;
  labelOptions?: LabelOptions;
}

export interface FormGroupProps {
  label?: string;
  htmlFor?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  helperText?: string;
  labelOptions?: {
    variant?: LabelVariant;
    size?: LabelSize;
    className?: string;
    position?: LabelPosition;
    width?: string;
    props?: React.LabelHTMLAttributes<HTMLLabelElement>;
  };
}

export const FormGroup: React.FC<FormGroupProps> = ({
  label,
  htmlFor,
  error,
  required = false,
  children,
  className,
  helperText,
  labelOptions = {},
}) => {
  const {
    variant = "default",
    size = "md",
    className: labelClassName,
    position = "top",
    width = "w-32",
    props: labelProps,
  } = labelOptions;

  const helpTextId = htmlFor ? `${htmlFor}-help` : undefined;
  const errorId = htmlFor ? `${htmlFor}-error` : undefined;

  const isCheckboxLike = variant === "checkbox";

  const renderLabel = () => {
    if (!label) return null;

    return (
      <Label
        htmlFor={htmlFor}
        required={required}
        variant={variant}
        size={size}
        className={cn(
          position === "left" && "text-right",
          position === "right" && "text-left",
          labelClassName
        )}
        {...labelProps}
      >
        {label}
      </Label>
    );
  };

  const renderHelperText = () => {
    if (!helperText || error) return null;

    return (
      <p
        id={helpTextId}
        className={cn(
          "text-sm ora-body text-ora-gray",
          position === "top" ? "mt-2" : "mt-1"
        )}
      >
        {helperText}
      </p>
    );
  };

  const renderError = () => <FormError id={errorId} error={error} />;

  // Special layout for checkbox-style
  if (isCheckboxLike && position === "right") {
    return (
      <div className={cn("mb-6", className)}>
        <div className="flex gap-2">
          {children}
          {renderLabel()}
        </div>
        {renderHelperText()}
        {renderError()}
      </div>
    );
  }

  // Default top layout
  if (position === "top") {
    return (
      <div className={cn(error ? "mb-1" : "mb-6", className)}>
        {label && <div className="mb-2">{renderLabel()}</div>}
        {children}
        {renderHelperText()}
        {renderError()}
      </div>
    );
  }

  // Left label
  if (position === "left") {
    return (
      <div className={cn("mb-6", className)}>
        <div className="flex items-start gap-4">
          {label && (
            <div className={cn("flex-shrink-0 pt-2", width)}>
              {renderLabel()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            {children}
            {renderHelperText()}
            {renderError()}
          </div>
        </div>
      </div>
    );
  }

  // Right label
  if (position === "right") {
    return (
      <div className={cn("mb-6", className)}>
        <div className="flex items-start gap-4">
          <div className="flex-1 min-w-0">
            {children}
            {renderHelperText()}
            {renderError()}
          </div>
          {label && <div className={cn("pt-2", width)}>{renderLabel()}</div>}
        </div>
      </div>
    );
  }

  return null;
};

export default FormGroup;
