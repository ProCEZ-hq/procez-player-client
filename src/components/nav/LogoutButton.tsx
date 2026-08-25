"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface LogoutButtonProps {
    /** Icon-only round variant for the collapsed sidebar. */
    collapsed?: boolean;
    className?: string;
}

export function LogoutButton({ collapsed = false, className }: LogoutButtonProps) {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);

    async function handleLogout() {
        setLoading(true);
        await supabase.auth.signOut();
        router.push("/login");
        // Refresh so server components re-read the (now cleared) session.
        router.refresh();
    }

    return (
        <button
            type="button"
            onClick={handleLogout}
            disabled={loading}
            title={collapsed ? "Log out" : undefined}
            aria-label="Log out"
            className={cn(
                "neu-extruded neu-button bg-surface text-on-surface-variant hover:text-error",
                "flex items-center justify-center gap-2 min-h-12 text-sm font-semibold",
                "disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150",
                collapsed ? "w-10 h-10 min-h-10 rounded-full p-0 mx-auto" : "w-full rounded-xl px-4",
                className
            )}
        >
            <LogOut size={18} className="shrink-0" />
            {!collapsed && <span>{loading ? "Logging out..." : "Log out"}</span>}
        </button>
    );
}