import React from "react";
import { cn } from "../../utils";
import { User } from "lucide-react";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface AvatarProps {
  src?: string;
  alt?: string;
  size?: AvatarSize;
  name?: string;
  className?: string;
}

const SIZE_CLASSES: Record<AvatarSize, string> = {
  xs: "h-6 w-6 text-xs",
  sm: "h-8 w-8 text-sm",
  md: "h-10 w-10 text-base",
  lg: "h-12 w-12 text-lg",
  xl: "h-16 w-16 text-xl",
};

const ICON_SIZE_CLASSES: Record<AvatarSize, string> = {
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-15 h-15",
  xl: "w-20 h-20",
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = "Avatar",
  size = "md",
  className,
}) => {
  const sizeClass = SIZE_CLASSES[size];
  const iconSizeClass = ICON_SIZE_CLASSES[size];

  if (src) {
    return (
      <div
        className={cn(
          sizeClass,
          "rounded-full overflow-hidden flex-shrink-0",
          className
        )}
      >
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        sizeClass,
        "rounded-full flex items-center justify-center flex-shrink-0",
        "bg-ora-gray-300 text-ora-navy",
        className
      )}
    >
      <User className={iconSizeClass} strokeWidth={2.5} />
    </div>
  );
};

export default Avatar;
