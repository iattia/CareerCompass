import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Compass } from "lucide-react";

const Navbar = () => {
  const location = useLocation();

  const links = [
    { to: "/", label: "Home" },
    { to: "/assessment-choice", label: "Assessment" },
    { to: "/dashboard", label: "My Careers" },
    { to: "/jobs", label: "Job Listings" },
    { to: "/mentorship", label: "Mentorship" },
    { to: "/scholarships", label: "Scholarships" },
  ];

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl">
              <Compass className="w-6 h-6 text-primary" />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                CareerCompass
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {links.map((link) => (
              <Link key={link.to} to={link.to}>
                <Button
                  variant={location.pathname === link.to ? "default" : "ghost"}
                  size="sm"
                >
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
