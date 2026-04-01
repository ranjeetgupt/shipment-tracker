import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef(({ className, style, ...props }, ref) => (
  <textarea
    className={cn(
      "flex min-h-[100px] w-full rounded-lg px-3 py-2 text-sm",
      "transition-all duration-200 resize-none",
      "focus:outline-none focus:ring-2 focus:ring-blue-500/40",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "placeholder:opacity-50",
      className
    )}
    style={{
      background: "var(--bg-input)",
      border: "1px solid var(--color-border)",
      color: "var(--color-text)",
      ...style,
    }}
    ref={ref}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export { Textarea };
