"use client";

import { type Player, type Match, type Participation } from "@/lib/data";
import { Heart, Skull, Users } from "lucide-react";

interface TopPairsProps {
  players: Player[];
  matches: Match[];
  participations: Participation[];
}

interface PairStats {
  player1: Player;
  player2: Player;
  matchesTogether: number;
  winsTogether: number;
  winRate: number;
}

interface RivalStats {
  player1: Player;
  player2: Player;
  matchesAgainst: number;
  player1Wins: number;
  winRate: number;
}

export function TopPairs({ players, matches, participations }: TopPairsProps) {
  // Calculate best pairs (teammates)
  const calculatePairs = (): PairStats[] => {
    const pairMap = new Map<
      string,
      { wins: number; total: number; p1: string; p2: string }
    >();

    matches.forEach((match) => {
      const teamAPlayers = participations
        .filter((p) => p.partido_id === match.id && p.equipo === "A")
        .map((p) => p.jugador_id);
      const teamBPlayers = participations
        .filter((p) => p.partido_id === match.id && p.equipo === "B")
        .map((p) => p.jugador_id);

      // Process Team A pairs
      for (let i = 0; i < teamAPlayers.length; i++) {
        for (let j = i + 1; j < teamAPlayers.length; j++) {
          const key = [teamAPlayers[i], teamAPlayers[j]].sort().join("-");
          const current = pairMap.get(key) || {
            wins: 0,
            total: 0,
            p1: teamAPlayers[i],
            p2: teamAPlayers[j],
          };
          current.total++;
          if (match.equipo_ganador === "A") current.wins++;
          pairMap.set(key, current);
        }
      }

      // Process Team B pairs
      for (let i = 0; i < teamBPlayers.length; i++) {
        for (let j = i + 1; j < teamBPlayers.length; j++) {
          const key = [teamBPlayers[i], teamBPlayers[j]].sort().join("-");
          const current = pairMap.get(key) || {
            wins: 0,
            total: 0,
            p1: teamBPlayers[i],
            p2: teamBPlayers[j],
          };
          current.total++;
          if (match.equipo_ganador === "B") current.wins++;
          pairMap.set(key, current);
        }
      }
    });

    // Convert to array and filter
    const pairs: PairStats[] = [];
    pairMap.forEach((stats) => {
      if (stats.total >= 2) {
        const player1 = players.find((p) => p.id === stats.p1);
        const player2 = players.find((p) => p.id === stats.p2);
        if (player1 && player2) {
          pairs.push({
            player1,
            player2,
            matchesTogether: stats.total,
            winsTogether: stats.wins,
            winRate: (stats.wins / stats.total) * 100,
          });
        }
      }
    });

    return pairs.sort((a, b) => b.winRate - a.winRate).slice(0, 5);
  };

  // Calculate top rivals (opponents)
  const calculateRivals = (): RivalStats[] => {
    const rivalMap = new Map<
      string,
      { p1Wins: number; total: number; p1: string; p2: string }
    >();

    matches.forEach((match) => {
      const teamAPlayers = participations
        .filter((p) => p.partido_id === match.id && p.equipo === "A")
        .map((p) => p.jugador_id);
      const teamBPlayers = participations
        .filter((p) => p.partido_id === match.id && p.equipo === "B")
        .map((p) => p.jugador_id);

      // Process A vs B matchups
      for (const pA of teamAPlayers) {
        for (const pB of teamBPlayers) {
          const key = [pA, pB].sort().join("-");
          const isP1First = pA < pB;
          const current = rivalMap.get(key) || {
            p1Wins: 0,
            total: 0,
            p1: isP1First ? pA : pB,
            p2: isP1First ? pB : pA,
          };
          current.total++;
          if (
            (match.equipo_ganador === "A" && isP1First) ||
            (match.equipo_ganador === "B" && !isP1First)
          ) {
            current.p1Wins++;
          }
          rivalMap.set(key, current);
        }
      }
    });

    // Convert to array and filter - find most one-sided rivalries
    const rivals: RivalStats[] = [];
    rivalMap.forEach((stats) => {
      if (stats.total >= 2) {
        const player1 = players.find((p) => p.id === stats.p1);
        const player2 = players.find((p) => p.id === stats.p2);
        if (player1 && player2) {
          // Calculate dominance - how one-sided is this rivalry
          const winRate = Math.max(
            stats.p1Wins / stats.total,
            (stats.total - stats.p1Wins) / stats.total
          );
          // Swap players if p2 has more wins
          const p1Dominates = stats.p1Wins >= stats.total - stats.p1Wins;
          rivals.push({
            player1: p1Dominates ? player1 : player2,
            player2: p1Dominates ? player2 : player1,
            matchesAgainst: stats.total,
            player1Wins: p1Dominates
              ? stats.p1Wins
              : stats.total - stats.p1Wins,
            winRate: winRate * 100,
          });
        }
      }
    });

    return rivals.sort((a, b) => b.winRate - a.winRate).slice(0, 5);
  };

  const bestPairs = calculatePairs();
  const topRivals = calculateRivals();

  return (
    <div className="space-y-6">
      {/* Best Pairs */}
      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/10">
            <Heart className="h-4 w-4 text-success" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Mejores Duplas</h3>
            <p className="text-xs text-muted-foreground">
              Mayor % de victorias juntos
            </p>
          </div>
        </div>

        {bestPairs.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
            <Users className="mb-2 h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Faltan datos (min. 2 partidos juntos)
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {bestPairs.map((pair, index) => (
              <div
                key={`${pair.player1.id}-${pair.player2.id}`}
                className="flex items-center gap-3 px-4 py-3"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-success/20 text-xs font-bold text-success">
                  {index + 1}
                </span>
                <div className="flex flex-1 flex-col">
                  <span className="font-medium text-foreground">
                    {pair.player1.apodo} + {pair.player2.apodo}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {pair.winsTogether}/{pair.matchesTogether} victorias
                  </span>
                </div>
                <span className="text-lg font-bold text-success">
                  {pair.winRate.toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top Rivals */}
      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10">
            <Skull className="h-4 w-4 text-destructive" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Rivalidades</h3>
            <p className="text-xs text-muted-foreground">
              Enfrentamientos mas desiguales
            </p>
          </div>
        </div>

        {topRivals.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
            <Users className="mb-2 h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Faltan datos (min. 2 enfrentamientos)
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {topRivals.map((rival, index) => (
              <div
                key={`${rival.player1.id}-${rival.player2.id}`}
                className="flex items-center gap-3 px-4 py-3"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-destructive/20 text-xs font-bold text-destructive">
                  {index + 1}
                </span>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-success">
                      {rival.player1.apodo}
                    </span>
                    <span className="text-muted-foreground">vs</span>
                    <span className="font-medium text-destructive">
                      {rival.player2.apodo}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {rival.player1Wins} victorias de {rival.matchesAgainst}{" "}
                    enfrentamientos
                  </span>
                </div>
                <span className="text-lg font-bold text-destructive">
                  {rival.winRate.toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
