import { cn } from "../../utils";
import { PageLayout, PageLayoutProps } from "./PageLayout";

export interface HeroLayoutProps extends PageLayoutProps {
  hero: React.ReactNode;
  fullWidthHero?: boolean;
  heroClassName?: string;
}

export const HeroLayout: React.FC<HeroLayoutProps> = ({
  children,
  hero,
  fullWidthHero = false,
  heroClassName,
  className,
  ...pageLayoutProps
}) => {
  return (
    <>
      <div
        className={cn(
          fullWidthHero ? "w-full" : "w-full px-6 sm:px-12 lg:px-24 xl:px-32",
          heroClassName
        )}
      >
        {hero}
      </div>
      <PageLayout className={cn("pt-0", className)} {...pageLayoutProps}>
        {children}
      </PageLayout>
    </>
  );
};

export default HeroLayout;
