import { Users } from "lucide-react";
import { TactileCard } from "@/components/ui/TactileCard";

interface PerformanceGridProps {
    activeTeams: number;
    badgesEarned: number;
    totalBadgeSlots: number;
}

export function PerformanceGrid({ activeTeams, badgesEarned, totalBadgeSlots }: PerformanceGridProps) {
    const pct = totalBadgeSlots > 0 ? Math.round((badgesEarned / totalBadgeSlots) * 100) : 0;
    const circumference = 289; // matches r=46 ring math from the reference file
    const dashOffset = circumference - (circumference * pct) / 100;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-container-padding">
            {/* Real data: badges earned / total slots. No match-results engine
          exists yet, so this replaces the reference's fabricated "Win
          Rate" dial with a genuine metric, same SVG-ring technique. */}
            <TactileCard className="rounded-3xl flex flex-col items-center justify-center min-h-[240px]">
                <h3 className="text-sm text-on-surface-variant mb-6 w-full text-left">Trophy Progress</h3>
                <div className="relative w-36 h-36 rounded-full neu-extruded flex items-center justify-center">
                    <div className="absolute inset-4 rounded-full neu-inset bg-surface-container-lowest flex items-center justify-center">
                        <span className="text-2xl font-bold text-accent">{pct}%</span>
                    </div>
                    <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                        <circle className="text-surface-variant" cx="50" cy="50" fill="none" r="46" stroke="currentColor" strokeWidth="4" />
                        <circle
                            cx="50"
                            cy="50"
                            fill="none"
                            r="46"
                            stroke="var(--accent)"
                            strokeDasharray={circumference}
                            strokeDashoffset={dashOffset}
                            strokeLinecap="round"
                            strokeWidth="4"
                        />
                    </svg>
                </div>
                <p className="text-xs text-on-surface-variant mt-4">{badgesEarned} of {totalBadgeSlots} trophies</p>
            </TactileCard>

            <TactileCard className="rounded-3xl flex flex-col justify-between min-h-[240px]">
                <h3 className="text-sm text-on-surface-variant mb-2">Teams</h3>
                <div className="flex items-center gap-4 mt-auto">
                    <div className="w-14 h-14 rounded-full neu-inset flex items-center justify-center shrink-0">
                        <Users className="text-accent" size={22} />
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-on-surface">{activeTeams}</p>
                        <p className="text-on-surface-variant text-sm">
                            Active tournament {activeTeams === 1 ? "team" : "teams"}
                        </p>
                    </div>
                </div>
            </TactileCard>
        </div>
    );
}