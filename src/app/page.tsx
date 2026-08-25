import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function RootPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Signed-in players go straight to their dashboard; everyone else
    // lands on the registration flow.
    redirect(user ? "/home" : "/register");
}