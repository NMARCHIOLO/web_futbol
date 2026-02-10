const handleMatchSaved = async (winner: "A" | "B" | "Empate", goalDiff: number) => {
    try {
      // Creamos el objeto partido con los IDs de los jugadores
      const newMatch: Match = {
        fecha: new Date().toISOString(),
        equipo_ganador: winner,
        diferencia_goles: goalDiff,
        team_a_ids: teamA.map((p) => p.id),
        team_b_ids: teamB.map((p) => p.id),
      };

      // Guardamos en Supabase
      await saveMatch(newMatch);

      // Éxito
      setMode("saved");
    } catch (error) {
      alert("Error al guardar el partido. Revisa que tengas internet.");
    }
  };
