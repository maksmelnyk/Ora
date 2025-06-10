import React from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Mail,
  ArrowRight,
} from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { routes } from "../../constants/routes";

interface FooterLinkProps {
  to: string;
  children: React.ReactNode;
  external?: boolean;
}

const FooterLink: React.FC<FooterLinkProps> = ({
  to,
  children,
  external = false,
}) => {
  const baseClasses = "ora-footer text-sm";

  if (external) {
    return (
      <a
        href={to}
        className={baseClasses}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }

  return (
    <Link to={to} className={baseClasses}>
      {children}
    </Link>
  );
};

interface FooterSectionProps {
  title: string;
  children: React.ReactNode;
}

const FooterSection: React.FC<FooterSectionProps> = ({ title, children }) => (
  <div>
    <h3 className="font-semibold text-base text-ora-bg mb-3">{title}</h3>
    <div className="space-y-2 flex flex-col">{children}</div>
  </div>
);

export const Footer: React.FC = () => {
  const [email, setEmail] = React.useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
    setEmail("");
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ];

  return (
    <footer className="bg-ora-navy">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-8 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Link to={routes.public.home} className="inline-block">
              <span className="font-bold text-2xl text-white">ORA</span>
            </Link>
            <p className="ora-footer max-w-sm">
              Unlock your potential with expert guidance through our flexible
              learning platform connecting you to world-class instructors.
            </p>

            <div>
              <h4 className="ora-footer text-sm text-white mb-2">Follow Us</h4>
              <div className="flex space-x-3">
                {socialLinks.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 ora-transition"
                    aria-label={label}
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <FooterSection title="Learn & Support">
              <FooterLink to={routes.products.list}>Explore</FooterLink>
              <FooterLink to="/help">Help Center</FooterLink>
              <FooterLink to="/contact">Contact Us</FooterLink>
              <FooterLink to="/faq">FAQ</FooterLink>
              <FooterLink to="/community">Community</FooterLink>
            </FooterSection>
          </div>

          <div className="lg:col-span-1">
            <FooterSection title="Company">
              <FooterLink to="/about">About Us</FooterLink>
              <FooterLink to="/careers">Careers</FooterLink>
              <FooterLink to="/blog">Blog</FooterLink>
              <FooterLink to="/press">Press</FooterLink>
            </FooterSection>
          </div>

          <div className="lg:col-span-1">
            <FooterSection title="Legal">
              <FooterLink to="/terms">Terms of Service</FooterLink>
              <FooterLink to="/privacy">Privacy Policy</FooterLink>
              <FooterLink to="/cookies">Cookie Policy</FooterLink>
              <FooterLink to="/refunds">Refund Policy</FooterLink>
            </FooterSection>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="ora-footer text-xl mb-2">Stay Updated</h3>
              <p className="ora-footer">
                Get the latest courses, instructor spotlights, and platform
                updates delivered to your inbox.
              </p>
            </div>
            <div className="lg:justify-self-end w-full lg:max-w-md">
              <form
                onSubmit={handleNewsletterSubmit}
                className="flex flex-col sm:flex-row gap-3"
              >
                <div className="flex-grow">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    leftIcon={<Mail className="w-4 h-4 text-ora-bg" />}
                    className="border-1 border-ora-bg rounded-xl placeholder-ora-bg"
                  />
                </div>
                <Button
                  type="submit"
                  variant="secondary"
                  size="lg"
                  className="bg-white text-ora-navy hover:bg-ora-gray-50 whitespace-nowrap"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-6 pt-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="ora-footer text-sm">
              &copy; {new Date().getFullYear()} ORA. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <FooterLink to="/accessibility">Accessibility</FooterLink>
              <FooterLink to="/sitemap">Sitemap</FooterLink>
              <span className="ora-footer text-sm">
                Made with ❤️ for learners worldwide
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
