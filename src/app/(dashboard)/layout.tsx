import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardSidebar } from "@/components/nav/DashboardSidebar";
import { BottomNav } from "@/components/nav/BottomNav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/home");

  return (
    <div className="min-h-screen flex flex-col">
      {/* Mobile top nav */}
      <nav className="w-full h-16 flex items-center justify-between px-4 md:hidden sticky top-0 z-50 bg-surface shadow-[0px_6px_12px_#c5ccd6]">
        <span className="text-2xl font-bold text-on-surface">ProCEZ</span>
        <div className="flex gap-3">
          <button className="neu-button p-2 rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="neu-button p-2 rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary">
            <span className="material-symbols-outlined">account_circle</span>
          </button>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar />
        <main className="flex-1 md:ml-64 overflow-y-auto p-6 md:p-16 pb-32 md:pb-16">
          {children}
        </main>
      </div>

      <BottomNav />

      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
      />
    </div>
  );
}
