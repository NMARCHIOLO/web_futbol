// Types - Updated structure based on real player data
export type PlayerRole = "Arquero" | "Defensor" | "Medio" | "Delantero";

export interface Player {
  id: string;
  nombre: string;
  apodo: string;
  edad: number;
  rol: PlayerRole;
  // Stats (1-10 scale)
  stat_tecnica: number;
  stat_fisico: number;
  stat_tactica: number;
  stat_mental: number;
  promedio_general: number;
  // Text qualities
  fortaleza: string;
  debilidad: string;
}

export interface Match {
  id: string;
  fecha: string;
  diferencia_goles: number;
  equipo_ganador: "A" | "B" | "Empate";
}

export interface Participation {
  partido_id: string;
  jugador_id: string;
  equipo: "A" | "B";
}

// Calculate player average from stats
export function getPlayerAverage(player: Player): number {
  return player.promedio_general;
}

// Get stat for defense (used in algorithm)
export function getDefenseStat(player: Player): number {
  return player.stat_tactica;
}

// Role badge colors
export function getRoleColor(rol: PlayerRole): string {
  switch (rol) {
    case "Arquero":
      return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    case "Defensor":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "Medio":
      return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    case "Delantero":
      return "bg-red-500/20 text-red-400 border-red-500/30";
  }
}

// Role icon label
export function getRoleLabel(rol: PlayerRole): string {
  switch (rol) {
    case "Arquero":
      return "ARQ";
    case "Defensor":
      return "DEF";
    case "Medio":
      return "MED";
    case "Delantero":
      return "DEL";
  }
}

// Real player data from CSV
export const mockPlayers: Player[] = [
  {
    id: "p1",
    nombre: "Mariano",
    apodo: "Mariano",
    edad: 52,
    rol: "Arquero",
    stat_tecnica: 5.0,
    stat_fisico: 5.0,
    stat_tactica: 5.0,
    stat_mental: 5.0,
    promedio_general: 5.0,
    fortaleza: "Tiros lejanos arriba",
    debilidad: "Tiros puntines a los pies",
  },
  {
    id: "p2",
    nombre: "Dani",
    apodo: "Dani",
    edad: 55,
    rol: "Arquero",
    stat_tecnica: 5.0,
    stat_fisico: 5.0,
    stat_tactica: 5.0,
    stat_mental: 5.0,
    promedio_general: 5.0,
    fortaleza: "Achique a los pies del pateador",
    debilidad: "Tiros lejanos potentes",
  },
  {
    id: "p3",
    nombre: "Leo",
    apodo: "Leo",
    edad: 50,
    rol: "Arquero",
    stat_tecnica: 5.0,
    stat_fisico: 5.0,
    stat_tactica: 5.0,
    stat_mental: 5.0,
    promedio_general: 5.0,
    fortaleza: "Equilibrado",
    debilidad:
      "Ego grande, le gusta tirar pelotazos que salen mal y perjudican al equipo",
  },
  {
    id: "p4",
    nombre: "Pipo",
    apodo: "Pipo",
    edad: 18,
    rol: "Defensor",
    stat_tecnica: 4.7,
    stat_fisico: 4.0,
    stat_tactica: 3.3,
    stat_mental: 3.8,
    promedio_general: 4.0,
    fortaleza: "Tiros lejanos",
    debilidad: "Estado fisico",
  },
  {
    id: "p5",
    nombre: "Fefe",
    apodo: "Fefe",
    edad: 14,
    rol: "Defensor",
    stat_tecnica: 3.0,
    stat_fisico: 4.2,
    stat_tactica: 4.0,
    stat_mental: 4.8,
    promedio_general: 4.0,
    fortaleza: "Disciplina",
    debilidad: "Falta de fuerza",
  },
  {
    id: "p6",
    nombre: "Maxi",
    apodo: "Maxi",
    edad: 38,
    rol: "Defensor",
    stat_tecnica: 4.0,
    stat_fisico: 6.0,
    stat_tactica: 3.3,
    stat_mental: 2.2,
    promedio_general: 3.9,
    fortaleza: "Fortaleza fisica",
    debilidad: "Desatencion / ego personal",
  },
  {
    id: "p7",
    nombre: "Ariel",
    apodo: "Ariel",
    edad: 55,
    rol: "Defensor",
    stat_tecnica: 4.8,
    stat_fisico: 4.2,
    stat_tactica: 5.0,
    stat_mental: 7.8,
    promedio_general: 5.4,
    fortaleza: "Orden",
    debilidad: "Edad",
  },
  {
    id: "p8",
    nombre: "Kaiser",
    apodo: "Kaiser",
    edad: 35,
    rol: "Defensor",
    stat_tecnica: 7.3,
    stat_fisico: 5.5,
    stat_tactica: 7.7,
    stat_mental: 7.2,
    promedio_general: 6.9,
    fortaleza: "Calidad",
    debilidad: "Fisico",
  },
  {
    id: "p9",
    nombre: "Jorobado",
    apodo: "Jorobado",
    edad: 30,
    rol: "Defensor",
    stat_tecnica: 5.3,
    stat_fisico: 6.8,
    stat_tactica: 5.3,
    stat_mental: 5.2,
    promedio_general: 5.6,
    fortaleza: "Estado fisico",
    debilidad: "Desorden",
  },
  {
    id: "p10",
    nombre: "Rulo",
    apodo: "Rulo",
    edad: 28,
    rol: "Defensor",
    stat_tecnica: 6.8,
    stat_fisico: 7.2,
    stat_tactica: 7.3,
    stat_mental: 8.2,
    promedio_general: 7.4,
    fortaleza: "Completo como Mediocampista y Defensor",
    debilidad: "Potencia Ofensiva",
  },
  {
    id: "p11",
    nombre: "Vago",
    apodo: "Vago",
    edad: 26,
    rol: "Defensor",
    stat_tecnica: 5.7,
    stat_fisico: 6.8,
    stat_tactica: 5.3,
    stat_mental: 5.2,
    promedio_general: 5.8,
    fortaleza: "Despliegue fisico",
    debilidad: "Desorden",
  },
  {
    id: "p12",
    nombre: "Gianni",
    apodo: "Gianni",
    edad: 26,
    rol: "Defensor",
    stat_tecnica: 8.3,
    stat_fisico: 8.5,
    stat_tactica: 8.7,
    stat_mental: 8.5,
    promedio_general: 8.5,
    fortaleza: "Box to box",
    debilidad: "Resolucion en espacios reducidos",
  },
  {
    id: "p13",
    nombre: "Tincho M.",
    apodo: "Tincho M.",
    edad: 31,
    rol: "Defensor",
    stat_tecnica: 8.2,
    stat_fisico: 8.5,
    stat_tactica: 8.7,
    stat_mental: 9.5,
    promedio_general: 8.7,
    fortaleza: "Completo",
    debilidad: "Resolucion en espacios reducidos",
  },
  {
    id: "p14",
    nombre: "Mati M.",
    apodo: "Mati M.",
    edad: 28,
    rol: "Defensor",
    stat_tecnica: 7.7,
    stat_fisico: 9.0,
    stat_tactica: 7.3,
    stat_mental: 7.5,
    promedio_general: 7.9,
    fortaleza: "Despliegue en toda la cancha",
    debilidad: "Falta de concentracion y exceso de bondad",
  },
  {
    id: "p15",
    nombre: "Nico",
    apodo: "Nico",
    edad: 32,
    rol: "Medio",
    stat_tecnica: 8.7,
    stat_fisico: 7.2,
    stat_tactica: 9.0,
    stat_mental: 8.8,
    promedio_general: 8.4,
    fortaleza: "Conductor",
    debilidad: "Fisico",
  },
];

// Mock Matches - Historical data
export const mockMatches: Match[] = [
  {
    id: "m1",
    fecha: "2026-01-15",
    diferencia_goles: 2,
    equipo_ganador: "A",
  },
  {
    id: "m2",
    fecha: "2026-01-22",
    diferencia_goles: 1,
    equipo_ganador: "B",
  },
  {
    id: "m3",
    fecha: "2026-01-29",
    diferencia_goles: 0,
    equipo_ganador: "Empate",
  },
];
