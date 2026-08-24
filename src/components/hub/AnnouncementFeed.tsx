import { Megaphone, AlertTriangle, Wrench } from "lucide-react";
import { TactileCard } from "@/components/ui/TactileCard";

interface Announcement {
    id: string;
    title: string;
    message: string;
    type: "INFO" | "ALERT" | "MAINTENANCE";
    created_at: string;
}

const TYPE_CONFIG: Record<Announcement["type"], { icon: React.ReactNode; label: string; classes: string }> = {
    INFO: { icon: <Megaphone size={12} />, label: "Info", classes: "text-accent" },
    ALERT: { icon: <AlertTriangle size={12} />, label: "Alert", classes: "text-error" },
    MAINTENANCE: { icon: <Wrench size={12} />, label: "Maintenance", classes: "text-tertiary-container" },
};

export function AnnouncementFeed({ announcements }: { announcements: Announcement[] }) {
    if (announcements.length === 0) {
        return (
            <TactileCard>
                <p className="text-on-surface-variant text-sm">No announcements right now.</p>
            </TactileCard>
        );
    }

    return (
        <div className="space-y-4 max-h-80 overflow-y-auto momentum-scroll pr-1">
            {announcements.map((a) => {
                const config = TYPE_CONFIG[a.type];
                return (
                    <TactileCard key={a.id} className="p-4">
                        <div className="flex items-start justify-between gap-3 mb-1.5">
                            <p className="font-semibold text-on-surface truncate">{a.title}</p>
                            <span className={`shrink-0 inline-flex items-center gap-1 text-[10px] uppercase tracking-wide font-semibold ${config.classes}`}>
                                {config.icon}
                                {config.label}
                            </span>
                        </div>
                        <p className="text-on-surface-variant text-sm">{a.message}</p>
                        <p className="text-on-surface-variant/60 text-xs mt-1.5">{new Date(a.created_at).toLocaleString()}</p>
                    </TactileCard>
                );
            })}
        </div>
    );
}