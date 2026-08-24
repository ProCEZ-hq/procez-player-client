"use client";

import { useState } from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import { BottomNav } from "./BottomNav";
import { MobileTopNav } from "./MobileTopNav";
import { cn } from "@/lib/utils";

export function DashboardShell({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="font-tactile min-h-screen flex bg-background text-on-surface">
            <DashboardSidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
            <div
                className={cn(
                    "flex-1 min-w-0 flex flex-col transition-[margin] duration-200",
                    collapsed ? "md:ml-20" : "md:ml-64"
                )}
            >
                <MobileTopNav />
                <main className="flex-1 pb-24 md:pb-0">{children}</main>
            </div>
            <BottomNav />
        </div>
    );
}