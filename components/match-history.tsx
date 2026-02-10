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
    return date.toLocaleDateString("es-AR", {"use client";

import { type Player, type Match } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Calendar, Trophy } from "lucide-react";

interface MatchHistoryProps {
  matches: Match[];
  players: Player[];
}

export function MatchHistory({ matches, players }: MatchHistoryProps) {
  
  // Función auxiliar para encontrar los nombres de los jugadores por sus IDs
  const getPlayerNames = (ids: string[]) => {
    return ids.map(id => players.find(p => p.id === id)).filter(Boolean) as Player[];
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("es-AR", {
      day: "numeric",
      month: "short",
    });
  };

  if (matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
        <Calendar className="mb-2 h-10 w-10 opacity-20" />
        <p>No hay partidos jugados aún</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {matches.map((match) => {
        const teamAPlayers = getPlayerNames(match.team_a_ids || []);
        const teamBPlayers = getPlayerNames(match.team_b_ids || []);

        return (
          <div key={match.id} className="overflow-hidden rounded-xl border border-border bg-card">
            {/* Cabecera del Partido */}
            <div className="flex items-center justify-between border-b border-border bg-secondary/30 px-4 py-2">
              <span className="text-xs font-medium text-muted-foreground">
                {formatDate(match.fecha)}
              </span>
              {match.equipo_ganador === "Empate" ? (
                <span className="flex items-center gap-1 text-xs font-bold text-muted-foreground">
                  EMPATE
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs font-bold text-primary">
                  <Trophy className="h-3 w-3" />
                  GANA EQUIPO {match.equipo_ganador} (+{match.diferencia_goles})
                </span>
              )}
            </div>

            {/* Equipos */}
            <div className="grid grid-cols-2 divide-x divide-border">
              {/* Equipo A */}
              <div className={cn("p-3", match.equipo_ganador === "A" && "bg-primary/5")}>
                <div className="mb-2 text-xs font-bold uppercase text-accent">Equipo A</div>
                <div className="flex flex-wrap gap-1">
                  {teamAPlayers.map((p) => (
                    <span key={p.id} className="rounded bg-secondary px-1.5 py-0.5 text-[10px]">
                      {p.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Equipo B */}
              <div className={cn("p-3", match.equipo_ganador === "B" && "bg-success/5")}>
                <div className="mb-2 text-xs font-bold uppercase text-success">Equipo B</div>
                <div className="flex flex-wrap gap-1">
                  {teamBPlayers.map((p) => (
                    <span key={p.id} className="rounded bg-secondary px-1.5 py-0.5 text-[10px]">
                      {p.name}
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
