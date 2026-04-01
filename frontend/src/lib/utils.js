import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const STATUS_CONFIG = {
  "Pending":           { color: "amber",   icon: "⏳", label: "Pending" },
  "Picked Up":         { color: "sky",     icon: "📦", label: "Picked Up" },
  "In Transit":        { color: "blue",    icon: "🚚", label: "In Transit" },
  "Out for Delivery":  { color: "violet",  icon: "🛵", label: "Out for Delivery" },
  "Delivered":         { color: "emerald", icon: "✅", label: "Delivered" },
  "Cancelled":         { color: "red",     icon: "❌", label: "Cancelled" },
  "Returned":          { color: "orange",  icon: "↩️",  label: "Returned" },
};

export const STATUSES = Object.keys(STATUS_CONFIG);

export const SERVICE_TYPES = ["Standard", "Express", "Overnight", "Economy"];
export const PACKAGE_TYPES = ["Document", "Parcel", "Fragile", "Perishable", "Electronics", "Other"];

export const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
};

export const formatDateTime = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};

export const getStatusColor = (status) => {
  const map = {
    "Pending":           "amber",
    "Picked Up":         "sky",
    "In Transit":        "blue",
    "Out for Delivery":  "violet",
    "Delivered":         "emerald",
    "Cancelled":         "red",
    "Returned":          "orange",
  };
  return map[status] || "gray";
};
