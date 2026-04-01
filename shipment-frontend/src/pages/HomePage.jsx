import { Link } from "react-router-dom";
import {
  Package, Search, PlusCircle, History, LayoutDashboard,
  ArrowRight, Truck, Shield, Zap, Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  { icon: Truck,   title: "Real-Time Tracking",    description: "Monitor your shipment status at every step — from pickup to final delivery.", color: "blue" },
  { icon: Shield,  title: "Secure & Reliable",      description: "End-to-end shipment data protection with tamper-proof tracking records.", color: "emerald" },
  { icon: Zap,     title: "Instant Notifications",  description: "Get instant status updates and never lose sight of your packages.", color: "amber" },
  { icon: Globe,   title: "Global Coverage",         description: "Ship and track packages across cities and regions seamlessly.", color: "violet" },
];

const quickLinks = [
  { to: "/create",    icon: PlusCircle,      label: "Create Shipment",  desc: "Add a new shipment",   color: "blue" },
  { to: "/track",     icon: Search,          label: "Track Shipment",   desc: "Find by tracking ID",  color: "emerald" },
  { to: "/history",   icon: History,         label: "Shipment History", desc: "View all shipments",   color: "violet" },
  { to: "/dashboard", icon: LayoutDashboard, label: "Admin Dashboard",  desc: "Stats & management",   color: "amber" },
];

const colorClasses = {
  blue:    { card: "hover:border-blue-500/40",    icon: "bg-blue-500/15 text-blue-500",    text: "text-blue-500",    border: "border-blue-500/20" },
  emerald: { card: "hover:border-emerald-500/40", icon: "bg-emerald-500/15 text-emerald-600", text: "text-emerald-600", border: "border-emerald-500/20" },
  violet:  { card: "hover:border-violet-500/40",  icon: "bg-violet-500/15 text-violet-600", text: "text-violet-600",  border: "border-violet-500/20" },
  amber:   { card: "hover:border-amber-500/40",   icon: "bg-amber-500/15 text-amber-600",   text: "text-amber-600",   border: "border-amber-500/20" },
};

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="relative text-center py-16 space-y-6">
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-500/6 rounded-full blur-3xl" />
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/25 bg-blue-500/10 px-4 py-1.5 text-sm text-blue-500 font-medium">
          <Package className="h-4 w-4" />
          Logistics Management Platform
        </div>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight" style={{ color: "var(--color-text)" }}>
          Track Every{" "}
          <span className="gradient-text">Shipment</span>
          <br />
          In Real Time
        </h1>

        <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed" style={{ color: "var(--color-muted)" }}>
          The professional logistics platform for creating, managing, and tracking shipments
          from origin to destination with complete visibility.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Button asChild size="xl" className="glow-blue">
            <Link to="/create">
              <PlusCircle className="h-5 w-5" /> Create Shipment <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
          <Button asChild size="xl" variant="outline">
            <Link to="/track">
              <Search className="h-5 w-5" /> Track Package
            </Link>
          </Button>
        </div>
      </section>

      {/* Quick Links */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: "var(--color-text)" }}>Quick Access</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map(({ to, icon: Icon, label, desc, color }) => {
            const cls = colorClasses[color];
            return (
              <Link key={to} to={to}>
                <Card className={`card-hover h-full cursor-pointer transition-all duration-300 ${cls.card}`}>
                  <CardContent className="p-5 flex flex-col items-start gap-3">
                    <div className={`p-2.5 rounded-xl ${cls.icon}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className={`font-semibold text-sm ${cls.text}`}>{label}</p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--color-muted)" }}>{desc}</p>
                    </div>
                    <ArrowRight className={`h-4 w-4 ${cls.text} mt-auto`} />
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Features */}
      <section>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold" style={{ color: "var(--color-text)" }}>Why ShipTrack?</h2>
          <p className="mt-2" style={{ color: "var(--color-muted)" }}>Everything you need for professional logistics management</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map(({ icon: Icon, title, description, color }) => {
            const cls = colorClasses[color];
            return (
              <Card key={title} className={`card-hover transition-all duration-300 ${cls.card}`}>
                <CardContent className="p-6 flex gap-4 items-start">
                  <div className={`p-3 rounded-xl shrink-0 ${cls.icon}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1" style={{ color: "var(--color-text)" }}>{title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--color-muted)" }}>{description}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
