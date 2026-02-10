import { supabase } from './supabase';
import { Player, Match } from './data'; // Asegúrate que este nombre coincida con tu archivo de definiciones

// Obtener todos los jugadores desde Supabase
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

// Guardar un nuevo partido en Supabase
export async function saveMatch(match: Match) {
  const { error } = await supabase
    .from('matches')
    .insert([match]);

  if (error) {
    console.error('Error guardando partido:', error);
    alert('Hubo un error al guardar el partido');
  } else {
    alert('Partido guardado exitosamente');
  }
}
