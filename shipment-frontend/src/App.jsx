import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import Layout from "@/components/Layout";
import HomePage from "@/pages/HomePage";
import CreateShipmentPage from "@/pages/CreateShipmentPage";
import TrackShipmentPage from "@/pages/TrackShipmentPage";
import ShipmentHistoryPage from "@/pages/ShipmentHistoryPage";
import AdminDashboardPage from "@/pages/AdminDashboardPage";

function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center">
      <div className="text-6xl font-black gradient-text">404</div>
      <h2 className="text-xl font-bold" style={{ color: "var(--color-text)" }}>Page Not Found</h2>
      <p style={{ color: "var(--color-muted)" }}>The page you're looking for doesn't exist.</p>
      <a href="/" className="text-blue-500 hover:underline text-sm">← Back to Home</a>
    </div>
  );
}

function ToasterWithTheme() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: isDark ? "#0d1526" : "#ffffff",
          color: isDark ? "#f1f5f9" : "#0f172a",
          border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)",
          borderRadius: "0.75rem",
          fontSize: "14px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        },
        success: {
          iconTheme: { primary: "#34d399", secondary: isDark ? "#0d1526" : "#ffffff" },
        },
        error: {
          iconTheme: { primary: "#f87171", secondary: isDark ? "#0d1526" : "#ffffff" },
        },
      }}
    />
  );
}

function AppContent() {
  return (
    <BrowserRouter>
      <ToasterWithTheme />
      <Layout>
        <Routes>
          <Route path="/"          element={<HomePage />} />
          <Route path="/create"    element={<CreateShipmentPage />} />
          <Route path="/track"     element={<TrackShipmentPage />} />
          <Route path="/history"   element={<ShipmentHistoryPage />} />
          <Route path="/dashboard" element={<AdminDashboardPage />} />
          <Route path="*"          element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
