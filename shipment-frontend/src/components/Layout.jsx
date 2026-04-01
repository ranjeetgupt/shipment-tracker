import Navbar from "@/components/Navbar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg-page)", transition: "background 0.25s ease" }}>
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
      <footer
        className="py-6 text-center text-sm"
        style={{
          borderTop: "1px solid var(--color-border)",
          color: "var(--color-muted)",
        }}
      >
        © {new Date().getFullYear()} ShipTrack · Logistics Shipment Tracking System
      </footer>
    </div>
  );
}
