import React, { forwardRef } from "react";
import { Calendar } from "lucide-react";
import { Input } from "./Input";

export interface DatePickerProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  helpText?: string;
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  ({ error, helpText, className, ...rest }, ref) => {
    return (
      <Input
        type="date"
        ref={ref}
        className={className}
        leftIcon={
          <Calendar size={18} className="text-ora-gray" aria-hidden="true" />
        }
        error={error}
        aria-invalid={!!error}
        aria-describedby={
          error ? `${rest.id}-error` : helpText ? `${rest.id}-help` : undefined
        }
        {...rest}
      />
    );
  }
);

export default DatePicker;
