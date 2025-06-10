import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, Calendar, Menu, Search, ShoppingCart, X } from "lucide-react";
import { Button } from "../ui/Button";
import { Avatar } from "../ui/Avatar";
import { routes } from "../../constants/routes";
import { useAuth } from "../../contexts/AuthContext";
import { useUser } from "../../contexts/UserContext";
import Input from "../ui/Input";
import Dropdown, { DropdownItem } from "../ui/Dropdown";

export const Header: React.FC = () => {
  const { isAuthenticated, logout, login } = useAuth();
  const { user, isEducator } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-ora-bg shadow-ora-header">
        <div className="w-full px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center" aria-label="Home">
                <span className="ora-heading text-xl">ORA</span>
              </Link>

              <Link
                to={routes.products.list}
                className="hidden md:inline-block ora-subheading text-ora-navy hover:text-ora-highlight ora-transition"
              >
                Explore
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <button className="p-2 text-ora-navy hover:text-ora-highlight ora-transition rounded-sm hover:bg-ora-gray-50">
                    <ShoppingCart className="w-5 h-5" strokeWidth={2.5} />
                  </button>
                  <button className="p-2 text-ora-navy hover:text-ora-highlight ora-transition rounded-sm hover:bg-ora-gray-50">
                    <Calendar className="w-5 h-5" strokeWidth={2.5} />
                  </button>
                  <button className="p-2 text-ora-navy hover:text-ora-highlight ora-transition rounded-sm hover:bg-ora-gray-50 relative">
                    <Bell className="w-5 h-5" strokeWidth={2.5} />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-ora-orange rounded-full"></span>
                  </button>

                  <Dropdown
                    align="right"
                    trigger={
                      <Avatar
                        src={user?.imageUrl || undefined}
                        name={user?.firstName}
                        className="h-10 w-10 cursor-pointer"
                      />
                    }
                  >
                    <DropdownItem
                      onClick={() => {
                        navigate(routes.profiles.myProfile);
                      }}
                    >
                      <span className="ora-subheader text-base">Profile</span>
                    </DropdownItem>

                    {/* TODO: Add educator application verification */}
                    {!isEducator && (
                      <DropdownItem
                        onClick={() => {
                          navigate(routes.educators.application);
                        }}
                      >
                        <span className="ora-subheader text-base">
                          Become Educator
                        </span>
                      </DropdownItem>
                    )}
                    <DropdownItem
                      onClick={() => {
                        navigate(routes.settings.settings);
                      }}
                    >
                      <span className="ora-subheader text-base">Settings</span>
                    </DropdownItem>
                    <DropdownItem onClick={logout}>
                      <span className="ora-subheader text-base">Logout</span>
                    </DropdownItem>
                  </Dropdown>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  <Button variant="ghost" size="sm" onClick={login}>
                    Sign In
                  </Button>
                  <Button variant="secondary" size="sm" asChild>
                    <Link to={routes.auth.signUp} className="text-ora-gray-100">
                      Sign Up
                    </Link>
                  </Button>
                </div>
              )}

              <button
                className="md:hidden p-2 text-ora-navy ora-transition hover:text-ora-highlight"
                onClick={toggleMobileMenu}
                aria-label={
                  isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"
                }
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-ora-surface border-b border-ora-gray-100 px-6 py-4">
          <div className="mb-4">
            <Input
              variant="search"
              placeholder="Search..."
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          <nav className="space-y-3">
            <Link
              to={routes.products.list}
              className="block ora-body py-2 ora-transition hover:text-ora-highlight"
              onClick={toggleMobileMenu}
            >
              Explore
            </Link>
          </nav>

          {isAuthenticated && (
            <div className="mt-4 pt-4 border-t border-ora-gray-100">
              <div className="flex items-center space-x-3 mb-3">
                <Avatar
                  src={user?.imageUrl ?? "/assets/images/avatar.png"}
                  name={user?.firstName}
                  className="h-8 w-8"
                />
                <span className="ora-emphasis">{user?.firstName}</span>
              </div>
              <button
                onClick={() => {
                  toggleMobileMenu();
                  logout();
                }}
                className="text-ora-error ora-body ora-transition hover:text-red-700"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Header;
