"use client";

import { type PlayerStats } from "@/lib/store";
import { getRoleLabel, getRoleColor } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Trophy, TrendingUp, ChevronRight } from "lucide-react";

interface StandingsTableProps {
  stats: PlayerStats[];
  onPlayerClick?: (playerId: string) => void;
}

export function StandingsTable({ stats, onPlayerClick }: StandingsTableProps) {
  // Sort by points, then by goal difference, then by wins
  const sorted = [...stats].sort((a, b) => {
    if (b.puntos !== a.puntos) return b.puntos - a.puntos;
    if (b.diferencia_goles !== a.diferencia_goles)
      return b.diferencia_goles - a.diferencia_goles;
    return b.partidos_ganados - a.partidos_ganados;
  });

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      {/* Header */}
      <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] items-center gap-2 border-b border-border bg-secondary/50 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        <span className="w-6 text-center">#</span>
        <span>Jugador</span>
        <span className="w-8 text-center">PJ</span>
        <span className="w-10 text-center">DG</span>
        <span className="w-10 text-center">Pts</span>
        <span className="w-5" />
      </div>

      {/* Rows */}
      <div className="divide-y divide-border">
        {sorted.map((stat, index) => (
          <button
            key={stat.player.id}
            type="button"
            onClick={() => onPlayerClick?.(stat.player.id)}
            className="grid w-full grid-cols-[auto_1fr_auto_auto_auto_auto] items-center gap-2 px-3 py-3 text-left transition-colors hover:bg-secondary/30 active:bg-secondary/50"
          >
            {/* Position */}
            <span
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold",
                index === 0 &&
                  "bg-primary/20 text-primary ring-1 ring-primary/50",
                index === 1 && "bg-accent/20 text-accent",
                index === 2 && "bg-warning/20 text-warning",
                index > 2 && "text-muted-foreground"
              )}
            >
              {index === 0 ? (
                <Trophy className="h-3.5 w-3.5" />
              ) : (
                index + 1
              )}
            </span>

            {/* Player Info */}
            <div className="flex flex-col overflow-hidden">
              <div className="flex items-center gap-1.5">
                <span className="truncate font-semibold text-foreground">
                  {stat.player.apodo}
                </span>
                <span
                  className={cn(
                    "rounded border px-1 py-0.5 text-[8px] font-bold",
                    getRoleColor(stat.player.rol)
                  )}
                >
                  {getRoleLabel(stat.player.rol)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-0.5">
                  <TrendingUp className="h-3 w-3" />
                  {stat.win_rate.toFixed(0)}%
                </span>
                <span className="flex gap-0.5">
                  {stat.ultimos_5.map((r, i) => (
                    <span
                      key={i}
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        r === "W" && "bg-success",
                        r === "L" && "bg-destructive",
                        r === "D" && "bg-muted-foreground"
                      )}
                    />
                  ))}
                </span>
              </div>
            </div>

            {/* Stats */}
            <span className="w-8 text-center text-sm text-muted-foreground">
              {stat.partidos_jugados}
            </span>
            <span
              className={cn(
                "w-10 text-center text-sm font-medium",
                stat.diferencia_goles > 0 && "text-success",
                stat.diferencia_goles < 0 && "text-destructive",
                stat.diferencia_goles === 0 && "text-muted-foreground"
              )}
            >
              {stat.diferencia_goles > 0 ? "+" : ""}
              {stat.diferencia_goles}
            </span>
            <span className="w-10 text-center text-sm font-bold text-primary">
              {stat.puntos}
            </span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        ))}
      </div>
    </div>
  );
}
