import React from "react";
import Header from "../shell/Header";
import Footer from "../shell/Footer";
import { cn } from "../../utils";

export interface LayoutProps {
  children: React.ReactNode;
  hideFooter?: boolean;
  className?: string;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  hideFooter = false,
  className,
}) => {
  return (
    <div className={cn("flex flex-col min-h-screen bg-ora-bg", className)}>
      <Header />
      <main className="flex-grow">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
};

export default Layout;
