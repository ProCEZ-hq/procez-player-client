"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { JoinTeamForm } from "@/components/team/JoinTeamForm";
import { GlassCard } from "@/components/ui/GlassCard";

function JoinPageContent() {
    const searchParams = useSearchParams();
    const code = searchParams.get("code") ?? "";

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md space-y-4">
                <GlassCard className="text-center">
                    <h1 className="text-2xl font-display font-bold text-glow-cyan mb-1">
                        Join a Team
                    </h1>
                    <p className="text-white/50 text-sm">
                        {code
                            ? "Confirm below to join with this invite code."
                            : "Enter the team code your captain shared with you."}
                    </p>
                </GlassCard>
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