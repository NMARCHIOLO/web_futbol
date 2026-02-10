"use client";

import { type Player, type Match, type Participation } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Calendar, Trophy } from "lucide-react";

interface MatchHistoryProps {
  matches: Match[];
  participations: Participation[];
  players: Player[];
}

export function MatchHistory({
  matches,
  participations,
  players,
}: MatchHistoryProps) {
  // Sort matches by date descending
  const sortedMatches = [...matches].sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  );

  const getTeamPlayers = (matchId: string, team: "A" | "B") => {
    return participations
      .filter((p) => p.partido_id === matchId && p.equipo === team)
      .map((p) => players.find((pl) => pl.id === p.jugador_id))
      .filter(Boolean) as Player[];
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-AR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (sortedMatches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card px-4 py-12 text-center">
        <Calendar className="mb-3 h-10 w-10 text-muted-foreground" />
        <p className="font-medium text-muted-foreground">
          No hay partidos registrados
        </p>
        <p className="mt-1 text-sm text-muted-foreground/70">
          Crea un nuevo partido para comenzar
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sortedMatches.map((match) => {
        const teamA = getTeamPlayers(match.id, "A");
        const teamB = getTeamPlayers(match.id, "B");

        return (
          <div
            key={match.id}
            className="overflow-hidden rounded-xl border border-border bg-card"
          >
            {/* Match Header */}
            <div className="flex items-center justify-between border-b border-border bg-secondary/30 px-4 py-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span>{formatDate(match.fecha)}</span>
              </div>
              {match.equipo_ganador !== "Empate" && (
                <div className="flex items-center gap-1 text-xs text-success">
                  <Trophy className="h-3.5 w-3.5" />
                  <span>Equipo {match.equipo_ganador}</span>
                </div>
              )}
              {match.equipo_ganador === "Empate" && (
                <span className="text-xs text-warning">Empate</span>
              )}
            </div>

            {/* Teams */}
            <div className="grid grid-cols-2 divide-x divide-border">
              {/* Team A */}
              <div
                className={cn(
                  "p-3",
                  match.equipo_ganador === "A" && "bg-success/5"
                )}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span
                    className={cn(
                      "text-xs font-bold uppercase",
                      match.equipo_ganador === "A"
                        ? "text-success"
                        : "text-primary"
                    )}
                  >
                    Equipo A
                  </span>
                  {match.equipo_ganador === "A" && (
                    <span className="text-lg font-black text-success">
                      +{match.diferencia_goles}
                    </span>
                  )}
                  {match.equipo_ganador === "B" && (
                    <span className="text-lg font-black text-destructive">
                      -{match.diferencia_goles}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1">
                  {teamA.map((player) => (
                    <span
                      key={player.id}
                      className="rounded-md bg-secondary px-2 py-0.5 text-xs text-foreground"
                    >
                      {player.apodo}
                    </span>
                  ))}
                </div>
              </div>

              {/* Team B */}
              <div
                className={cn(
                  "p-3",
                  match.equipo_ganador === "B" && "bg-success/5"
                )}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span
                    className={cn(
                      "text-xs font-bold uppercase",
                      match.equipo_ganador === "B"
                        ? "text-success"
                        : "text-accent"
                    )}
                  >
                    Equipo B
                  </span>
                  {match.equipo_ganador === "B" && (
                    <span className="text-lg font-black text-success">
                      +{match.diferencia_goles}
                    </span>
                  )}
                  {match.equipo_ganador === "A" && (
                    <span className="text-lg font-black text-destructive">
                      -{match.diferencia_goles}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1">
                  {teamB.map((player) => (
                    <span
                      key={player.id}
                      className="rounded-md bg-secondary px-2 py-0.5 text-xs text-foreground"
                    >
                      {player.apodo}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
