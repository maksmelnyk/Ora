import React from "react";
import { cn } from "../../utils";

export interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  wide?: boolean;
  className?: string;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  title,
  description,
  wide = false,
  className,
}) => {
  return (
    <div
      className={cn(
        "container mx-auto py-6 px-6 sm:px-12 lg:px-50 lg:pt-10 lg:pb-20 min-h-screen",
        wide ? "max-w-screen-3xl" : "max-w-screen-2xl",
        className
      )}
    >
      {(title || description) && (
        <div className="mb-8">
          {title && <h1 className="ora-heading text-3xl">{title}</h1>}
          {description && (
            <p className="mt-2 text-lg ora-body">{description}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
};
