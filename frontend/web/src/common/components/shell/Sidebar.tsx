import React, { ReactNode } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "../../utils";

export interface SidebarSectionProps {
  title: string | null;
  children: ReactNode;
  defaultOpen?: boolean;
  collapsible?: boolean;
  className?: string;
}

export const SidebarSection: React.FC<SidebarSectionProps> = ({
  title,
  children,
  defaultOpen = false,
  collapsible = true,
  className,
}) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  const toggleOpen = () => {
    if (collapsible) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div
      className={cn(
        "border-b-1 border-ora-gray-300 last:border-b-0",
        className
      )}
    >
      <button
        type="button"
        onClick={toggleOpen}
        disabled={!collapsible}
        className={cn(
          "w-full flex items-center justify-between py-4 text-left",
          "ora-subheading text-base text-ora-navy",
          collapsible
            ? "cursor-pointer hover:text-ora-highlight ora-transition"
            : "cursor-default"
        )}
        aria-expanded={isOpen}
      >
        {title && <span>{title}</span>}
        {collapsible &&
          (isOpen ? (
            <ChevronUp className="w-4 h-4 text-ora-gray" />
          ) : (
            <ChevronDown className="w-4 h-4 text-ora-gray" />
          ))}
      </button>

      {isOpen && <div className="pb-4">{children}</div>}
    </div>
  );
};

export interface SidebarProps {
  children: ReactNode;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ children, className }) => {
  return (
    <div className={cn("bg-ora-bg rounded-lg", className)}>{children}</div>
  );
};
