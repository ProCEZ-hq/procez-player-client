"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { JoinTeamForm } from "@/components/team/JoinTeamForm";
import { TactileCard } from "@/components/ui/TactileCard";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

function JoinPageContent() {
    const searchParams = useSearchParams();
    const code = searchParams.get("code") ?? "";

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-background">
            <ThemeToggle className="fixed top-4 right-4 md:top-6 md:right-6" />
            <div className="w-full max-w-md space-y-4">
                <TactileCard className="text-center rounded-[2rem]">
                    <h1 className="text-2xl font-extrabold tracking-tight text-on-surface mb-1">Join a Team</h1>
                    <p className="text-on-surface-variant text-sm">
                        {code
                            ? "Confirm below to join with this invite code."
                            : "Enter the team code your captain shared with you."}
                    </p>
                </TactileCard>
                <JoinTeamForm defaultCode={code} />
            </div>
        </div>
    );
}

export default function JoinPage() {
    return (
        <Suspense fallback={null}>
            <JoinPageContent />
        </Suspense>
    );
}