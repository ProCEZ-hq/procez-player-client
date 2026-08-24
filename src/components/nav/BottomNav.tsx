"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/home", label: "Home", icon: "home" },
  { href: "/tournaments", label: "Stats", icon: "analytics" },
  { href: "/my-tournaments", label: "Medals", icon: "workspace_premium" },
  { href: "/profile", label: "Profile", icon: "person" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
      />
      <nav
        className="fixed bottom-0 w-full h-20 md:hidden flex items-center justify-around rounded-t-xl z-50 bg-surface shadow-[0px_-6px_12px_#c5ccd6]"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {NAV_ITEMS.map(({ href, label, icon }) => {
          const active = pathname === href || pathname?.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-xl w-16 transition-all duration-150 active:translate-y-0.5",
                active
                  ? "shadow-[inset_6px_6px_12px_#c5ccd6,inset_-6px_-6px_12px_#ffffff] text-primary"
                  : "text-on-surface-variant hover:text-primary"
              )}
            >
              <span
                className="material-symbols-outlined"
                style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {icon}
              </span>
              <span className="text-[12px] font-semibold uppercase tracking-wider mt-1">{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
