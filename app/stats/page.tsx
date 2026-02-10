"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { BottomNav } from "@/components/bottom-nav";
import { WinRateChart } from "@/components/win-rate-chart";
import { MatchHistory } from "@/components/match-history";
import { TopPairs } from "@/components/top-pairs";
import {
  calculatePlayerStats,
  getPlayers,
  getMatches,
  getParticipations,
  type PlayerStats,
} from "@/lib/store";
import { type Player, type Match, type Participation } from "@/lib/data";
import { TrendingUp, History, Users2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { resetToMockData } from "@/lib/store";

export default function StatsPage() {
  const router = useRouter();
  const [stats, setStats] = useState<PlayerStats[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [participations, setParticipations] = useState<Participation[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"winrate" | "history" | "pairs">(
    "winrate"
  );

  const loadData = () => {
    setStats(calculatePlayerStats());
    setMatches(getMatches());
    setParticipations(getParticipations());
    setPlayers(getPlayers());
  };

  useEffect(() => {
    setMounted(true);
    loadData();
  }, []);

  const handleReset = () => {
    if (
      confirm(
        "Esto reiniciara todos los datos a los valores de prueba. Continuar?"
      )
    ) {
      resetToMockData();
      loadData();
    }
  };

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const tabs = [
    { id: "winrate" as const, icon: TrendingUp, label: "Win Rate" },
    { id: "history" as const, icon: History, label: "Historial" },
    { id: "pairs" as const, icon: Users2, label: "Duplas" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background pb-24">
      <AppHeader title="Estadisticas" subtitle="Analisis avanzado" />

      <main className="flex flex-1 flex-col gap-4 px-4 py-4">
        {/* Tab Navigation */}
        <div className="flex gap-2 rounded-xl border border-border bg-card p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "winrate" && (
          <WinRateChart
            stats={stats}
            onPlayerClick={(id) => router.push(`/jugadores/${id}`)}
          />
        )}

        {activeTab === "history" && (
          <MatchHistory
            matches={matches}
            participations={participations}
            players={players}
          />
        )}

        {activeTab === "pairs" && (
          <TopPairs
            players={players}
            matches={matches}
            participations={participations}
          />
        )}

        {/* Reset Button */}
        <div className="mt-4">
          <Button
            variant="outline"
            size="sm"
            className="w-full border-dashed text-muted-foreground bg-transparent"
            onClick={handleReset}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reiniciar Datos de Prueba
          </Button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
