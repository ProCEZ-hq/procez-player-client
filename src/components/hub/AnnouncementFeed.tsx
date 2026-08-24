interface Announcement {
  id: string;
  title: string;
  message: string;
  type: "INFO" | "ALERT" | "MAINTENANCE";
  created_at: string;
}

const TYPE_ICON: Record<Announcement["type"], string> = {
  INFO: "campaign",
  ALERT: "warning",
  MAINTENANCE: "build",
};

export function AnnouncementFeed({ announcements }: { announcements: Announcement[] }) {
  if (announcements.length === 0) {
    return <p className="text-on-surface-variant text-sm">No announcements right now.</p>;
  }

  return (
    <div className="space-y-3 max-h-80 overflow-y-auto momentum-scroll pr-1">
      {announcements.map((a) => (
        <div key={a.id} className="neu-extruded rounded-2xl p-4 bg-surface flex items-start gap-3">
          <span className="material-symbols-outlined text-primary mt-0.5 shrink-0">
            {TYPE_ICON[a.type]}
          </span>
          <div className="min-w-0">
            <p className="font-semibold text-on-surface truncate">{a.title}</p>
            <p className="text-on-surface-variant text-sm">{a.message}</p>
            <p className="text-outline text-xs mt-1">{new Date(a.created_at).toLocaleString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
