import { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TactileCardProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    /** "extruded" (default) for elevated containers; "inset" for recessed
     *  digital-display panels. Per DESIGN.md: "do not stack multiple
     *  levels of extrusion" — nest inset inside extruded, not beside it. */
    tone?: "extruded" | "inset";
}

export function TactileCard({ children, tone = "extruded", className, ...props }: TactileCardProps) {
    return (
        <div
            className={cn(
                "rounded-xl bg-surface p-6 transition-shadow duration-150",
                tone === "extruded" ? "neu-extruded" : "neu-inset",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}