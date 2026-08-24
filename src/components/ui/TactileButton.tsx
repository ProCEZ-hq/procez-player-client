"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TactileButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    /** "accent" per DESIGN.md's Accent Buttons spec: text/icon takes the
     *  accent color, the button surface itself stays the background color. */
    variant?: "surface" | "accent";
    loading?: boolean;
    size?: "md" | "lg";
}

export function TactileButton({
    children,
    variant = "surface",
    loading = false,
    size = "md",
    disabled,
    className,
    ...props
}: TactileButtonProps) {
    return (
        <button
            disabled={disabled || loading}
            className={cn(
                "neu-extruded neu-button rounded-lg bg-surface inline-flex items-center justify-center gap-2",
                "font-semibold tracking-wide",
                variant === "accent" ? "text-accent" : "text-on-surface",
                size === "md" ? "min-h-12 min-w-12 px-5 text-sm" : "min-h-14 min-w-14 px-7 text-base",
                "disabled:opacity-40 disabled:cursor-not-allowed",
                className
            )}
            {...props}
        >
            {loading ? "Loading..." : children}
        </button>
    );
}