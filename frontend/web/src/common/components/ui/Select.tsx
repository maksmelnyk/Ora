import React, { SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../utils";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  group?: string;
}

export interface SelectOptionGroup {
  label: string;
  options: SelectOption[];
}

export type SelectOptions = SelectOption[] | SelectOptionGroup[];

const isGroupedOptions = (
  options: SelectOptions
): options is SelectOptionGroup[] => {
  return options.length > 0 && "options" in options[0];
};

export type SelectVariant = "default" | "search";
export type SelectSize = "sm" | "md" | "lg";

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "children" | "size"> {
  options: SelectOptions;
  error?: string;
  fullWidth?: boolean;
  placeholder?: string;
  variant?: SelectVariant;
  size?: SelectSize;
}

const sizeConfig = {
  sm: "px-3 py-1.5 text-sm h-8",
  md: "px-4 py-2.5 text-sm h-11",
  lg: "px-4 py-3 text-base h-12",
};

const getVariantStyles = (hasError: boolean, variant: SelectVariant) => {
  const baseStyles = {
    default: cn(
      "border-2",
      hasError ? "border-1 border-ora-error" : "border-1 border-ora-gray/20"
    ),
    search: cn(
      "border-2 bg-ora-bg",
      hasError ? "border-1 border-ora-error" : ""
    ),
  };

  return baseStyles[variant];
};

export const Select: React.FC<SelectProps> = ({
  options,
  error,
  fullWidth = true,
  placeholder,
  variant = "default",
  size = "md",
  className,
  disabled,
  ...rest
}) => {
  const hasError = Boolean(error);
  const sizeStyles = sizeConfig[size];
  const variantStyles = getVariantStyles(hasError, variant);

  const selectClasses = cn(
    "block w-full rounded-lg shadow-ora-sm ora-transition ora-body appearance-none",
    "text-ora-navy placeholder-ora-gray cursor-pointer",
    "focus:outline-none pr-10",
    sizeStyles,
    variantStyles,
    disabled && "opacity-60 cursor-not-allowed",
    className
  );

  const renderOptions = () => {
    if (isGroupedOptions(options)) {
      return options.map((group) => (
        <optgroup key={group.label} label={group.label}>
          {group.options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </optgroup>
      ));
    } else {
      return options.map((option) => (
        <option
          key={option.value}
          value={option.value}
          disabled={option.disabled}
        >
          {option.label}
        </option>
      ));
    }
  };

  return (
    <div className={cn(fullWidth && "w-full", "relative")}>
      <select
        disabled={disabled}
        className={selectClasses}
        aria-invalid={hasError ? "true" : undefined}
        {...rest}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {renderOptions()}
      </select>

      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <ChevronDown
          className={cn("w-4 h-4 text-ora-gray", disabled && "opacity-60")}
          aria-hidden="true"
        />
      </div>

      {hasError && (
        <div className="absolute inset-y-0 right-0 pr-8 flex items-center pointer-events-none">
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
};

export default Select;
