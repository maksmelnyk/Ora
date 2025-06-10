import { ReactNode } from "react";
import { BookOpen, Calendar, Search, ShoppingBag, Users } from "lucide-react";
import Button from "./Button";
import { cn } from "../../utils";

interface EmptyStateProps {
  icon?: ReactNode;
  title?: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeConfig = {
  sm: {
    container: "py-8",
    icon: "w-12 h-12",
    title: "text-lg",
    message: "text-sm",
    spacing: "space-y-3",
  },
  md: {
    container: "py-12",
    icon: "w-16 h-16",
    title: "text-xl",
    message: "text-base",
    spacing: "space-y-4",
  },
  lg: {
    container: "py-16",
    icon: "w-20 h-20",
    title: "text-2xl",
    message: "text-lg",
    spacing: "space-y-6",
  },
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  message,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className,
  size = "md",
}) => {
  const config = sizeConfig[size];

  const defaultIcon = <Search className={cn(config.icon, "text-ora-gray")} />;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        config.container,
        config.spacing,
        className
      )}
    >
      <div className="mb-4">{icon || defaultIcon}</div>

      <div className="space-y-2">
        {title && (
          <h3 className={cn(config.title, "ora-heading text-ora-navy")}>
            {title}
          </h3>
        )}

        <p
          className={cn(
            config.message,
            "ora-body text-ora-gray max-w-md mx-auto"
          )}
        >
          {message}
        </p>
      </div>

      {(onAction || onSecondaryAction) && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
          {onAction && actionLabel && (
            <Button variant="primary" onClick={onAction}>
              {actionLabel}
            </Button>
          )}

          {onSecondaryAction && secondaryActionLabel && (
            <Button variant="outline" onClick={onSecondaryAction}>
              {secondaryActionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export const NoProductsFound: React.FC<
  Omit<EmptyStateProps, "icon" | "message"> & {
    hasFilters?: boolean;
  }
> = ({ hasFilters = false, ...props }) => (
  <EmptyState
    icon={
      <ShoppingBag
        className={cn(sizeConfig[props.size || "md"].icon, "text-ora-gray")}
      />
    }
    title="No products found"
    message={
      hasFilters
        ? "No products match your current filters. Try adjusting your search criteria."
        : "There are no products available in this category at the moment."
    }
    {...props}
  />
);

export const NoSearchResults: React.FC<
  Omit<EmptyStateProps, "icon" | "message"> & {
    searchTerm?: string;
  }
> = ({ searchTerm, ...props }) => (
  <EmptyState
    icon={
      <Search
        className={cn(sizeConfig[props.size || "md"].icon, "text-ora-gray")}
      />
    }
    title="No results found"
    message={
      searchTerm
        ? `No results found for "${searchTerm}". Try different keywords or browse our categories.`
        : "No results found. Try different keywords or browse our categories."
    }
    {...props}
  />
);

export const NoCoursesAvailable: React.FC<
  Omit<EmptyStateProps, "icon" | "message">
> = (props) => (
  <EmptyState
    icon={
      <BookOpen
        className={cn(sizeConfig[props.size || "md"].icon, "text-ora-gray")}
      />
    }
    title="No courses available"
    message="There are no courses available in this category right now. Check back later for new content."
    {...props}
  />
);

export const NoSessionsAvailable: React.FC<
  Omit<EmptyStateProps, "icon" | "message">
> = (props) => (
  <EmptyState
    icon={
      <Calendar
        className={cn(sizeConfig[props.size || "md"].icon, "text-ora-gray")}
      />
    }
    title="No sessions available"
    message="There are no sessions scheduled at the moment. New sessions are added regularly."
    {...props}
  />
);

export const NoInstructorsFound: React.FC<
  Omit<EmptyStateProps, "icon" | "message">
> = (props) => (
  <EmptyState
    icon={
      <Users
        className={cn(sizeConfig[props.size || "md"].icon, "text-ora-gray")}
      />
    }
    title="No instructors found"
    message="No instructors match your search criteria. Try broadening your search or browse all instructors."
    {...props}
  />
);

export default EmptyState;
