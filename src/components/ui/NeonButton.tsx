"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "cyan" | "magenta";
  loading?: boolean;
}

export function NeonButton({
  children,
  variant = "cyan",
  loading = false,
  className,
  disabled,
  ...props
}: NeonButtonProps) {
  const colors = {
    cyan: "border-neon-cyan text-neon-cyan hover:shadow-neon-cyan hover:bg-neon-cyan/10",
    magenta:
      "border-neon-magenta text-neon-magenta hover:shadow-neon-magenta hover:bg-neon-magenta/10",
  };

  return (
    <button
      disabled={disabled || loading}
      className={cn(
        "relative px-6 py-2.5 rounded-lg border font-display font-medium tracking-wide uppercase text-sm",
        "transition-all duration-300 ease-out active:scale-95",
        "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none",
        colors[variant],
        className
      )}
      {...props}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}