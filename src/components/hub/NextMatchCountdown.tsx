"use client";

import { useEffect, useState } from "react";

interface NextTournament {
  id: string;
  name: string;
  game_name: string;
  start_date: string;
  team_code: string;
}

function getTimeParts(ms: number) {
  const c = Math.max(ms, 0);
  return {
    hours: String(Math.floor(c / (1000 * 60 * 60))).padStart(2, "0"),
    minutes: String(Math.floor((c / (1000 * 60)) % 60)).padStart(2, "0"),
    seconds: String(Math.floor((c / 1000) % 60)).padStart(2, "0"),
  };
}

export function NextMatchCountdown({ tournament }: { tournament: NextTournament | null }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!tournament) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [tournament]);

  const target = tournament ? new Date(tournament.start_date).getTime() : 0;
  const { hours, minutes, seconds } = getTimeParts(target - now);

  return (
    <section className="neu-extruded rounded-3xl p-8 bg-surface">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-on-surface-variant mb-2">Next Match</h3>
          <h1 className="text-5xl font-extrabold text-on-surface mb-4 tracking-tight">
            {tournament ? tournament.name : "No upcoming matches"}
          </h1>
          {tournament ? (
            <div className="neu-inset rounded-full py-3 px-6 inline-flex items-center gap-3 bg-[#e0e5eb]">
              <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
              <span className="text-xl font-bold tracking-widest text-primary">
                LIVE IN {hours}:{minutes}:{seconds}
              </span>
            </div>
          ) : (
            <p className="text-on-surface-variant text-base">
              Register for a tournament to see your countdown here.
            </p>
          )}
        </div>
        {tournament && (
          <button className="w-full md:w-auto neu-button rounded-xl py-4 px-8 bg-surface text-primary text-xl font-semibold flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">login</span>
            <span>Join Lobby</span>
          </button>
        )}
      </div>
    </section>
  );
}
