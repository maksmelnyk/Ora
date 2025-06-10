import React, { forwardRef, ButtonHTMLAttributes, ReactNode } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../utils";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "teal"
  | "purple"
  | "neutral"
  | "orange";
export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  asChild?: boolean;
}

const baseStyles =
  "inline-flex items-center justify-center rounded-xl font-semibold font-family-display ora-transition focus:outline-none" +
  "disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer";

const sizeStyles: Record<ButtonSize, string> = {
  xs: "text-xs px-2 py-1 h-7",
  sm: "text-sm px-3 py-1.5 h-8",
  md: "text-sm px-4 py-2 h-10",
  lg: "text-base px-5 py-2.5 h-11",
  xl: "text-lg px-6 py-3 h-12",
};

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-ora-highlight text-white hover:bg-blue-600 shadow-ora-sm active:bg-blue-700",
  secondary:
    "bg-ora-navy text-white hover:bg-slate-700 shadow-ora-sm active:bg-slate-800",
  outline:
    "border border-ora-gray/20 bg-ora-bg text-ora-gray hover:bg-ora-blue hover:text-white shadow-ora-sm",
  ghost: "text-ora-navy hover:bg-ora-gray-50 active:bg-ora-gray-100",
  danger:
    "bg-ora-error text-white hover:bg-red-600 shadow-ora-sm active:bg-red-700",

  teal: "bg-ora-teal/80 text-white hover:bg-ora-teal shadow-ora-sm active:bg-teal-600",
  purple:
    "bg-ora-purple/80 text-white hover:bg-ora-purple shadow-ora-sm active:bg-purple-600",
  neutral:
    "bg-ora-gray/50 text-white hover:bg-ora-gray shadow-ora-sm active:bg-gray-600",
  orange:
    "bg-ora-orange/80 text-white hover:bg-ora-orange shadow-ora-sm active:bg-orange-600",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      className,
      disabled,
      asChild = false,
      ...rest
    },
    ref
  ) => {
    const validChildren = React.Children.toArray(children).filter((child) =>
      typeof child === "string" ? child.trim() !== "" : true
    );

    const Component = asChild ? Slot : "button";

    const computedClassName = cn(
      baseStyles,
      sizeStyles[size],
      variantStyles[variant],
      fullWidth && "w-full",
      (disabled || isLoading) && "opacity-60 cursor-not-allowed",
      className
    );

    const content = (
      <span className="flex items-center">
        {isLoading ? (
          <span className="mr-2" aria-hidden="true">
            <svg
              className="animate-spin h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </span>
        ) : (
          <>
            {leftIcon && <span className="mr-2">{leftIcon}</span>}
            {validChildren}
            {rightIcon && <span className="ml-2">{rightIcon}</span>}
          </>
        )}
      </span>
    );

    return (
      <Component
        ref={ref}
        className={computedClassName}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        {...rest}
      >
        {content}
      </Component>
    );
  }
);

export default Button;
