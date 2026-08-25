"use client";

import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LogoutButton } from "@/components/nav/LogoutButton";

export function MobileTopNav() {
    return (
        <nav className="flex md:hidden items-center justify-between h-16 px-gutter sticky top-0 z-50 bg-surface neu-extruded">
            <span className="font-extrabold tracking-tight text-on-surface">
                Pro<span className="text-accent">CEZ</span>
            </span>
            <div className="flex items-center gap-3">
                <ThemeToggle />
                <LogoutButton className="w-10 h-10 min-h-10 rounded-full p-0" />
            </div>
        </nav>
    );
}
