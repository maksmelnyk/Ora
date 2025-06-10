import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../utils";

interface CollapsibleItemProps {
  leftIcon?: React.ReactNode;
  title: string;
  subtitle?: string;
  rightContent?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  contentClassName?: string;
  isLast?: boolean;
}

export const CollapsibleItem: React.FC<CollapsibleItemProps> = ({
  leftIcon,
  title,
  subtitle,
  rightContent,
  onClick,
  className,
  contentClassName,
  isLast = false,
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between py-3 px-12 hover:bg-ora-gray-300 ora-transition cursor-pointer",
        !isLast && "border-b border-ora-gray-200",
        className
      )}
      onClick={onClick}
    >
      <div
        className={cn("flex items-center space-x-3 flex-1", contentClassName)}
      >
        {leftIcon && <div className="flex-shrink-0">{leftIcon}</div>}
        <div className="flex-1 min-w-0">
          <div className="ora-body text-sm text-ora-navy">{title}</div>
          {subtitle && (
            <div className="ora-body text-xs text-ora-gray mt-1">
              {subtitle}
            </div>
          )}
        </div>
      </div>

      {rightContent && (
        <div className="flex items-center space-x-3">{rightContent}</div>
      )}
    </div>
  );
};

interface CollapsibleProps {
  title: string;
  subtitle?: string;
  description?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  showMoreButton?: boolean;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
}

export const Collapsible: React.FC<CollapsibleProps> = ({
  title,
  subtitle,
  description,
  children,
  defaultOpen = false,
  showMoreButton = false,
  className,
  headerClassName,
  contentClassName,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [showDescription, setShowDescription] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const toggleDescription = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDescription(!showDescription);
  };

  return (
    <div className={cn("border-b border-ora-gray-300", className)}>
      <div
        className={cn(
          "flex items-center justify-between py-4 cursor-pointer border-b border-ora-gray-200 hover:bg-ora-gray-300 ora-transition px-8",
          headerClassName
        )}
        onClick={toggleOpen}
      >
        <div className="flex-1">
          <h3 className="ora-body text-base text-ora-navy font-medium">
            {title}
          </h3>
          {subtitle && (
            <p className="ora-body text-sm text-ora-gray mt-1">{subtitle}</p>
          )}
          {showDescription && description && (
            <p className="ora-body text-sm text-ora-gray mt-2">{description}</p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {showMoreButton && description && (
            <button
              onClick={toggleDescription}
              className="ora-body text-sm text-ora-blue hover:text-ora-navy ora-transition"
            >
              {showDescription ? "hide" : "more"}
            </button>
          )}
          <ChevronDown
            className={cn(
              "w-5 h-5 text-ora-gray ora-transition",
              isOpen && "rotate-180"
            )}
          />
        </div>
      </div>

      {isOpen && (
        <div className={cn("bg-ora-bg", contentClassName)}>{children}</div>
      )}
    </div>
  );
};

export default Collapsible;
