import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../utils";

export interface SubHeaderItem {
  id: string;
  label: string;
  href: string;
  count?: number;
}

export interface SubHeaderProps {
  items: SubHeaderItem[];
  className?: string;
}

export const SubHeader: React.FC<SubHeaderProps> = ({ items, className }) => {
  const location = useLocation();

  return (
    <div className={cn("shadow-ora-header", className)}>
      <nav
        className="flex space-x-8 px-8 sm:px-2 lg:px-8"
        aria-label="Sub navigation"
      >
        {items.map((item) => {
          const currentUrl = `${location.pathname}${location.search}`;
          const isActive = currentUrl === item.href;

          return (
            <Link
              key={item.id}
              to={item.href}
              className={cn(
                "whitespace-nowrap py-4 px-1 font-medium text-sm ora-transition focus:outline-none",
                isActive
                  ? "text-ora-highlight"
                  : "border-transparent text-ora-gray hover:text-ora-navy hover:border-ora-gray-300"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              {item.label}
              {item.count !== undefined && (
                <span
                  className={cn(
                    "ml-2 px-2 py-0.5 text-xs rounded-full",
                    isActive
                      ? "bg-ora-highlight/10 text-ora-highlight"
                      : "bg-ora-gray-100 text-ora-gray"
                  )}
                >
                  {item.count}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default SubHeader;
