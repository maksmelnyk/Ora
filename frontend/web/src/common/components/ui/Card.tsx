import React, { ReactNode, KeyboardEvent } from "react";
import { cn } from "../../utils";

export interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  bordered?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  onClick,
  hoverable = false,
  bordered = false,
}) => {
  const baseStyles = "bg-ora-bg rounded-xl overflow-hidden";
  const hoverStyles =
    hoverable || onClick
      ? "ora-transition hover:-translate-y-1 cursor-pointer"
      : undefined;
  const borderStyles = bordered ? "border border-ora-gray-100" : undefined;

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (onClick && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className={cn(baseStyles, hoverStyles, borderStyles, className)}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? handleKeyDown : undefined}
    >
      {children}
    </div>
  );
};

export interface SubCardProps {
  children: ReactNode;
  className?: string;
}

export const CardHeader: React.FC<SubCardProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        "px-6 py-4 border-b border-ora-gray-100 ora-heading",
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardTitle: React.FC<SubCardProps> = ({ children, className }) => {
  return <h3 className={cn("text-lg ora-heading", className)}>{children}</h3>;
};

export const CardSubtitle: React.FC<SubCardProps> = ({
  children,
  className,
}) => {
  return <p className={cn("text-sm ora-body mt-1", className)}>{children}</p>;
};

export const CardContent: React.FC<SubCardProps> = ({
  children,
  className,
}) => {
  return <div className={cn("px-6 py-4 ora-body", className)}>{children}</div>;
};

export const CardFooter: React.FC<SubCardProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        "px-6 py-4 bg-ora-bg border-t border-ora-gray-100 ora-body",
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardImage: React.FC<{
  src?: string;
  alt?: string;
  className?: string;
  aspectRatio?: "square" | "video" | "wide" | "none";
}> = ({ src, alt = "Card image", className, aspectRatio = "video" }) => {
  const aspectClasses = {
    square: "aspect-square",
    video: "aspect-video",
    wide: "aspect-[21/9]",
  };

  const aspectClass =
    aspectRatio && aspectRatio !== "none" ? aspectClasses[aspectRatio] : "";

  if (!src) {
    return (
      <div
        className={cn(
          "bg-ora-gray-300 relative overflow-hidden rounded-xl",
          aspectClass,
          className
        )}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-ora-gray-400 text-sm ora-emphasis">
              No image
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(aspectClass, "overflow-hidden", className)}>
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    </div>
  );
};

export const CardMeta: React.FC<SubCardProps> = ({ children, className }) => {
  return (
    <div className={cn("flex items-center gap-4 text-sm ora-body", className)}>
      {children}
    </div>
  );
};

export const CardActions: React.FC<SubCardProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn("flex items-center gap-2 pt-4", className)}>
      {children}
    </div>
  );
};
