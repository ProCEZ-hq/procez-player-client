import { Trophy } from "lucide-react";
import { TactileCard } from "@/components/ui/TactileCard";
import { TrophyBadge } from "@/components/ui/TrophyBadge";

interface Badge {
    id: string;
    badge_name: string;
}

const TOTAL_SLOTS = 6;

export function TrophyCase({ badges }: { badges: Badge[] }) {
    const lockedCount = Math.max(TOTAL_SLOTS - badges.length, 0);

    return (
        <TactileCard className="rounded-[2rem]">
            <h2 className="text-xs uppercase tracking-widest text-on-surface-variant mb-8">Trophy Tray</h2>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-6">
                {badges.map((b) => (
                    <TrophyBadge key={b.id} label={b.badge_name} icon={<Trophy size={18} />} />
                ))}
                {Array.from({ length: lockedCount }).map((_, i) => (
                    <TrophyBadge key={`locked-${i}`} label="Locked" locked />
                ))}
            </div>
        </TactileCard>
    );
}