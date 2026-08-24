"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { JoinTeamForm } from "@/components/team/JoinTeamForm";

function JoinPageContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code") ?? "";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-surface">
      <div className="w-full max-w-md space-y-4">
        <div className="neu-extruded rounded-3xl p-6 bg-surface text-center">
          <h1 className="text-3xl font-extrabold text-on-surface mb-1 tracking-tight">Join a Team</h1>
          <p className="text-on-surface-variant text-sm">
            {code ? "Confirm below to join with this invite code." : "Enter the team code your captain shared with you."}
          </p>
        </div>
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
