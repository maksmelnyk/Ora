import React from "react";
import { cn } from "../../utils";

export interface FormErrorProps {
  id?: string;
  error?: string;
  className?: string;
}

export const FormError: React.FC<FormErrorProps> = ({
  id,
  error,
  className,
}) => {
  if (!error) return null;

  return (
    <p
      id={id}
      className={cn("mt-1 text-xs text-ora-gray/70", className)}
      role="alert"
      aria-live="assertive"
    >
      {error}
    </p>
  );
};

export default FormError;
