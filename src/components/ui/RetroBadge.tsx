const BADGE_ICONS: Record<string, string> = {
  "First Tournament": "star",
};

export function RetroBadge({ badgeName }: { badgeName: string }) {
  const icon = BADGE_ICONS[badgeName] ?? "military_tech";

  return (
    <div className="flex flex-col items-center gap-2 group cursor-pointer">
      <div className="w-16 h-16 rounded-full neu-inset p-2 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full neu-extruded bg-surface flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
            {icon}
          </span>
        </div>
      </div>
      <span className="text-xs font-semibold uppercase tracking-wider text-on-surface text-center truncate w-full">
        {badgeName}
      </span>
    </div>
  );
}
