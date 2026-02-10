"use client";

import { useState } from "react";
import { type Player, getPlayerAverage } from "@/lib/data";
import { cn } from "@/lib/utils";
import { ArrowLeft, Save, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MatchResultProps {
  teamA: Player[];
  teamB: Player[];
  onSave: (winner: "A" | "B" | "Empate", goalDiff: number) => void;
  onBack: () => void;
}

type WinnerType = "A" | "B" | "Empate" | null;

export function MatchResult({
  teamA,
  teamB,
  onSave,
  onBack,
}: MatchResultProps) {
  const [winner, setWinner] = useState<WinnerType>(null);
  const [goalDiff, setGoalDiff] = useState(1);

  const handleSave = () => {
    if (winner) {
      onSave(winner, winner === "Empate" ? 0 : goalDiff);
    }
  };

  const avgA =
    teamA.reduce((sum, p) => sum + getPlayerAverage(p), 0) / teamA.length;
  const avgB =
    teamB.reduce((sum, p) => sum + getPlayerAverage(p), 0) / teamB.length;

  return (
    <div className="flex flex-col gap-6">
      {/* Teams Display */}
      <div className="grid grid-cols-2 gap-3">
        {/* Team A */}
        <div
          className={cn(
            "rounded-xl border bg-card transition-all",
            winner === "A"
              ? "border-success bg-success/10"
              : winner === "B"
                ? "border-destructive/50 opacity-60"
                : "border-border"
          )}
        >
          <div className="border-b border-border/50 px-3 py-2">
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  "text-sm font-bold",
                  winner === "A" ? "text-success" : "text-primary"
                )}
              >
                Equipo A
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                {avgA.toFixed(2)}
              </span>
            </div>
          </div>
          <div className="divide-y divide-border/50 px-3">
            {teamA.map((player) => (
              <div
                key={player.id}
                className="flex items-center gap-2 py-2 text-sm"
              >
                <span className="text-xs font-bold text-muted-foreground">
                  {getPlayerAverage(player).toFixed(1)}
                </span>
                <span className="truncate font-medium text-foreground">
                  {player.apodo}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Team B */}
        <div
          className={cn(
            "rounded-xl border bg-card transition-all",
            winner === "B"
              ? "border-success bg-success/10"
              : winner === "A"
                ? "border-destructive/50 opacity-60"
                : "border-border"
          )}
        >
          <div className="border-b border-border/50 px-3 py-2">
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  "text-sm font-bold",
                  winner === "B" ? "text-success" : "text-accent"
                )}
              >
                Equipo B
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                {avgB.toFixed(2)}
              </span>
            </div>
          </div>
          <div className="divide-y divide-border/50 px-3">
            {teamB.map((player) => (
              <div
                key={player.id}
                className="flex items-center gap-2 py-2 text-sm"
              >
                <span className="text-xs font-bold text-muted-foreground">
                  {getPlayerAverage(player).toFixed(1)}
                </span>
                <span className="truncate font-medium text-foreground">
                  {player.apodo}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Winner Selection */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Quien gano?
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
      </section>

      {/* Goal Difference */}
      {winner && winner !== "Empate" && (
        <section className="space-y-3">
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
        </section>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          size="lg"
          className="h-14 flex-1 bg-transparent"
          onClick={onBack}
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Volver
        </Button>
        <Button
          size="lg"
          className="h-14 flex-1"
          onClick={handleSave}
          disabled={!winner}
        >
          <Save className="mr-2 h-5 w-5" />
          Guardar
        </Button>
      </div>
    </div>
  );
}
