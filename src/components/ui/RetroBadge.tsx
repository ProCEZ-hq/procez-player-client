import { Trophy } from "lucide-react";

const BADGE_STYLES: Record<string, { icon: React.ReactNode; label: string; glow: string }> = {
    "First Tournament": {
        icon: <Trophy size={16} />,
        label: "First Tournament",
        glow: "border-neon-lime/50 text-neon-lime shadow-[0_0_12px_rgba(198,255,0,0.35)]",
    },
};

export function RetroBadge({ badgeName }: { badgeName: string }) {
    const config = BADGE_STYLES[badgeName] ?? {
        icon: <Trophy size={16} />,
        label: badgeName,
        glow: "border-neon-cyan/50 text-neon-cyan shadow-[0_0_12px_rgba(0,246,255,0.35)]",
    };

    return (
        <div
            className={`inline-flex items-center gap-2 rounded-lg border bg-white/5 px-3 py-2 text-sm font-display uppercase tracking-wide ${config.glow}`}
        >
            {config.icon}
            {config.label}
        </div>
    );
}