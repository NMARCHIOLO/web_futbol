"use client";

import { useState } from "react";
import {
  type Player,
  type Match,
  type Participation,
  getPlayerAverage,
  getRoleColor,
  getRoleLabel,
} from "@/lib/data";
import { cn } from "@/lib/utils";
import {
  Save,
  X,
  Minus,
  Plus,
  ChevronDown,
  Check,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuickMatchFormProps {
  players: Player[];
  onSave: (match: Match, participations: Participation[]) => void;
  onCancel: () => void;
}

type WinnerType = "A" | "B" | "Empate" | null;

export function QuickMatchForm({
  players,
  onSave,
  onCancel,
}: QuickMatchFormProps) {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [teamA, setTeamA] = useState<string[]>([]);
  const [teamB, setTeamB] = useState<string[]>([]);
  const [winner, setWinner] = useState<WinnerType>(null);
  const [goalDiff, setGoalDiff] = useState(1);
  const [showTeamASelector, setShowTeamASelector] = useState(false);
  const [showTeamBSelector, setShowTeamBSelector] = useState(false);

  const togglePlayerInTeam = (
    playerId: string,
    team: "A" | "B"
  ) => {
    if (team === "A") {
      // Remove from team B if present
      setTeamB((prev) => prev.filter((id) => id !== playerId));
      // Toggle in team A
      setTeamA((prev) =>
        prev.includes(playerId)
          ? prev.filter((id) => id !== playerId)
          : [...prev, playerId]
      );
    } else {
      // Remove from team A if present
      setTeamA((prev) => prev.filter((id) => id !== playerId));
      // Toggle in team B
      setTeamB((prev) =>
        prev.includes(playerId)
          ? prev.filter((id) => id !== playerId)
          : [...prev, playerId]
      );
    }
  };

  const handleSave = () => {
    if (teamA.length === 0 || teamB.length === 0 || !winner) return;

    const matchId = `m${Date.now()}`;

    const match: Match = {
      id: matchId,
      fecha: date,
      diferencia_goles: winner === "Empate" ? 0 : goalDiff,
      equipo_ganador: winner,
    };

    const participations: Participation[] = [
      ...teamA.map((jugador_id) => ({
        partido_id: matchId,
        jugador_id,
        equipo: "A" as const,
      })),
      ...teamB.map((jugador_id) => ({
        partido_id: matchId,
        jugador_id,
        equipo: "B" as const,
      })),
    ];

    onSave(match, participations);
  };

  const getPlayerById = (id: string) => players.find((p) => p.id === id);

  const teamAPlayers = teamA.map(getPlayerById).filter(Boolean) as Player[];
  const teamBPlayers = teamB.map(getPlayerById).filter(Boolean) as Player[];

  const avgA =
    teamAPlayers.length > 0
      ? teamAPlayers.reduce((sum, p) => sum + getPlayerAverage(p), 0) /
        teamAPlayers.length
      : 0;
  const avgB =
    teamBPlayers.length > 0
      ? teamBPlayers.reduce((sum, p) => sum + getPlayerAverage(p), 0) /
        teamBPlayers.length
      : 0;

  const canSave = teamA.length > 0 && teamB.length > 0 && winner !== null;

  // Available players (not in any team)
  const availableForA = players.filter((p) => !teamB.includes(p.id));
  const availableForB = players.filter((p) => !teamA.includes(p.id));

  return (
    <div className="flex flex-col gap-6">
      {/* Date */}
      <div className="rounded-xl border border-border bg-card p-4">
        <label className="mb-2 block text-sm font-medium text-muted-foreground">
          Fecha del partido
        </label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="h-12 w-full rounded-lg border border-border bg-input pl-10 pr-4 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Teams */}
      <div className="grid grid-cols-2 gap-3">
        {/* Team A Selector */}
        <div className="rounded-xl border border-primary/50 bg-card">
          <button
            type="button"
            onClick={() => {
              setShowTeamASelector(!showTeamASelector);
              setShowTeamBSelector(false);
            }}
            className="flex w-full items-center justify-between border-b border-border bg-primary/10 px-3 py-2"
          >
            <div>
              <span className="block text-sm font-bold text-primary">
                Equipo A
              </span>
              <span className="text-[10px] text-muted-foreground">
                {teamA.length} jugadores
                {avgA > 0 && ` - Prom: ${avgA.toFixed(1)}`}
              </span>
            </div>
            <ChevronDown
              className={cn(
                "h-5 w-5 text-primary transition-transform",
                showTeamASelector && "rotate-180"
              )}
            />
          </button>

          {/* Selected players */}
          <div className="max-h-32 divide-y divide-border overflow-y-auto">
            {teamAPlayers.length === 0 ? (
              <div className="p-3 text-center text-xs text-muted-foreground">
                Toca para agregar
              </div>
            ) : (
              teamAPlayers.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between px-2 py-1.5"
                >
                  <div className="flex items-center gap-1.5 overflow-hidden">
                    <span
                      className={cn(
                        "rounded px-1 py-0.5 text-[8px] font-bold",
                        getRoleColor(player.rol)
                      )}
                    >
                      {getRoleLabel(player.rol)}
                    </span>
                    <span className="truncate text-xs font-medium text-foreground">
                      {player.apodo}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => togglePlayerInTeam(player.id, "A")}
                    className="flex h-5 w-5 items-center justify-center rounded bg-destructive/20 text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Dropdown selector */}
          {showTeamASelector && (
            <div className="max-h-48 divide-y divide-border overflow-y-auto border-t border-border bg-secondary/30">
              {availableForA
                .sort((a, b) => getPlayerAverage(b) - getPlayerAverage(a))
                .map((player) => {
                  const isSelected = teamA.includes(player.id);
                  return (
                    <button
                      key={player.id}
                      type="button"
                      onClick={() => togglePlayerInTeam(player.id, "A")}
                      className={cn(
                        "flex w-full items-center justify-between px-2 py-2 text-left",
                        isSelected
                          ? "bg-primary/20"
                          : "hover:bg-secondary/50"
                      )}
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <span
                          className={cn(
                            "rounded px-1 py-0.5 text-[8px] font-bold",
                            getRoleColor(player.rol)
                          )}
                        >
                          {getRoleLabel(player.rol)}
                        </span>
                        <span className="truncate text-xs font-medium text-foreground">
                          {player.apodo}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {getPlayerAverage(player).toFixed(1)}
                        </span>
                      </div>
                      {isSelected && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </button>
                  );
                })}
            </div>
          )}
        </div>

        {/* Team B Selector */}
        <div className="rounded-xl border border-accent/50 bg-card">
          <button
            type="button"
            onClick={() => {
              setShowTeamBSelector(!showTeamBSelector);
              setShowTeamASelector(false);
            }}
            className="flex w-full items-center justify-between border-b border-border bg-accent/10 px-3 py-2"
          >
            <div>
              <span className="block text-sm font-bold text-accent">
                Equipo B
              </span>
              <span className="text-[10px] text-muted-foreground">
                {teamB.length} jugadores
                {avgB > 0 && ` - Prom: ${avgB.toFixed(1)}`}
              </span>
            </div>
            <ChevronDown
              className={cn(
                "h-5 w-5 text-accent transition-transform",
                showTeamBSelector && "rotate-180"
              )}
            />
          </button>

          {/* Selected players */}
          <div className="max-h-32 divide-y divide-border overflow-y-auto">
            {teamBPlayers.length === 0 ? (
              <div className="p-3 text-center text-xs text-muted-foreground">
                Toca para agregar
              </div>
            ) : (
              teamBPlayers.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between px-2 py-1.5"
                >
                  <button
                    type="button"
                    onClick={() => togglePlayerInTeam(player.id, "B")}
                    className="flex h-5 w-5 items-center justify-center rounded bg-destructive/20 text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <div className="flex items-center gap-1.5 overflow-hidden">
                    <span className="truncate text-xs font-medium text-foreground">
                      {player.apodo}
                    </span>
                    <span
                      className={cn(
                        "rounded px-1 py-0.5 text-[8px] font-bold",
                        getRoleColor(player.rol)
                      )}
                    >
                      {getRoleLabel(player.rol)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Dropdown selector */}
          {showTeamBSelector && (
            <div className="max-h-48 divide-y divide-border overflow-y-auto border-t border-border bg-secondary/30">
              {availableForB
                .sort((a, b) => getPlayerAverage(b) - getPlayerAverage(a))
                .map((player) => {
                  const isSelected = teamB.includes(player.id);
                  return (
                    <button
                      key={player.id}
                      type="button"
                      onClick={() => togglePlayerInTeam(player.id, "B")}
                      className={cn(
                        "flex w-full items-center justify-between px-2 py-2 text-left",
                        isSelected
                          ? "bg-accent/20"
                          : "hover:bg-secondary/50"
                      )}
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <span
                          className={cn(
                            "rounded px-1 py-0.5 text-[8px] font-bold",
                            getRoleColor(player.rol)
                          )}
                        >
                          {getRoleLabel(player.rol)}
                        </span>
                        <span className="truncate text-xs font-medium text-foreground">
                          {player.apodo}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {getPlayerAverage(player).toFixed(1)}
                        </span>
                      </div>
                      {isSelected && (
                        <Check className="h-4 w-4 text-accent" />
                      )}
                    </button>
                  );
                })}
            </div>
          )}
        </div>
      </div>

      {/* Winner Selection */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Resultado
        </h3>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setWinner("A")}
            className={cn(
              "flex h-16 flex-col items-center justify-center gap-1 rounded-xl border transition-all",
              winner === "A"
                ? "border-success bg-success/20 text-success"
                : "border-border bg-secondary/30 text-muted-foreground hover:bg-secondary/50"
            )}
          >
            <span className="text-lg font-bold">A</span>
            <span className="text-[10px] uppercase">Gano</span>
          </button>
          <button
            type="button"
            onClick={() => setWinner("Empate")}
            className={cn(
              "flex h-16 flex-col items-center justify-center gap-1 rounded-xl border transition-all",
              winner === "Empate"
                ? "border-warning bg-warning/20 text-warning"
                : "border-border bg-secondary/30 text-muted-foreground hover:bg-secondary/50"
            )}
          >
            <span className="text-lg font-bold">=</span>
            <span className="text-[10px] uppercase">Empate</span>
          </button>
          <button
            type="button"
            onClick={() => setWinner("B")}
            className={cn(
              "flex h-16 flex-col items-center justify-center gap-1 rounded-xl border transition-all",
              winner === "B"
                ? "border-success bg-success/20 text-success"
                : "border-border bg-secondary/30 text-muted-foreground hover:bg-secondary/50"
            )}
          >
            <span className="text-lg font-bold">B</span>
            <span className="text-[10px] uppercase">Gano</span>
          </button>
        </div>
      </div>

      {/* Goal Difference */}
      {winner && winner !== "Empate" && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Diferencia de Goles
          </h3>
          <div className="flex items-center justify-center gap-4 rounded-xl border border-border bg-card p-4">
            <button
              type="button"
              onClick={() => setGoalDiff(Math.max(1, goalDiff - 1))}
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-foreground transition-colors hover:bg-secondary/80 active:scale-95"
            >
              <Minus className="h-6 w-6" />
            </button>
            <span className="w-16 text-center text-4xl font-black text-primary">
              {goalDiff}
            </span>
            <button
              type="button"
              onClick={() => setGoalDiff(goalDiff + 1)}
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-foreground transition-colors hover:bg-secondary/80 active:scale-95"
            >
              <Plus className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          size="lg"
          className="h-14 flex-1 bg-transparent"
          onClick={onCancel}
        >
          <X className="mr-2 h-5 w-5" />
          Cancelar
        </Button>
        <Button
          size="lg"
          className="h-14 flex-1"
          onClick={handleSave}
          disabled={!canSave}
        >
          <Save className="mr-2 h-5 w-5" />
          Guardar
        </Button>
      </div>
    </div>
  );
}
