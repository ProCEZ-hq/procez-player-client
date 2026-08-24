import { ReactNode } from "react";
import { Lock, Trophy } from "lucide-react";

interface TrophyBadgeProps {
    label: string;
    icon?: ReactNode;
    locked?: boolean;
}

export function TrophyBadge({ label, icon, locked = false }: TrophyBadgeProps) {
    return (
        <div className="flex flex-col items-center gap-3">
            {/* Circular Medal Slot per DESIGN.md: stamped/inset outer ring;
          earned medal is an extruded "token" sitting inside it. */}
            <div className="w-16 h-16 rounded-full neu-inset bg-surface-container-lowest p-2 flex items-center justify-center">
                {locked ? (
                    <Lock size={18} className="text-on-surface-variant/40" />
                ) : (
                    <div className="w-full h-full rounded-full neu-extruded bg-surface flex items-center justify-center text-accent">
                        {icon ?? <Trophy size={18} />}
                    </div>
                )}
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant text-center truncate w-full">
                {label}
            </span>
        </div>
    );
}