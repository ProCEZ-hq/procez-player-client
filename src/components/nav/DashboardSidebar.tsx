"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/home", label: "Dashboard", icon: "dashboard" },
  { href: "/tournaments", label: "Matches", icon: "sports_esports" },
  { href: "/my-tournaments", label: "Performance", icon: "insights" },
  { href: "/profile", label: "Profile", icon: "person" },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 hidden md:flex flex-col bg-surface shadow-[6px_0px_12px_#c5ccd6] gap-2 p-4 z-40">
      <div className="flex items-center gap-3 p-4 mb-8 neu-extruded rounded-2xl mx-2 mt-4">
        <div className="w-12 h-12 rounded-full overflow-hidden neu-inset border-4 border-surface flex items-center justify-center bg-primary-container">
          <span className="material-symbols-outlined text-primary">sports_esports</span>
        </div>
        <div>
          <h2 className="text-xl font-bold text-on-surface">ProCEZ</h2>
          <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">Elite Tier</p>
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-3 px-2">
        {NAV_ITEMS.map(({ href, label, icon }) => {
          const active = pathname === href || pathname?.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl text-xl font-semibold transition-all duration-150",
                active
                  ? "shadow-[inset_6px_6px_12px_#c5ccd6,inset_-6px_-6px_12px_#ffffff] text-primary translate-x-0.5 translate-y-0.5"
                  : "neu-button text-on-surface-variant hover:text-primary"
              )}
            >
              <span
                className="material-symbols-outlined"
                style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {icon}
              </span>
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-2 mb-4">
        <Link
          href="/profile"
          className="flex items-center gap-3 p-3 rounded-xl neu-button text-on-surface-variant hover:text-primary text-xl font-semibold transition-all duration-150"
        >
          <span className="material-symbols-outlined">settings</span>
          <span>Settings</span>
        </Link>
      </div>

      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
      />
    </aside>
  );
}
