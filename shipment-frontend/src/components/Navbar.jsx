import { Link, useLocation } from "react-router-dom";
import { Package, Home, PlusCircle, Search, History, LayoutDashboard, Menu, X, Sun, Moon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";

const navLinks = [
  { to: "/",          icon: Home,            label: "Home" },
  { to: "/create",    icon: PlusCircle,      label: "Create Shipment" },
  { to: "/track",     icon: Search,          label: "Track Shipment" },
  { to: "/history",   icon: History,         label: "History" },
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <header
      className="sticky top-0 z-40 backdrop-blur-xl"
      style={{
        background: "var(--navbar-bg)",
        borderBottom: "1px solid var(--navbar-border)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="p-1.5 rounded-lg bg-blue-500/15 border border-blue-500/25 group-hover:bg-blue-500/25 transition-colors">
            <Package className="h-5 w-5 text-blue-500" />
          </div>
          <span className="font-bold text-lg tracking-tight" style={{ color: "var(--color-text)" }}>
            Ship<span className="text-blue-500">Track</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ to, icon: Icon, label }) => {
            const isActive = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-blue-500/15 text-blue-500 border border-blue-500/25"
                    : "hover:bg-[var(--bg-hover)]"
                )}
                style={!isActive ? { color: "var(--color-muted)" } : {}}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Right side: theme toggle + mobile menu */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="relative h-9 w-16 rounded-full p-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 cursor-pointer"
            style={{
              background: isDark ? "rgba(96,165,250,0.15)" : "rgba(0,0,0,0.08)",
              border: "1px solid var(--color-border)",
              focusRingOffsetColor: "var(--bg-page)",
            }}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Light mode" : "Dark mode"}
          >
            {/* Track */}
            <div
              className="absolute inset-y-1 rounded-full flex items-center justify-center w-7 transition-all duration-300 shadow-sm"
              style={{
                background: isDark ? "#3b82f6" : "#f8fafc",
                border: isDark ? "none" : "1px solid rgba(0,0,0,0.12)",
                left: isDark ? "calc(100% - 2rem - 0.25rem)" : "0.25rem",
              }}
            >
              {isDark ? (
                <Moon className="h-3.5 w-3.5 text-white" />
              ) : (
                <Sun className="h-3.5 w-3.5 text-amber-500" />
              )}
            </div>
            {/* Icons at edges */}
            <div className="flex items-center justify-between px-1.5">
              <Sun className="h-3 w-3 text-amber-400 opacity-60" />
              <Moon className="h-3 w-3 text-blue-400 opacity-60" />
            </div>
          </button>

          {/* Mobile Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen
              ? <X className="h-5 w-5" style={{ color: "var(--color-text)" }} />
              : <Menu className="h-5 w-5" style={{ color: "var(--color-text)" }} />
            }
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="md:hidden border-t px-4 py-3 flex flex-col gap-1 animate-fade-in backdrop-blur-xl"
          style={{
            borderColor: "var(--navbar-border)",
            background: "var(--navbar-bg)",
          }}
        >
          {navLinks.map(({ to, icon: Icon, label }) => {
            const isActive = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive ? "bg-blue-500/15 text-blue-500" : "hover:bg-[var(--bg-hover)]"
                )}
                style={!isActive ? { color: "var(--color-muted)" } : {}}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
