"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Users, User, ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LogoutButton } from "@/components/nav/LogoutButton";

const NAV_ITEMS = [
    { href: "/home", label: "Home", icon: Home },
    { href: "/tournaments", label: "Discover", icon: Compass },
    { href: "/my-tournaments", label: "My Teams", icon: Users },
    { href: "/profile", label: "Profile", icon: User },
];

interface DashboardSidebarProps {
    collapsed: boolean;
    onToggle: () => void;
}

export function DashboardSidebar({ collapsed, onToggle }: DashboardSidebarProps) {
    const pathname = usePathname();

    return (
        <aside
            className={cn(
                "hidden md:flex md:flex-col fixed left-0 top-0 h-screen z-40 bg-surface p-gutter gap-unit",
                "neu-extruded transition-[width] duration-200",
                collapsed ? "w-20" : "w-64"
            )}
        >
            <div className="flex items-center gap-3 px-2 py-4 mb-4">
                <div className="w-11 h-11 rounded-full neu-inset flex items-center justify-center text-accent font-extrabold shrink-0">
                    P
                </div>
                {!collapsed && (
                    <h1 className="font-extrabold tracking-tight text-on-surface truncate">
                        Pro<span className="text-accent">CEZ</span>
                    </h1>
                )}
            </div>

            <nav className="flex-1 flex flex-col gap-3 px-1">
                {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                    const active = pathname === href || pathname?.startsWith(`${href}/`);
                    return (
                        <Link
                            key={href}
                            href={href}
                            title={collapsed ? label : undefined}
                            className={cn(
                                "flex items-center gap-4 rounded-xl px-4 min-h-12 bg-surface transition-all duration-150 ease-out",
                                active
                                    ? "neu-inset text-accent translate-x-0.5 translate-y-0.5"
                                    : "neu-extruded text-on-surface-variant hover:text-accent"
                            )}
                        >
                            <Icon size={20} className="shrink-0" />
                            {!collapsed && <span className="text-sm font-semibold truncate">{label}</span>}
                        </Link>
                    );
                })}
            </nav>

            <div className="px-1 mb-2">
                <LogoutButton collapsed={collapsed} />
            </div>

            <div className="flex items-center justify-between px-1 mb-2 gap-2">
                <ThemeToggle />
                {!collapsed ? (
                    <button
                        onClick={onToggle}
                        className="neu-extruded neu-button flex-1 min-h-12 rounded-xl bg-surface text-on-surface-variant hover:text-accent flex items-center justify-center gap-2 text-sm"
                        aria-label="Collapse sidebar"
                    >
                        <ChevronsLeft size={18} />
                        Collapse
                    </button>
                ) : (
                    <button
                        onClick={onToggle}
                        className="neu-extruded neu-button w-10 h-10 rounded-full bg-surface text-on-surface-variant hover:text-accent flex items-center justify-center"
                        aria-label="Expand sidebar"
                    >
                        <ChevronsRight size={18} />
                    </button>
                )}
            </div>
        </aside>
    );
}