import { STATUS_CONFIG } from "@/lib/utils";
import { cn } from "@/lib/utils";

const colorMap = {
  amber:   "bg-amber-500/15 text-amber-400 border-amber-500/30",
  sky:     "bg-sky-500/15 text-sky-400 border-sky-500/30",
  blue:    "bg-blue-500/15 text-blue-400 border-blue-500/30",
  violet:  "bg-violet-500/15 text-violet-400 border-violet-500/30",
  emerald: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  red:     "bg-red-500/15 text-red-400 border-red-500/30",
  orange:  "bg-orange-500/15 text-orange-400 border-orange-500/30",
  gray:    "bg-gray-500/15 text-gray-400 border-gray-500/30",
};

/**
 * Status badge that auto-applies the correct color from STATUS_CONFIG
 */
export function StatusBadge({ status, className, showIcon = true }) {
  const config = STATUS_CONFIG[status] || { color: "gray", icon: "❓", label: status };
  const colorClass = colorMap[config.color] || colorMap.gray;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        colorClass,
        className
      )}
    >
      {showIcon && <span>{config.icon}</span>}
      {config.label}
    </span>
  );
}
