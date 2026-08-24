import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { DashboardShell } from "@/components/nav/DashboardShell";

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
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            <DashboardShell>{children}</DashboardShell>
        </ThemeProvider>
    );
}