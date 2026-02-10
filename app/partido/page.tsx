"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { BottomNav } from "@/components/bottom-nav";
import { TeamBuilder } from "@/components/team-builder";
import { MatchResult } from "@/components/match-result";
import { QuickMatchForm } from "@/components/quick-match-form";
import {
  getPlayers,
  saveMatch,
  saveParticipations,
} from "@/lib/store";
import { type Player, type Match, type Participation } from "@/lib/data";
import { Sparkles, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

type PageMode = "choose" | "builder" | "result" | "quick" | "saved";

export default function PartidoPage() {
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>([]);
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<PageMode>("choose");
  const [teamA, setTeamA] = useState<Player[]>([]);
  const [teamB, setTeamB] = useState<Player[]>([]);

  useEffect(() => {
    setMounted(true);
    setPlayers(getPlayers());
  }, []);

  const handleTeamsConfirmed = (a: Player[], b: Player[]) => {
    setTeamA(a);
    setTeamB(b);
    setMode("result");
  };

  const handleMatchSaved = (winner: "A" | "B" | "Empate", goalDiff: number) => {
    const matchId = `m${Date.now()}`;
    const today = new Date().toISOString().split("T")[0];

    const newMatch: Match = {
      id: matchId,
      fecha: today,
      diferencia_goles: goalDiff,
      equipo_ganador: winner,
    };

    const participations: Participation[] = [
      ...teamA.map((p) => ({
        partido_id: matchId,
        jugador_id: p.id,
        equipo: "A" as const,
      })),
      ...teamB.map((p) => ({
        partido_id: matchId,
        jugador_id: p.id,
        equipo: "B" as const,
      })),
    ];

    saveMatch(newMatch);
    saveParticipations(participations);

    setMode("saved");
  };

  const handleQuickMatchSaved = (
    match: Match,
    participations: Participation[]
  ) => {
    saveMatch(match);
    saveParticipations(participations);
    setMode("saved");
  };

  const handleReset = () => {
    setMode("choose");
    setTeamA([]);
    setTeamB([]);
  };

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const getTitle = () => {
    switch (mode) {
      case "choose":
        return "Nuevo Partido";
      case "builder":
        return "DT Inteligente";
      case "result":
        return "Match Day";
      case "quick":
        return "Cargar Resultado";
      case "saved":
        return "Partido Guardado";
    }
  };

  const getSubtitle = () => {
    switch (mode) {
      case "choose":
        return "Elige como cargar el partido";
      case "builder":
        return "Arma los equipos para hoy";
      case "result":
        return "Registra el resultado";
      case "quick":
        return "Carga un partido jugado";
      case "saved":
        return "Estadisticas actualizadas";
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background pb-24">
      <AppHeader title={getTitle()} subtitle={getSubtitle()} />

      <main className="flex flex-1 flex-col gap-6 px-4 py-4">
        {/* Mode Selection */}
        {mode === "choose" && (
          <div className="flex flex-1 flex-col gap-4">
            <p className="text-center text-sm text-muted-foreground">
              Selecciona una opcion para continuar
            </p>

            {/* Option 1: DT Inteligente */}
            <button
              type="button"
              onClick={() => setMode("builder")}
              className={cn(
                "flex flex-col gap-3 rounded-2xl border border-primary/50 bg-card p-6 text-left transition-all",
                "hover:border-primary hover:bg-primary/5"
              )}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/20">
                <Sparkles className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  DT Inteligente
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Selecciona quienes vinieron y el algoritmo arma equipos
                  parejos. Ideal para armar el partido antes de jugar.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-medium text-primary">
                  Balance automatico
                </span>
                <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-medium text-primary">
                  Por posiciones
                </span>
                <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-medium text-primary">
                  Ajuste manual
                </span>
              </div>
            </button>

            {/* Option 2: Quick Match */}
            <button
              type="button"
              onClick={() => setMode("quick")}
              className={cn(
                "flex flex-col gap-3 rounded-2xl border border-accent/50 bg-card p-6 text-left transition-all",
                "hover:border-accent hover:bg-accent/5"
              )}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent/20">
                <ClipboardList className="h-7 w-7 text-accent" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  Cargar Resultado
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Ya jugaron? Carga directamente los equipos y el resultado del
                  partido para actualizar las estadisticas.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-accent/10 px-2 py-1 text-[10px] font-medium text-accent">
                  Carga rapida
                </span>
                <span className="rounded-full bg-accent/10 px-2 py-1 text-[10px] font-medium text-accent">
                  Partidos pasados
                </span>
                <span className="rounded-full bg-accent/10 px-2 py-1 text-[10px] font-medium text-accent">
                  100% manual
                </span>
              </div>
            </button>
          </div>
        )}

        {/* Team Builder Mode */}
        {mode === "builder" && (
          <TeamBuilder
            players={players}
            onTeamsConfirmed={handleTeamsConfirmed}
          />
        )}

        {/* Match Result Mode (after team builder) */}
        {mode === "result" && (
          <MatchResult
            teamA={teamA}
            teamB={teamB}
            onSave={handleMatchSaved}
            onBack={() => setMode("builder")}
          />
        )}

        {/* Quick Match Mode */}
        {mode === "quick" && (
          <QuickMatchForm
            players={players}
            onSave={handleQuickMatchSaved}
            onCancel={() => setMode("choose")}
          />
        )}

        {/* Saved Confirmation */}
        {mode === "saved" && (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/20">
              <svg
                className="h-10 w-10 text-success"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Partido Guardado
              </h2>
              <p className="mt-2 text-muted-foreground">
                Las estadisticas de todos los jugadores fueron actualizadas
              </p>
            </div>
            <div className="flex w-full flex-col gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="h-14 rounded-xl bg-primary font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Cargar Otro Partido
              </button>
              <button
                type="button"
                onClick={() => router.push("/")}
                className="h-14 rounded-xl border border-border font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                Ver Tabla de Posiciones
              </button>
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
