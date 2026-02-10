import { supabase } from './supabase';
import { Player, Match } from './data';

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
    .order('fecha', { ascending: false }); // Los más nuevos primero

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
