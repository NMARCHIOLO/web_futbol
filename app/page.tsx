"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { BottomNav } from "@/components/bottom-nav";
import { StandingsTable } from "@/components/standings-table";
import { StatsOverview } from "@/components/stats-overview";
import {
  calculatePlayerStats,
  getMatches,
  type PlayerStats,
} from "@/lib/store";

export default function HomePage() {
  const router = useRouter();
  const [stats, setStats] = useState<PlayerStats[]>([]);
  const [totalMatches, setTotalMatches] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setStats(calculatePlayerStats());
    setTotalMatches(getMatches().length);
  }, []);

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background pb-24">
      <AppHeader title="FutbolFriends" subtitle="Temporada 2026" />

      <main className="flex flex-1 flex-col gap-6 px-4 py-4">
        {/* Stats Overview */}
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Resumen
          </h2>
          <StatsOverview stats={stats} totalMatches={totalMatches} />
        </section>

        {/* Standings */}
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Tabla de Posiciones
          </h2>
          <StandingsTable
            stats={stats}
            onPlayerClick={(id) => router.push(`/jugadores/${id}`)}
          />
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
