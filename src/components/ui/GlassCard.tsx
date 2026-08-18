import { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  glow?: "cyan" | "magenta" | "none";
}

export function GlassCard({
  children,
  glow = "none",
  className,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl p-6 backdrop-blur-glass bg-white/[0.04] border border-white/10 shadow-glass transition-all duration-300",
        glow === "cyan" && "border-neon-cyan/30 hover:shadow-neon-cyan",
        glow === "magenta" && "border-neon-magenta/30 hover:shadow-neon-magenta",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}