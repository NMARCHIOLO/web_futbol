"use client";

import {
  type Player,
  type Match,
  type Participation,
  mockPlayers,
  mockMatches,
  mockParticipations,
  getPlayerAverage,
  getDefenseStat,
} from "./data";

const STORAGE_KEYS = {
  players: "futbol_players_v2",
  matches: "futbol_matches_v2",
  participations: "futbol_participations_v2",
} as const;

// Initialize with mock data if empty
function initializeStorage() {
  if (typeof window === "undefined") return;

  if (!localStorage.getItem(STORAGE_KEYS.players)) {
    localStorage.setItem(STORAGE_KEYS.players, JSON.stringify(mockPlayers));
  }
  if (!localStorage.getItem(STORAGE_KEYS.matches)) {
    localStorage.setItem(STORAGE_KEYS.matches, JSON.stringify(mockMatches));
  }
  if (!localStorage.getItem(STORAGE_KEYS.participations)) {
    localStorage.setItem(
      STORAGE_KEYS.participations,
      JSON.stringify(mockParticipations)
    );
  }
}

// Players CRUD
export function getPlayers(): Player[] {
  if (typeof window === "undefined") return mockPlayers;
  initializeStorage();
  const data = localStorage.getItem(STORAGE_KEYS.players);
  return data ? JSON.parse(data) : mockPlayers;
}

export function savePlayer(player: Player): void {
  const players = getPlayers();
  const index = players.findIndex((p) => p.id === player.id);
  if (index >= 0) {
    players[index] = player;
  } else {
    players.push(player);
  }
  localStorage.setItem(STORAGE_KEYS.players, JSON.stringify(players));
}

export function deletePlayer(playerId: string): void {
  const players = getPlayers().filter((p) => p.id !== playerId);
  localStorage.setItem(STORAGE_KEYS.players, JSON.stringify(players));
}

// Matches CRUD
export function getMatches(): Match[] {
  if (typeof window === "undefined") return mockMatches;
  initializeStorage();
  const data = localStorage.getItem(STORAGE_KEYS.matches);
  return data ? JSON.parse(data) : mockMatches;
}

export function saveMatch(match: Match): void {
  const matches = getMatches();
  const index = matches.findIndex((m) => m.id === match.id);
  if (index >= 0) {
    matches[index] = match;
  } else {
    matches.push(match);
  }
  localStorage.setItem(STORAGE_KEYS.matches, JSON.stringify(matches));
}

// Participations CRUD
export function getParticipations(): Participation[] {
  if (typeof window === "undefined") return mockParticipations;
  initializeStorage();
  const data = localStorage.getItem(STORAGE_KEYS.participations);
  return data ? JSON.parse(data) : mockParticipations;
}

export function saveParticipations(participations: Participation[]): void {
  const existing = getParticipations();
  const newOnes = participations.filter(
    (p) =>
      !existing.some(
        (e) => e.partido_id === p.partido_id && e.jugador_id === p.jugador_id
      )
  );
  localStorage.setItem(
    STORAGE_KEYS.participations,
    JSON.stringify([...existing, ...newOnes])
  );
}

// Statistics calculations
export interface PlayerStats {
  player: Player;
  partidos_jugados: number;
  partidos_ganados: number;
  partidos_empatados: number;
  partidos_perdidos: number;
  diferencia_goles: number;
  puntos: number;
  win_rate: number;
  ultimos_5: ("W" | "L" | "D")[];
}

export function calculatePlayerStats(): PlayerStats[] {
  const players = getPlayers();
  const matches = getMatches();
  const participations = getParticipations();

  return players.map((player) => {
    const playerParticipations = participations.filter(
      (p) => p.jugador_id === player.id
    );
    const playerMatches = playerParticipations
      .map((pp) => {
        const match = matches.find((m) => m.id === pp.partido_id);
        return match ? { match, equipo: pp.equipo } : null;
      })
      .filter(Boolean) as { match: Match; equipo: "A" | "B" }[];

    let ganados = 0;
    let empatados = 0;
    let perdidos = 0;
    let difGoles = 0;
    const resultados: ("W" | "L" | "D")[] = [];

    // Sort by date for proper ordering
    playerMatches.sort(
      (a, b) =>
        new Date(a.match.fecha).getTime() - new Date(b.match.fecha).getTime()
    );

    playerMatches.forEach(({ match, equipo }) => {
      const gano =
        (match.equipo_ganador === "A" && equipo === "A") ||
        (match.equipo_ganador === "B" && equipo === "B");
      const empato = match.equipo_ganador === "Empate";
      const perdio = !gano && !empato;

      if (gano) {
        ganados++;
        difGoles += match.diferencia_goles;
        resultados.push("W");
      } else if (empato) {
        empatados++;
        resultados.push("D");
      } else if (perdio) {
        perdidos++;
        difGoles -= match.diferencia_goles;
        resultados.push("L");
      }
    });

    const puntos = ganados * 3 + empatados;
    const pj = playerMatches.length;

    return {
      player,
      partidos_jugados: pj,
      partidos_ganados: ganados,
      partidos_empatados: empatados,
      partidos_perdidos: perdidos,
      diferencia_goles: difGoles,
      puntos,
      win_rate: pj > 0 ? (ganados / pj) * 100 : 0,
      ultimos_5: resultados.slice(-5).reverse(),
    };
  });
}

// Advanced Insights
export interface PartnerInsight {
  partner: Player;
  matches_together: number;
  wins_together: number;
  win_rate: number;
}

export interface RivalInsight {
  rival: Player;
  matches_against: number;
  losses_against: number;
  loss_rate: number;
}

export function getIdealPartner(playerId: string): PartnerInsight | null {
  const players = getPlayers();
  const matches = getMatches();
  const participations = getParticipations();

  const partners: Map<string, { wins: number; total: number }> = new Map();

  participations
    .filter((p) => p.jugador_id === playerId)
    .forEach((pp) => {
      const match = matches.find((m) => m.id === pp.partido_id);
      if (!match) return;

      const teammates = participations.filter(
        (p) =>
          p.partido_id === pp.partido_id &&
          p.equipo === pp.equipo &&
          p.jugador_id !== playerId
      );

      const won =
        (match.equipo_ganador === "A" && pp.equipo === "A") ||
        (match.equipo_ganador === "B" && pp.equipo === "B");

      teammates.forEach((tm) => {
        const current = partners.get(tm.jugador_id) || { wins: 0, total: 0 };
        current.total++;
        if (won) current.wins++;
        partners.set(tm.jugador_id, current);
      });
    });

  let bestPartner: PartnerInsight | null = null;
  let bestRate = 0;

  partners.forEach((stats, partnerId) => {
    if (stats.total >= 1) {
      const rate = stats.wins / stats.total;
      if (rate > bestRate || (rate === bestRate && stats.total > (bestPartner?.matches_together || 0))) {
        const partner = players.find((p) => p.id === partnerId);
        if (partner) {
          bestRate = rate;
          bestPartner = {
            partner,
            matches_together: stats.total,
            wins_together: stats.wins,
            win_rate: rate * 100,
          };
        }
      }
    }
  });

  return bestPartner;
}

export function getNemesis(playerId: string): RivalInsight | null {
  const players = getPlayers();
  const matches = getMatches();
  const participations = getParticipations();

  const rivals: Map<string, { losses: number; total: number }> = new Map();

  participations
    .filter((p) => p.jugador_id === playerId)
    .forEach((pp) => {
      const match = matches.find((m) => m.id === pp.partido_id);
      if (!match) return;

      const opponents = participations.filter(
        (p) => p.partido_id === pp.partido_id && p.equipo !== pp.equipo
      );

      const lost =
        (match.equipo_ganador === "A" && pp.equipo === "B") ||
        (match.equipo_ganador === "B" && pp.equipo === "A");

      opponents.forEach((op) => {
        const current = rivals.get(op.jugador_id) || { losses: 0, total: 0 };
        current.total++;
        if (lost) current.losses++;
        rivals.set(op.jugador_id, current);
      });
    });

  let worstRival: RivalInsight | null = null;
  let worstRate = 0;

  rivals.forEach((stats, rivalId) => {
    if (stats.total >= 1) {
      const rate = stats.losses / stats.total;
      if (rate > worstRate || (rate === worstRate && stats.total > (worstRival?.matches_against || 0))) {
        const rival = players.find((p) => p.id === rivalId);
        if (rival) {
          worstRate = rate;
          worstRival = {
            rival,
            matches_against: stats.total,
            losses_against: stats.losses,
            loss_rate: rate * 100,
          };
        }
      }
    }
  });

  return worstRival;
}

// ==========================================
// INTELLIGENT TEAM BALANCING ALGORITHM
// Based on positions and roles
// ==========================================

export interface TeamBalanceResult {
  teamA: Player[];
  teamB: Player[];
  avgA: number;
  avgB: number;
  difference: number;
  warnings: string[];
  breakdown: {
    arqueros: { teamA: Player[]; teamB: Player[] };
    defensores: { teamA: Player[]; teamB: Player[] };
    otros: { teamA: Player[]; teamB: Player[] };
  };
}

export function balanceTeamsByPosition(
  selectedPlayers: Player[]
): TeamBalanceResult {
  const warnings: string[] = [];

  // Separate players by role
  const arqueros = selectedPlayers.filter((p) => p.rol === "Arquero");
  const defensores = selectedPlayers.filter((p) => p.rol === "Defensor");
  const otros = selectedPlayers.filter(
    (p) => p.rol !== "Arquero" && p.rol !== "Defensor"
  );

  const teamA: Player[] = [];
  const teamB: Player[] = [];

  // STEP A: Handle Goalkeepers (Priority 1)
  if (arqueros.length === 0) {
    warnings.push("No hay arqueros seleccionados");
  } else if (arqueros.length === 1) {
    warnings.push("Solo hay 1 arquero - un equipo quedara sin arquero");
    teamA.push(arqueros[0]);
  } else if (arqueros.length === 2) {
    // Perfect case: one GK per team
    teamA.push(arqueros[0]);
    teamB.push(arqueros[1]);
  } else {
    // More than 2 GKs - distribute first 2, rest go to field players
    teamA.push(arqueros[0]);
    teamB.push(arqueros[1]);
    // Extra GKs treated as field players
    const extraArqueros = arqueros.slice(2);
    otros.push(...extraArqueros);
    warnings.push(
      `${extraArqueros.length} arquero(s) extra jugaran de campo: ${extraArqueros.map((p) => p.apodo).join(", ")}`
    );
  }

  // STEP B: Balance Defenders with Snake Draft based on defense stat
  const sortedDefensores = [...defensores].sort(
    (a, b) => getDefenseStat(b) - getDefenseStat(a)
  );

  // Snake draft for defenders: B gets best, A gets 2nd and 3rd, B gets 4th and 5th, etc.
  sortedDefensores.forEach((player, index) => {
    const round = Math.floor(index / 2);
    const isOddRound = round % 2 === 1;

    if (index % 2 === 0) {
      // First pick of round
      if (isOddRound) teamA.push(player);
      else teamB.push(player);
    } else {
      // Second pick of round
      if (isOddRound) teamB.push(player);
      else teamA.push(player);
    }
  });

  // STEP C: Fill remaining players by accumulated average (greedy balance)
  const sortedOtros = [...otros].sort(
    (a, b) => getPlayerAverage(b) - getPlayerAverage(a)
  );

  sortedOtros.forEach((player) => {
    const avgA =
      teamA.length > 0
        ? teamA.reduce((sum, p) => sum + getPlayerAverage(p), 0) / teamA.length
        : 0;
    const avgB =
      teamB.length > 0
        ? teamB.reduce((sum, p) => sum + getPlayerAverage(p), 0) / teamB.length
        : 0;

    // Add to team with lower average, or fewer players if averages are equal
    if (avgA <= avgB || (avgA === avgB && teamA.length <= teamB.length)) {
      teamA.push(player);
    } else {
      teamB.push(player);
    }
  });

  // Calculate final averages
  const finalAvgA =
    teamA.length > 0
      ? teamA.reduce((sum, p) => sum + getPlayerAverage(p), 0) / teamA.length
      : 0;
  const finalAvgB =
    teamB.length > 0
      ? teamB.reduce((sum, p) => sum + getPlayerAverage(p), 0) / teamB.length
      : 0;

  // Check team size balance
  if (Math.abs(teamA.length - teamB.length) > 1) {
    warnings.push(
      `Equipos desbalanceados: A tiene ${teamA.length}, B tiene ${teamB.length}`
    );
  }

  return {
    teamA,
    teamB,
    avgA: finalAvgA,
    avgB: finalAvgB,
    difference: Math.abs(finalAvgA - finalAvgB),
    warnings,
    breakdown: {
      arqueros: {
        teamA: teamA.filter((p) => p.rol === "Arquero"),
        teamB: teamB.filter((p) => p.rol === "Arquero"),
      },
      defensores: {
        teamA: teamA.filter((p) => p.rol === "Defensor"),
        teamB: teamB.filter((p) => p.rol === "Defensor"),
      },
      otros: {
        teamA: teamA.filter(
          (p) => p.rol !== "Arquero" && p.rol !== "Defensor"
        ),
        teamB: teamB.filter(
          (p) => p.rol !== "Arquero" && p.rol !== "Defensor"
        ),
      },
    },
  };
}

// Legacy simple balance function (for backward compatibility)
export function balanceTeams(selectedPlayers: Player[]): TeamBalanceResult {
  return balanceTeamsByPosition(selectedPlayers);
}

// Reset to mock data
export function resetToMockData(): void {
  localStorage.setItem(STORAGE_KEYS.players, JSON.stringify(mockPlayers));
  localStorage.setItem(STORAGE_KEYS.matches, JSON.stringify(mockMatches));
  localStorage.setItem(
    STORAGE_KEYS.participations,
    JSON.stringify(mockParticipations)
  );
}
