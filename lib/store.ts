import { supabase } from './supabase';
import { Player, Match } from './data';

// --- DEFINICIÓN DE LAS ESTADÍSTICAS ---
export interface PlayerStats {
  player: Player;
  partidos_jugados: number;
  partidos_ganados: number;
  partidos_empatados: number;
  partidos_perdidos: number;
  diferencia_goles: number; // Suma de goles a favor vs en contra
  puntos: number; // 3 por victoria, 1 por empate
  ultimos_5: ("W" | "D" | "L")[]; // Racha: Win, Draw, Loss
}

// --- JUGADORES ---
export async function getPlayers(): Promise<Player[]> {
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error cargando jugadores:', error);
    return [];
  }
  return data || [];
}

// --- PARTIDOS ---
export async function getMatches(): Promise<Match[]> {
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .order('fecha', { ascending: false }); // Los más recientes primero

  if (error) {
    console.error('Error cargando historial:', error);
    return [];
  }
  return data || [];
}

export async function saveMatch(match: Match) {
  const { error } = await supabase
    .from('matches')
    .insert([match]);

  if (error) {
    console.error('Error guardando partido:', error);
    throw error;
  }
}

// --- EL MOTOR DE CÁLCULO (NUEVO) ---
export async function getPlayerStats(): Promise<PlayerStats[]> {
  // 1. Traemos todo de la base de datos
  const [players, matches] = await Promise.all([getPlayers(), getMatches()]);

  // 2. Inicializamos el mapa de estadísticas por jugador
  const statsMap = new Map<string, PlayerStats>();

  players.forEach((p) => {
    if (p.id) {
      statsMap.set(p.id, {
        player: p,
        partidos_jugados: 0,
        partidos_ganados: 0,
        partidos_empatados: 0,
        partidos_perdidos: 0,
        diferencia_goles: 0,
        puntos: 0,
        ultimos_5: [],
      });
    }
  });

  // 3. Recorremos los partidos del más viejo al más nuevo para calcular la historia
  // (Invertimos el array solo para el cálculo cronológico)
  const cronologicalMatches = [...matches].reverse();

  cronologicalMatches.forEach((match) => {
    const isDraw = match.equipo_ganador === "Empate";
    const winnerTeam = match.equipo_ganador; // "A" o "B"
    const diff = match.diferencia_goles;

    // Procesar Equipo A
    match.team_a_ids?.forEach((playerId) => {
      const stat = statsMap.get(playerId);
      if (stat) {
        stat.partidos_jugados++;
        
        if (isDraw) {
          stat.partidos_empatados++;
          stat.puntos += 1;
          stat.ultimos_5.push("D");
        } else if (winnerTeam === "A") {
          stat.partidos_ganados++;
          stat.diferencia_goles += diff;
          stat.puntos += 3;
          stat.ultimos_5.push("W");
        } else {
          stat.partidos_perdidos++;
          stat.diferencia_goles -= diff;
          stat.ultimos_5.push("L");
        }
        // Mantenemos solo los últimos 5 resultados
        if (stat.ultimos_5.length > 5) stat.ultimos_5.shift();
      }
    });

    // Procesar Equipo B
    match.team_b_ids?.forEach((playerId) => {
      const stat = statsMap.get(playerId);
      if (stat) {
        stat.partidos_jugados++;

        if (isDraw) {
          stat.partidos_empatados++;
          stat.puntos += 1;
          stat.ultimos_5.push("D");
        } else if (winnerTeam === "B") {
          stat.partidos_ganados++;
          stat.diferencia_goles += diff;
          stat.puntos += 3;
          stat.ultimos_5.push("W");
        } else {
          stat.partidos_perdidos++;
          stat.diferencia_goles -= diff;
          stat.ultimos_5.push("L");
        }
        if (stat.ultimos_5.length > 5) stat.ultimos_5.shift();
      }
    });
  });

  // 4. Convertimos el mapa a array y lo ordenamos por puntos
  return Array.from(statsMap.values()).sort((a, b) => {
    if (b.puntos !== a.puntos) return b.puntos - a.puntos; // Primero por puntos
    if (b.diferencia_goles !== a.diferencia_goles) return b.diferencia_goles - a.diferencia_goles; // Desempate por goles
    return b.partidos_ganados - a.partidos_ganados; // Desempate por victorias
  });
}
