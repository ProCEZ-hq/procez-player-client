"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Users, User } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
    { href: "/home", label: "Home", icon: Home },
    { href: "/tournaments", label: "Discover", icon: Compass },
    { href: "/my-tournaments", label: "Teams", icon: Users },
    { href: "/profile", label: "Profile", icon: User },
];

export function BottomNav() {
    const pathname = usePathname();

    return (
        <nav
            className="flex md:hidden fixed bottom-0 inset-x-0 z-50 justify-around items-center bg-surface neu-extruded px-4 pt-2"
            style={{ paddingBottom: "max(env(safe-area-inset-bottom), 8px)" }}
        >
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                const active = pathname === href || pathname?.startsWith(`${href}/`);
                return (
                    <Link key={href} href={href} className="flex flex-col items-center justify-center gap-1 py-1.5">
                        {/* 48x48px minimum touch target */}
                        <span
                            className={cn(
                                "flex items-center justify-center w-12 h-12 rounded-xl bg-surface transition-all duration-150",
                                active ? "neu-inset text-accent translate-y-0.5" : "text-on-surface-variant"
                            )}
                        >
                            <Icon size={20} />
                        </span>
                        <span className={cn("text-[10px] font-semibold uppercase tracking-wide", active ? "text-accent" : "text-on-surface-variant")}>
                            {label}
                        </span>
                    </Link>
                );
            })}
        </nav>
    );
}