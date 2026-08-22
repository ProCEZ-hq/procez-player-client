"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Users, User } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
    { href: "/home", label: "Home", icon: Home },
    { href: "/tournaments", label: "Discover", icon: Compass },
    { href: "/my-tournaments", label: "My Teams", icon: Users },
    { href: "/profile", label: "Profile", icon: User },
];

export function DashboardSidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden md:flex md:flex-col w-64 shrink-0 min-h-screen sticky top-0 backdrop-blur-glass bg-white/[0.03] border-r border-white/10 px-4 py-6">
            <div className="px-2 mb-8">
                <h1 className="text-lg font-display font-bold text-glow-cyan">
                    Pro<span className="text-neon-magenta">CEZ</span>
                </h1>
            </div>

            <nav className="flex flex-col gap-1">
                {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                    const active = pathname === href || pathname?.startsWith(`${href}/`);
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-3 rounded-lg text-sm min-h-[44px] transition-colors",
                                active
                                    ? "bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30 shadow-neon-cyan"
                                    : "text-white/60 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <Icon size={20} />
                            {label}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}