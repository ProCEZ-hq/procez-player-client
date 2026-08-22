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
            className="flex md:hidden fixed bottom-0 inset-x-0 z-50 backdrop-blur-glass bg-void/90 border-t border-white/10"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                const active = pathname === href || pathname?.startsWith(`${href}/`);
                return (
                    <Link
                        key={href}
                        href={href}
                        className="flex-1 flex flex-col items-center justify-center gap-1 py-2 min-h-[56px] min-w-[44px]"
                    >
                        <Icon
                            size={22}
                            className={cn(
                                "transition-colors",
                                active
                                    ? "text-neon-cyan drop-shadow-[0_0_6px_rgba(0,246,255,0.8)]"
                                    : "text-white/40"
                            )}
                        />
                        <span
                            className={cn(
                                "text-[10px] uppercase tracking-wide",
                                active ? "text-neon-cyan" : "text-white/40"
                            )}
                        >
                            {label}
                        </span>
                    </Link>
                );
            })}
        </nav>
    );
}