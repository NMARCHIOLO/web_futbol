"use client";

import React from "react"

import { useState } from "react";
import {
  type Player,
  getPlayerAverage,
  getRoleColor,
  getRoleLabel,
} from "@/lib/data";
import { balanceTeamsByPosition, type TeamBalanceResult } from "@/lib/store";
import { cn } from "@/lib/utils";
import {
  Wand2,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Check,
  AlertTriangle,
  Shield,
  Goal,
  Users,
  Hand,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface TeamBuilderProps {
  players: Player[];
  onTeamsConfirmed: (teamA: Player[], teamB: Player[]) => void;
}

type BuildMode = "select" | "auto-balance" | "manual-assign";

export function TeamBuilder({ players, onTeamsConfirmed }: TeamBuilderProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [balanceResult, setBalanceResult] = useState<TeamBalanceResult | null>(
    null
  );
  const [mode, setMode] = useState<BuildMode>("select");

  // Manual mode state
  const [manualTeamA, setManualTeamA] = useState<Player[]>([]);
  const [manualTeamB, setManualTeamB] = useState<Player[]>([]);
  const [unassigned, setUnassigned] = useState<Player[]>([]);

  const togglePlayer = (playerId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(playerId)) {
        next.delete(playerId);
      } else {
        next.add(playerId);
      }
      return next;
    });
    setBalanceResult(null);
  };

  const handleAutoBalance = () => {
    const selected = players.filter((p) => selectedIds.has(p.id));
    if (selected.length >= 6) {
      const result = balanceTeamsByPosition(selected);
      setBalanceResult(result);
      setMode("auto-balance");
    }
  };

  const handleManualMode = () => {
    const selected = players.filter((p) => selectedIds.has(p.id));
    setUnassigned(selected);
    setManualTeamA([]);
    setManualTeamB([]);
    setMode("manual-assign");
  };

  // Auto balance: move player between teams
  const movePlayerToTeam = (playerId: string, toTeam: "A" | "B") => {
    if (!balanceResult) return;

    const fromA = balanceResult.teamA.find((p) => p.id === playerId);
    const fromB = balanceResult.teamB.find((p) => p.id === playerId);

    if (fromA && toTeam === "B") {
      const newTeamA = balanceResult.teamA.filter((p) => p.id !== playerId);
      const newTeamB = [...balanceResult.teamB, fromA];

      const avgA =
        newTeamA.reduce((sum, p) => sum + getPlayerAverage(p), 0) /
        (newTeamA.length || 1);
      const avgB =
        newTeamB.reduce((sum, p) => sum + getPlayerAverage(p), 0) /
        newTeamB.length;

      setBalanceResult({
        ...balanceResult,
        teamA: newTeamA,
        teamB: newTeamB,
        avgA,
        avgB,
        difference: Math.abs(avgA - avgB),
      });
    } else if (fromB && toTeam === "A") {
      const newTeamB = balanceResult.teamB.filter((p) => p.id !== playerId);
      const newTeamA = [...balanceResult.teamA, fromB];

      const avgA =
        newTeamA.reduce((sum, p) => sum + getPlayerAverage(p), 0) /
        newTeamA.length;
      const avgB =
        newTeamB.reduce((sum, p) => sum + getPlayerAverage(p), 0) /
        (newTeamB.length || 1);

      setBalanceResult({
        ...balanceResult,
        teamA: newTeamA,
        teamB: newTeamB,
        avgA,
        avgB,
        difference: Math.abs(avgA - avgB),
      });
    }
  };

  // Manual mode: assign player to team
  const assignToTeam = (player: Player, team: "A" | "B") => {
    setUnassigned((prev) => prev.filter((p) => p.id !== player.id));
    if (team === "A") {
      setManualTeamA((prev) => [...prev, player]);
    } else {
      setManualTeamB((prev) => [...prev, player]);
    }
  };

  // Manual mode: remove from team back to unassigned
  const removeFromTeam = (player: Player, fromTeam: "A" | "B") => {
    if (fromTeam === "A") {
      setManualTeamA((prev) => prev.filter((p) => p.id !== player.id));
    } else {
      setManualTeamB((prev) => prev.filter((p) => p.id !== player.id));
    }
    setUnassigned((prev) => [...prev, player]);
  };

  // Manual mode: move between teams directly
  const moveManualPlayer = (player: Player, fromTeam: "A" | "B") => {
    if (fromTeam === "A") {
      setManualTeamA((prev) => prev.filter((p) => p.id !== player.id));
      setManualTeamB((prev) => [...prev, player]);
    } else {
      setManualTeamB((prev) => prev.filter((p) => p.id !== player.id));
      setManualTeamA((prev) => [...prev, player]);
    }
  };

  const resetToSelect = () => {
    setBalanceResult(null);
    setManualTeamA([]);
    setManualTeamB([]);
    setUnassigned([]);
    setMode("select");
  };

  const handleConfirm = () => {
    if (mode === "auto-balance" && balanceResult) {
      onTeamsConfirmed(balanceResult.teamA, balanceResult.teamB);
    } else if (mode === "manual-assign") {
      onTeamsConfirmed(manualTeamA, manualTeamB);
    }
  };

  // Calculate averages for manual mode
  const manualAvgA =
    manualTeamA.length > 0
      ? manualTeamA.reduce((sum, p) => sum + getPlayerAverage(p), 0) /
        manualTeamA.length
      : 0;
  const manualAvgB =
    manualTeamB.length > 0
      ? manualTeamB.reduce((sum, p) => sum + getPlayerAverage(p), 0) /
        manualTeamB.length
      : 0;
  const manualDiff = Math.abs(manualAvgA - manualAvgB);

  // Group players by role for selection
  const arqueros = players.filter((p) => p.rol === "Arquero");
  const defensores = players
    .filter((p) => p.rol === "Defensor")
    .sort((a, b) => getPlayerAverage(b) - getPlayerAverage(a));
  const medios = players
    .filter((p) => p.rol === "Medio")
    .sort((a, b) => getPlayerAverage(b) - getPlayerAverage(a));
  const delanteros = players
    .filter((p) => p.rol === "Delantero")
    .sort((a, b) => getPlayerAverage(b) - getPlayerAverage(a));

  const selectedCount = selectedIds.size;
  const selectedArqueros = arqueros.filter((p) => selectedIds.has(p.id)).length;
  const canBalance = selectedCount >= 6;

  // ===================
  // RENDER: Select Mode
  // ===================
  if (mode === "select") {
    return (
      <div className="flex flex-col gap-6">
        {/* Selection summary */}
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Selecciona quienes vinieron hoy
            </span>
            <span className="text-sm font-bold text-primary">
              {selectedCount} jugadores
            </span>
          </div>
          {selectedCount >= 6 && selectedArqueros < 2 && (
            <div className="mt-2 flex items-center gap-2 rounded-lg bg-amber-500/10 p-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <span className="text-xs text-amber-500">
                {selectedArqueros === 0
                  ? "No hay arqueros seleccionados"
                  : "Solo 1 arquero - un equipo quedara sin arco"}
              </span>
            </div>
          )}
        </div>

        {/* Players by role */}
        {arqueros.length > 0 && (
          <PlayerRoleSection
            title="Arqueros"
            players={arqueros}
            selectedIds={selectedIds}
            onToggle={togglePlayer}
            icon={<Goal className="h-4 w-4 text-amber-400" />}
            color="text-amber-400"
          />
        )}

        {defensores.length > 0 && (
          <PlayerRoleSection
            title="Defensores"
            players={defensores}
            selectedIds={selectedIds}
            onToggle={togglePlayer}
            icon={<Shield className="h-4 w-4 text-blue-400" />}
            color="text-blue-400"
          />
        )}

        {medios.length > 0 && (
          <PlayerRoleSection
            title="Mediocampistas"
            players={medios}
            selectedIds={selectedIds}
            onToggle={togglePlayer}
            icon={<Users className="h-4 w-4 text-emerald-400" />}
            color="text-emerald-400"
          />
        )}

        {delanteros.length > 0 && (
          <PlayerRoleSection
            title="Delanteros"
            players={delanteros}
            selectedIds={selectedIds}
            onToggle={togglePlayer}
            icon={<Wand2 className="h-4 w-4 text-red-400" />}
            color="text-red-400"
          />
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <Button
            size="lg"
            className="h-14 text-base font-semibold"
            onClick={handleAutoBalance}
            disabled={!canBalance}
          >
            <Sparkles className="mr-2 h-5 w-5" />
            {canBalance
              ? "Generar Equipos Parejos"
              : `Selecciona al menos 6 (faltan ${6 - selectedCount})`}
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="h-14 bg-transparent text-base font-semibold"
            onClick={handleManualMode}
            disabled={!canBalance}
          >
            <Hand className="mr-2 h-5 w-5" />
            Armar Equipos Manualmente
          </Button>
        </div>
      </div>
    );
  }

  // =======================
  // RENDER: Auto Balance Mode
  // =======================
  if (mode === "auto-balance" && balanceResult) {
    return (
      <div className="flex flex-col gap-6">
        {/* Warnings */}
        {balanceResult.warnings.length > 0 && (
          <div className="space-y-2">
            {balanceResult.warnings.map((warning, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3"
              >
                <AlertTriangle className="h-4 w-4 flex-shrink-0 text-amber-500" />
                <span className="text-sm text-amber-500">{warning}</span>
              </div>
            ))}
          </div>
        )}

        {/* Balance Info */}
        <BalanceInfo
          difference={balanceResult.difference}
          avgA={balanceResult.avgA}
          avgB={balanceResult.avgB}
        />

        {/* Teams */}
        <TeamsDisplay
          teamA={balanceResult.teamA}
          teamB={balanceResult.teamB}
          avgA={balanceResult.avgA}
          avgB={balanceResult.avgB}
          onMovePlayer={movePlayerToTeam}
        />

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="lg"
            className="h-14 flex-1 bg-transparent"
            onClick={resetToSelect}
          >
            <RotateCcw className="mr-2 h-5 w-5" />
            Volver
          </Button>
          <Button
            size="lg"
            className="h-14 flex-1"
            onClick={handleConfirm}
            disabled={
              balanceResult.teamA.length === 0 ||
              balanceResult.teamB.length === 0
            }
          >
            <Check className="mr-2 h-5 w-5" />
            Jugar
          </Button>
        </div>
      </div>
    );
  }

  // =======================
  // RENDER: Manual Assign Mode
  // =======================
  if (mode === "manual-assign") {
    return (
      <div className="flex flex-col gap-6">
        {/* Unassigned Players */}
        {unassigned.length > 0 && (
          <div className="rounded-xl border border-border bg-card">
            <div className="border-b border-border bg-secondary/50 px-3 py-2">
              <span className="text-sm font-semibold text-foreground">
                Sin asignar ({unassigned.length})
              </span>
            </div>
            <div className="max-h-48 divide-y divide-border overflow-y-auto">
              {unassigned
                .sort((a, b) => getPlayerAverage(b) - getPlayerAverage(a))
                .map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between p-2"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span
                        className={cn(
                          "rounded px-1 py-0.5 text-[9px] font-bold",
                          getRoleColor(player.rol)
                        )}
                      >
                        {getRoleLabel(player.rol)}
                      </span>
                      <span className="truncate text-sm font-medium text-foreground">
                        {player.apodo}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {getPlayerAverage(player).toFixed(1)}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => assignToTeam(player, "A")}
                        className="flex h-8 items-center gap-1 rounded-lg bg-primary/20 px-2 text-xs font-medium text-primary hover:bg-primary/30"
                      >
                        <ChevronLeft className="h-3 w-3" />A
                      </button>
                      <button
                        type="button"
                        onClick={() => assignToTeam(player, "B")}
                        className="flex h-8 items-center gap-1 rounded-lg bg-accent/20 px-2 text-xs font-medium text-accent hover:bg-accent/30"
                      >
                        B<ChevronRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Balance Info (only show when both teams have players) */}
        {manualTeamA.length > 0 && manualTeamB.length > 0 && (
          <BalanceInfo
            difference={manualDiff}
            avgA={manualAvgA}
            avgB={manualAvgB}
          />
        )}

        {/* Teams */}
        <div className="grid grid-cols-2 gap-3">
          {/* Team A */}
          <div className="rounded-xl border border-primary/50 bg-card">
            <div className="border-b border-border bg-primary/10 px-3 py-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-primary">Equipo A</span>
                {manualTeamA.length > 0 && (
                  <span className="text-xs font-medium text-primary">
                    {manualAvgA.toFixed(2)}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-muted-foreground">
                {manualTeamA.length} jugadores
              </span>
            </div>
            <div className="min-h-[120px] divide-y divide-border">
              {manualTeamA.length === 0 ? (
                <div className="flex h-[120px] items-center justify-center text-xs text-muted-foreground">
                  Asigna jugadores aqui
                </div>
              ) : (
                manualTeamA.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between p-2"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span
                        className={cn(
                          "rounded px-1 py-0.5 text-[9px] font-bold",
                          getRoleColor(player.rol)
                        )}
                      >
                        {getRoleLabel(player.rol)}
                      </span>
                      <span className="truncate text-sm font-medium text-foreground">
                        {player.apodo}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => removeFromTeam(player, "A")}
                        className="flex h-6 w-6 items-center justify-center rounded bg-destructive/20 text-destructive hover:bg-destructive/30"
                        title="Quitar"
                      >
                        <RotateCcw className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveManualPlayer(player, "A")}
                        className="flex h-6 w-6 items-center justify-center rounded-lg bg-secondary text-muted-foreground hover:bg-secondary/80"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Team B */}
          <div className="rounded-xl border border-accent/50 bg-card">
            <div className="border-b border-border bg-accent/10 px-3 py-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-accent">Equipo B</span>
                {manualTeamB.length > 0 && (
                  <span className="text-xs font-medium text-accent">
                    {manualAvgB.toFixed(2)}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-muted-foreground">
                {manualTeamB.length} jugadores
              </span>
            </div>
            <div className="min-h-[120px] divide-y divide-border">
              {manualTeamB.length === 0 ? (
                <div className="flex h-[120px] items-center justify-center text-xs text-muted-foreground">
                  Asigna jugadores aqui
                </div>
              ) : (
                manualTeamB.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between p-2"
                  >
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveManualPlayer(player, "B")}
                        className="flex h-6 w-6 items-center justify-center rounded-lg bg-secondary text-muted-foreground hover:bg-secondary/80"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFromTeam(player, "B")}
                        className="flex h-6 w-6 items-center justify-center rounded bg-destructive/20 text-destructive hover:bg-destructive/30"
                        title="Quitar"
                      >
                        <RotateCcw className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="truncate text-sm font-medium text-foreground">
                        {player.apodo}
                      </span>
                      <span
                        className={cn(
                          "rounded px-1 py-0.5 text-[9px] font-bold",
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
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="lg"
            className="h-14 flex-1 bg-transparent"
            onClick={resetToSelect}
          >
            <RotateCcw className="mr-2 h-5 w-5" />
            Volver
          </Button>
          <Button
            size="lg"
            className="h-14 flex-1"
            onClick={handleConfirm}
            disabled={manualTeamA.length === 0 || manualTeamB.length === 0}
          >
            <Check className="mr-2 h-5 w-5" />
            Jugar
          </Button>
        </div>
      </div>
    );
  }

  return null;
}

// ===================
// Sub-components
// ===================

function PlayerRoleSection({
  title,
  players,
  selectedIds,
  onToggle,
  icon,
  color,
}: {
  title: string;
  players: Player[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        {icon}
        <span className={cn("text-xs font-semibold uppercase tracking-wider", color)}>
          {title} ({players.length})
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {players.map((player) => (
          <PlayerSelectButton
            key={player.id}
            player={player}
            isSelected={selectedIds.has(player.id)}
            onClick={() => onToggle(player.id)}
          />
        ))}
      </div>
    </div>
  );
}

function PlayerSelectButton({
  player,
  isSelected,
  onClick,
}: {
  player: Player;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-xl border p-3 text-left transition-all",
        isSelected
          ? "border-primary bg-primary/10"
          : "border-border bg-secondary/30 hover:bg-secondary/50"
      )}
    >
      <div
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold",
          isSelected
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-muted-foreground"
        )}
      >
        {getPlayerAverage(player).toFixed(1)}
      </div>
      <div className="flex flex-col overflow-hidden">
        <span
          className={cn(
            "truncate text-sm font-medium",
            isSelected ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {player.apodo}
        </span>
        <span className="text-[10px] text-muted-foreground">
          {player.edad} anios
        </span>
      </div>
    </button>
  );
}

function BalanceInfo({
  difference,
  avgA,
  avgB,
}: {
  difference: number;
  avgA: number;
  avgB: number;
}) {
  return (
    <div className="rounded-xl border border-primary/50 bg-primary/10 p-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Equipo A</span>
          <span className="text-lg font-bold text-primary">{avgA.toFixed(2)}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs text-muted-foreground">Diferencia</span>
          <span
            className={cn(
              "text-xl font-bold",
              difference < 0.3
                ? "text-success"
                : difference < 0.7
                  ? "text-warning"
                  : "text-destructive"
            )}
          >
            {difference.toFixed(2)}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs text-muted-foreground">Equipo B</span>
          <span className="text-lg font-bold text-accent">{avgB.toFixed(2)}</span>
        </div>
      </div>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        {difference < 0.3
          ? "Equipos muy parejos"
          : difference < 0.7
            ? "Buen balance"
            : "Considera ajustar la distribucion"}
      </p>
    </div>
  );
}

function TeamsDisplay({
  teamA,
  teamB,
  avgA,
  avgB,
  onMovePlayer,
}: {
  teamA: Player[];
  teamB: Player[];
  avgA: number;
  avgB: number;
  onMovePlayer: (playerId: string, toTeam: "A" | "B") => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Team A */}
      <div className="rounded-xl border border-primary/50 bg-card">
        <div className="border-b border-border bg-primary/10 px-3 py-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-primary">Equipo A</span>
            <span className="text-xs font-medium text-primary">
              {avgA.toFixed(2)}
            </span>
          </div>
          <span className="text-[10px] text-muted-foreground">
            {teamA.length} jugadores
          </span>
        </div>
        <div className="divide-y divide-border">
          {teamA.map((player) => (
            <div
              key={player.id}
              className="flex items-center justify-between p-2"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <span
                  className={cn(
                    "rounded px-1 py-0.5 text-[9px] font-bold",
                    getRoleColor(player.rol)
                  )}
                >
                  {getRoleLabel(player.rol)}
                </span>
                <span className="truncate text-sm font-medium text-foreground">
                  {player.apodo}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-muted-foreground">
                  {getPlayerAverage(player).toFixed(1)}
                </span>
                <button
                  type="button"
                  onClick={() => onMovePlayer(player.id, "B")}
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary text-muted-foreground hover:bg-secondary/80"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team B */}
      <div className="rounded-xl border border-accent/50 bg-card">
        <div className="border-b border-border bg-accent/10 px-3 py-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-accent">Equipo B</span>
            <span className="text-xs font-medium text-accent">
              {avgB.toFixed(2)}
            </span>
          </div>
          <span className="text-[10px] text-muted-foreground">
            {teamB.length} jugadores
          </span>
        </div>
        <div className="divide-y divide-border">
          {teamB.map((player) => (
            <div
              key={player.id}
              className="flex items-center justify-between p-2"
            >
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onMovePlayer(player.id, "A")}
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary text-muted-foreground hover:bg-secondary/80"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-xs font-bold text-muted-foreground">
                  {getPlayerAverage(player).toFixed(1)}
                </span>
              </div>
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="truncate text-sm font-medium text-foreground">
                  {player.apodo}
                </span>
                <span
                  className={cn(
                    "rounded px-1 py-0.5 text-[9px] font-bold",
                    getRoleColor(player.rol)
                  )}
                >
                  {getRoleLabel(player.rol)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
