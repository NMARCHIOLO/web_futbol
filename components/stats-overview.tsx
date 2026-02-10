"use client";

import { type PlayerStats } from "@/lib/store";
import { Trophy, Target, Users, Flame } from "lucide-react";

interface StatsOverviewProps {
  stats: PlayerStats[];
  totalMatches: number;
}

export function StatsOverview({ stats, totalMatches }: StatsOverviewProps) {
  const topScorer = [...stats].sort(
    (a, b) => b.diferencia_goles - a.diferencia_goles
  )[0];
  const topWinner = [...stats].sort(
    (a, b) => b.partidos_ganados - a.partidos_ganados
  )[0];
  const hotStreak = [...stats]
    .filter((s) => s.ultimos_5.length >= 3)
    .sort((a, b) => {
      const aStreak = a.ultimos_5.filter((r) => r === "W").length;
      const bStreak = b.ultimos_5.filter((r) => r === "W").length;
      return bStreak - aStreak;
    })[0];

  const cards = [
    {
      icon: Users,
      label: "Partidos Totales",
      value: totalMatches.toString(),
      accent: "text-accent",
      bg: "bg-accent/10",
    },
    {
      icon: Trophy,
      label: "Mas Victorias",
      value: topWinner?.player.apodo || "-",
      subvalue: `${topWinner?.partidos_ganados || 0} ganados`,
      accent: "text-primary",
      bg: "bg-primary/10",
    },
    {
      icon: Target,
      label: "Mejor Dif. Gol",
      value: topScorer?.player.apodo || "-",
      subvalue: `+${topScorer?.diferencia_goles || 0}`,
      accent: "text-success",
      bg: "bg-success/10",
    },
    {
      icon: Flame,
      label: "En Racha",
      value: hotStreak?.player.apodo || "-",
      subvalue: `${hotStreak?.ultimos_5.filter((r) => r === "W").length || 0}/5 W`,
      accent: "text-warning",
      bg: "bg-warning/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="flex flex-col gap-2 rounded-xl border border-border bg-card p-3"
        >
          <div className="flex items-center gap-2">
            <div className={`rounded-lg p-1.5 ${card.bg}`}>
              <card.icon className={`h-4 w-4 ${card.accent}`} />
            </div>
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              {card.label}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-foreground">
              {card.value}
            </span>
            {card.subvalue && (
              <span className={`text-xs font-medium ${card.accent}`}>
                {card.subvalue}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
