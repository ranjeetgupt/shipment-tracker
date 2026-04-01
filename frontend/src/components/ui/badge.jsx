import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors select-none",
  {
    variants: {
      variant: {
        default:   "border-blue-500/30 bg-blue-500/15 text-blue-400",
        secondary: "border-white/10 bg-white/5 text-muted-foreground",
        destructive: "border-red-500/30 bg-red-500/15 text-red-400",
        success:   "border-emerald-500/30 bg-emerald-500/15 text-emerald-400",
        warning:   "border-amber-500/30 bg-amber-500/15 text-amber-400",
        outline:   "border-white/15 bg-transparent text-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
