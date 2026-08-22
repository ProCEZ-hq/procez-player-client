import { Megaphone, AlertTriangle, Wrench } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

interface Announcement {
    id: string;
    title: string;
    message: string;
    type: "INFO" | "ALERT" | "MAINTENANCE";
    created_at: string;
}

const TYPE_CONFIG: Record<Announcement["type"], { icon: React.ReactNode; glow: "cyan" | "magenta" | "none" }> = {
    INFO: { icon: <Megaphone size={16} className="text-neon-cyan" />, glow: "cyan" },
    ALERT: { icon: <AlertTriangle size={16} className="text-neon-magenta" />, glow: "magenta" },
    MAINTENANCE: { icon: <Wrench size={16} className="text-neon-lime" />, glow: "none" },
};

export function AnnouncementFeed({ announcements }: { announcements: Announcement[] }) {
    if (announcements.length === 0) {
        return <p className="text-white/40 text-sm">No announcements right now.</p>;
    }

    return (
        <div className="space-y-3 max-h-80 overflow-y-auto momentum-scroll pr-1">
            {announcements.map((a) => {
                const config = TYPE_CONFIG[a.type];
                return (
                    <GlassCard key={a.id} glow={config.glow}>
                        <div className="flex items-start gap-3">
                            <div className="mt-0.5 shrink-0">{config.icon}</div>
                            <div className="min-w-0">
                                <p className="font-semibold truncate">{a.title}</p>
                                <p className="text-white/60 text-sm">{a.message}</p>
                                <p className="text-white/30 text-xs mt-1">
                                    {new Date(a.created_at).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </GlassCard>
                );
            })}
        </div>
    );
}