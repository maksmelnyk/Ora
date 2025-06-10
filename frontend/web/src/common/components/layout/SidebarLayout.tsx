import { ReactNode } from "react";
import { cn } from "../../utils";

export interface SidebarLayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
  subHeader?: ReactNode;
  topSections?: ReactNode;
  wide?: boolean;
  className?: string;
  sidebarWidth?: "sm" | "md" | "lg";
  contentTitle?: string;
  contentResultCount?: number;
}

export const SidebarLayout: React.FC<SidebarLayoutProps> = ({
  children,
  sidebar,
  subHeader,
  topSections,
  wide = false,
  className,
  sidebarWidth = "md",
  contentTitle,
  contentResultCount,
}) => {
  const sidebarWidthClasses = {
    sm: "w-56",
    md: "w-64",
    lg: "w-72",
  };

  return (
    <>
      {subHeader && <div className="w-full pb-8">{subHeader}</div>}
      <div
        className={cn(
          "container mx-auto py-6 px-6 sm:px-12 lg:px-24 xl:px-32 lg:pt-10 lg:pb-20 min-h-screen",
          wide ? "max-w-screen-2xl" : "max-w-screen-xl",
          className
        )}
      >
        {topSections && <div className="mb-20">{topSections}</div>}

        <div className="flex gap-8">
          <aside
            className={cn(
              "flex-shrink-0 hidden lg:block",
              sidebarWidthClasses[sidebarWidth]
            )}
          >
            <div className="sticky top-32">{sidebar}</div>
          </aside>

          <main className="flex-1 min-w-0">
            {(contentTitle || contentResultCount !== undefined) && (
              <div className="flex items-center justify-between mb-6">
                {contentTitle && (
                  <h2 className="ora-heading text-2xl text-ora-navy">
                    {contentTitle}
                  </h2>
                )}
                {contentResultCount !== undefined && (
                  <span className="ora-body text-ora-gray">
                    {contentResultCount.toLocaleString()} results
                  </span>
                )}
              </div>
            )}
            {children}
          </main>
        </div>
      </div>
    </>
  );
};

export default SidebarLayout;
