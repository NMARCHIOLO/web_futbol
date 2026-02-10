export interface Player {
  id: string; // Ya no es opcional, Supabase siempre nos da un ID
  name: string;
  role: string;
  age: number;
  
  // TÉCNICA
  tech_control: number;
  tech_short_pass: number;
  tech_long_pass: number;
  tech_dribbling: number;
  tech_shooting: number;
  tech_tackle: number;

  // FÍSICO
  phys_speed: number;
  phys_stamina: number;
  phys_strength: number;
  phys_power: number;

  // TÁCTICA
  tact_defense: number;
  tact_attack: number;
  tact_versatility: number;

  // MENTALES
  ment_concentration: number;
  ment_teamwork: number;
  ment_discipline: number;
  ment_leadership: number;

  // ARQUEROS
  gk_hands?: number;
  gk_feet?: number;
  gk_positioning?: number;
  gk_reflexes?: number;

  strength_main?: string;
  weakness_main?: string;
}

export interface Match {
  id?: string;
  fecha: string;
  equipo_ganador: "A" | "B" | "Empate";
  diferencia_goles: number;
  team_a_ids: string[];
  team_b_ids: string[];
}

// Helper para calcular promedio general (usado en tu TeamBuilder)
export function getPlayerAverage(p: Player): number {
  if (p.role === "Arquero") {
    // Promedio simple de stats de arquero
    const stats = [p.gk_hands, p.gk_feet, p.gk_positioning, p.gk_reflexes].filter(n => n !== undefined) as number[];
    if (stats.length === 0) return 5;
    return stats.reduce((a, b) => a + b, 0) / stats.length;
  }
  
  // Promedio para jugadores de campo (Técnica + Físico + Táctica + Mental)
  // Ajusta estos campos según lo que quieras ponderar más
  const stats = [
    p.tech_control, p.tech_short_pass, p.tech_shooting, p.tech_tackle,
    p.phys_speed, p.phys_stamina, p.phys_power,
    p.tact_defense, p.tact_attack, p.ment_teamwork
  ];
  return stats.reduce((a, b) => a + b, 0) / stats.length;
}
