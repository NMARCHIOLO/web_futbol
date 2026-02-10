"use client";

import React from "react";
import { type Player, getRoleColor, getRoleLabel } from "@/lib/data";
import { type PlayerStats } from "@/lib/store";
import { PlayerRadarChart } from "./player-radar-chart";
import { getPlayerAverage } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Zap, Activity, Brain, Target, ThumbsUp, ThumbsDown } from "lucide-react";

interface PlayerCardProps {
  player: Player;
  stats?: PlayerStats;
  compact?: boolean;
}

export function PlayerCard({ player, stats, compact = false }: PlayerCardProps) {
  const average = getPlayerAverage(player);

  if (compact) {
    return (
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex items-center gap-3 p-3">
          {/* Rating Badge */}
          <div className="flex h-12 w-12 flex-shrink-0 flex-col items-center justify-center rounded-xl bg-primary/20 ring-1 ring-primary/50">
            <span className="text-lg font-black text-primary">
              {average.toFixed(1)}
            </span>
          </div>

          {/* Info */}
          <div className="flex flex-1 flex-col gap-1 overflow-hidden">
            <div className="flex items-center gap-2">
              <span className="truncate text-base font-bold text-foreground">
                {player.apodo}
              </span>
              <span
                className={cn(
                  "rounded-md border px-1.5 py-0.5 text-[10px] font-bold",
                  getRoleColor(player.rol)
                )}
              >
                {getRoleLabel(player.rol)}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              {player.edad} años
            </span>
          </div>

          {/* Mini Radar */}
          <div className="h-16 w-16 flex-shrink-0">
            <PlayerRadarChart player={player} compact />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      {/* Header with gradient - FIFA style */}
      <div className="relative bg-gradient-to-br from-primary/20 via-accent/10 to-background p-4">
        {/* Rating Badge */}
        <div className="absolute right-4 top-4 flex h-14 w-14 flex-col items-center justify-center rounded-xl bg-primary/20 ring-2 ring-primary/50">
          <span className="text-2xl font-black text-primary">
            {average.toFixed(1)}
          </span>
        </div>

        {/* Player Info */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "rounded-lg border px-2 py-1 text-xs font-bold uppercase",
                getRoleColor(player.rol)
              )}
            >
              {player.rol}
            </span>
            <span className="text-xs text-muted-foreground">
              {player.edad} años
            </span>
          </div>
          <span className="text-2xl font-black uppercase tracking-tight text-foreground">
            {player.apodo}
          </span>
          <span className="text-sm text-muted-foreground">{player.nombre}</span>
        </div>

        {/* Stats Row */}
        {stats && (
          <div className="mt-4 flex gap-4 text-xs">
            <div className="flex flex-col">
              <span className="text-muted-foreground">PJ</span>
              <span className="font-bold text-foreground">
                {stats.partidos_jugados}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground">PG</span>
              <span className="font-bold text-success">
                {stats.partidos_ganados}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground">PE</span>
              <span className="font-bold text-warning">
                {stats.partidos_empatados}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground">PP</span>
              <span className="font-bold text-destructive">
                {stats.partidos_perdidos}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground">Win%</span>
              <span className="font-bold text-primary">
                {stats.win_rate.toFixed(0)}%
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Radar Chart */}
      <div className="px-4 py-2">
        <PlayerRadarChart player={player} />
      </div>

      {/* Stats Breakdown - 4 stats now */}
      <div className="grid grid-cols-4 gap-2 border-t border-border p-4">
        <StatBar
          icon={Zap}
          label="Tecnica"
          value={player.stat_tecnica}
          color="text-primary"
        />
        <StatBar
          icon={Activity}
          label="Fisico"
          value={player.stat_fisico}
          color="text-accent"
        />
        <StatBar
          icon={Target}
          label="Tactica"
          value={player.stat_tactica}
          color="text-warning"
        />
        <StatBar
          icon={Brain}
          label="Mental"
          value={player.stat_mental}
          color="text-emerald-400"
        />
      </div>

      {/* Fortaleza y Debilidad */}
      <div className="grid grid-cols-2 gap-2 border-t border-border p-4">
        <div className="rounded-lg bg-success/10 p-3">
          <div className="mb-1 flex items-center gap-1">
            <ThumbsUp className="h-3 w-3 text-success" />
            <span className="text-[10px] font-semibold uppercase text-success">
              Fortaleza
            </span>
          </div>
          <p className="text-xs leading-relaxed text-foreground">
            {player.fortaleza}
          </p>
        </div>
        <div className="rounded-lg bg-destructive/10 p-3">
          <div className="mb-1 flex items-center gap-1">
            <ThumbsDown className="h-3 w-3 text-destructive" />
            <span className="text-[10px] font-semibold uppercase text-destructive">
              Debilidad
            </span>
          </div>
          <p className="text-xs leading-relaxed text-foreground">
            {player.debilidad}
          </p>
        </div>
      </div>

      {/* Last 5 matches */}
      {stats && stats.ultimos_5.length > 0 && (
        <div className="border-t border-border p-4">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Ultimos 5 partidos
          </span>
          <div className="mt-2 flex gap-2">
            {stats.ultimos_5.map((result, i) => (
              <div
                key={i}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold",
                  result === "W" && "bg-success/20 text-success",
                  result === "L" && "bg-destructive/20 text-destructive",
                  result === "D" && "bg-muted text-muted-foreground"
                )}
              >
                {result}
              </div>
            ))}
            {/* Fill empty slots */}
            {Array.from({ length: 5 - stats.ultimos_5.length }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/50 text-xs text-muted-foreground"
              >
                -
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatBar({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <Icon className={cn("h-4 w-4", color)} />
      <span className="text-lg font-bold text-foreground">{value.toFixed(1)}</span>
      <span className="text-[9px] text-muted-foreground">{label}</span>
    </div>
  );
}
