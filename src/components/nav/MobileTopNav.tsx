"use client";

import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function MobileTopNav() {
    return (
        <nav className="flex md:hidden items-center justify-between h-16 px-gutter sticky top-0 z-50 bg-surface neu-extruded">
            <span className="font-extrabold tracking-tight text-on-surface">
                Pro<span className="text-accent">CEZ</span>
            </span>
            <ThemeToggle />
        </nav>
    );
}