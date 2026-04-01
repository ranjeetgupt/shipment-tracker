import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none",
  {
    variants: {
      variant: {
        default:
          "bg-blue-500 text-white shadow hover:bg-blue-600 active:scale-[0.98]",
        destructive:
          "bg-red-500/15 text-red-500 border border-red-500/30 hover:bg-red-500/20 active:scale-[0.98]",
        outline:
          "border bg-transparent hover:bg-[var(--bg-hover)] active:scale-[0.98]",
        secondary:
          "bg-[var(--bg-subtle)] hover:bg-[var(--bg-hover)] active:scale-[0.98]",
        ghost:
          "hover:bg-[var(--bg-hover)] active:scale-[0.98]",
        link:
          "text-blue-500 underline-offset-4 hover:underline p-0 h-auto",
        success:
          "bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 hover:bg-emerald-500/20 active:scale-[0.98]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-6 text-base",
        xl: "h-14 px-8 text-base font-semibold",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, style, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    // For variants that need CSS var colors, apply them via style
    const variantStyles = {
      outline: { borderColor: "var(--color-border)", color: "var(--color-text)" },
      secondary: { color: "var(--color-text)" },
      ghost: { color: "var(--color-muted)" },
    };
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        style={{ ...variantStyles[variant], ...style }}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
