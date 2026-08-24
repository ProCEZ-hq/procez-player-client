"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle({ className = "" }: { className?: string }) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) {
        // Reserve the same footprint pre-hydration to avoid layout shift —
        // we can't safely render a theme-dependent icon before mount.
        return <div className={`w-10 h-10 rounded-full ${className}`} />;
    }

    const isDark = theme === "dark";

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className={`neu-extruded neu-button w-10 h-10 rounded-full bg-surface flex items-center justify-center text-on-surface-variant hover:text-accent transition-colors ${className}`}
        >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
    );
}