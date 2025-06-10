import React from "react";
import { Link } from "react-router-dom";
import { Home, ChevronRight } from "lucide-react";
import { cn } from "../../utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  homeLink?: string;
  showHomeIcon?: boolean;
  clickable?: boolean;
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  className,
  homeLink = "/",
  showHomeIcon = false,
  clickable = true,
}) => {
  return (
    <nav className={cn("flex", className)} aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1">
        {showHomeIcon && (
          <li className="inline-flex items-center">
            {clickable ? (
              <Link
                to={homeLink}
                className="inline-flex items-center ora-body text-ora-gray hover:text-ora-navy ora-transition"
              >
                <Home size={16} className="mr-2" aria-hidden="true" />
                Home
              </Link>
            ) : (
              <span className="inline-flex items-center ora-body text-ora-gray">
                <Home size={16} className="mr-2" aria-hidden="true" />
                Home
              </span>
            )}
          </li>
        )}

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const hasHref = !!item.href;
          const showSeparator = showHomeIcon || index > 0;

          return (
            <li key={index} className="flex items-center">
              {showSeparator && (
                <ChevronRight
                  size={16}
                  className="text-ora-gray mx-2"
                  aria-hidden="true"
                />
              )}

              {clickable && !isLast && hasHref ? (
                <Link
                  to={item.href!}
                  className="ora-subheading hover:text-ora-highlight ora-transition"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn("ora-subheading", {
                    "text-ora-gray": !isLast,
                    "font-semibold": isLast,
                  })}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
