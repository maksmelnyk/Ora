import React, {
  useState,
  useRef,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { cn } from "../../utils";
import Button from "./Button";

interface DropdownProps {
  trigger: ReactNode | ((isOpen: boolean) => ReactNode);
  children: ReactNode;
  align?: "left" | "right";
  width?: string;
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  children,
  align = "left",
  width = "w-48",
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const closeDropdown = useCallback(() => setIsOpen(false), []);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    },
    [closeDropdown]
  );

  const handleEscapeKey = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeDropdown();
      }
    },
    [closeDropdown]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [handleClickOutside, handleEscapeKey]);

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="cursor-pointer focus:outline-none"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {typeof trigger === "function" ? trigger(isOpen) : trigger}
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute z-50 mt-2 rounded-md bg-white shadow-lg focus:outline-none",
            width,
            align === "right" ? "right-0" : "left-0"
          )}
          role="menu"
          aria-orientation="vertical"
        >
          <div className="py-1">
            {React.Children.map(children, (child) => {
              if (React.isValidElement(child)) {
                const childElement = child as React.ReactElement<{
                  onClick?: (e: React.MouseEvent) => void;
                }>;
                return React.cloneElement(childElement, {
                  onClick: (e: React.MouseEvent) => {
                    childElement.props.onClick?.(e);
                    closeDropdown();
                  },
                });
              }
              return child;
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export const DropdownItem: React.FC<{
  children: ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  disabled?: boolean;
}> = ({ children, onClick, className, disabled = false }) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn("w-full text-left", className)}
      onClick={onClick}
      disabled={disabled}
      asChild
    >
      {children}
    </Button>
  );
};

export default Dropdown;
