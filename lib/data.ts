export interface Player {
  id?: string;
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
  date: string;
  team_a_score: number;
  team_b_score: number;
  winner: "A" | "B" | "Empate";
}
