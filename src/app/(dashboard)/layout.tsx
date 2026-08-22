import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardSidebar } from "@/components/nav/DashboardSidebar";
import { BottomNav } from "@/components/nav/BottomNav";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login?next=/home");
    }

    return (
        <div className="min-h-screen flex">
            <DashboardSidebar />
            {/* pb-24 clears the fixed BottomNav on mobile; md:pb-0 since the
          sidebar takes over and BottomNav is hidden at that breakpoint */}
            <main className="flex-1 min-w-0 pb-24 md:pb-0">{children}</main>
            <BottomNav />
        </div>
    );
}