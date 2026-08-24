import { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface NeuCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  inset?: boolean;
}

export function NeuCard({ children, inset = false, className, ...props }: NeuCardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl p-6 bg-surface",
        inset ? "neu-inset" : "neu-extruded",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// Keep GlassCard as alias so existing imports don't break
export { NeuCard as GlassCard };
