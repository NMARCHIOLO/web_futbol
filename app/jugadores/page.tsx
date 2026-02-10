"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { BottomNav } from "@/components/bottom-nav";
import { getPlayers } from "@/lib/store";
import {
  type Player,
  getPlayerAverage,
  getRoleColor,
  getRoleLabel,
} from "@/lib/data";
import { ChevronRight, Plus, Goal, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function JugadoresPage() {
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>([]);
  const [mounted, setMounted] = useState(false);
  const [filterRol, setFilterRol] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    setPlayers(getPlayers());
  }, []);

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  // Filter and sort by average rating
  const filteredPlayers = filterRol
    ? players.filter((p) => p.rol === filterRol)
    : players;

  const sortedPlayers = [...filteredPlayers].sort(
    (a, b) => getPlayerAverage(b) - getPlayerAverage(a)
  );

  // Count by role
  const arqueros = players.filter((p) => p.rol === "Arquero").length;
  const defensores = players.filter((p) => p.rol === "Defensor").length;
  const medios = players.filter((p) => p.rol === "Medio").length;
  const delanteros = players.filter((p) => p.rol === "Delantero").length;

  return (
    <div className="flex min-h-screen flex-col bg-background pb-24">
      <AppHeader title="Plantel" subtitle={`${players.length} jugadores`} />

      <main className="flex flex-1 flex-col gap-4 px-4 py-4">
        {/* Role Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setFilterRol(null)}
            className={cn(
              "flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              filterRol === null
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground"
            )}
          >
            Todos ({players.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterRol("Arquero")}
            className={cn(
              "flex flex-shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              filterRol === "Arquero"
                ? "bg-amber-500/20 text-amber-400"
                : "bg-secondary text-muted-foreground"
            )}
          >
            <Goal className="h-3 w-3" />
            Arqueros ({arqueros})
          </button>
          <button
            type="button"
            onClick={() => setFilterRol("Defensor")}
            className={cn(
              "flex flex-shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              filterRol === "Defensor"
                ? "bg-blue-500/20 text-blue-400"
                : "bg-secondary text-muted-foreground"
            )}
          >
            <Shield className="h-3 w-3" />
            Defensores ({defensores})
          </button>
          <button
            type="button"
            onClick={() => setFilterRol("Medio")}
            className={cn(
              "flex flex-shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              filterRol === "Medio"
                ? "bg-emerald-500/20 text-emerald-400"
                : "bg-secondary text-muted-foreground"
            )}
          >
            <Users className="h-3 w-3" />
            Medios ({medios})
          </button>
          {delanteros > 0 && (
            <button
              type="button"
              onClick={() => setFilterRol("Delantero")}
              className={cn(
                "flex flex-shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                filterRol === "Delantero"
                  ? "bg-red-500/20 text-red-400"
                  : "bg-secondary text-muted-foreground"
              )}
            >
              Delanteros ({delanteros})
            </button>
          )}
        </div>

        {/* Add Player Button */}
        <Button
          variant="outline"
          className="flex h-14 items-center justify-center gap-2 border-dashed border-primary/50 bg-transparent text-primary hover:bg-primary/10"
          onClick={() => router.push("/jugadores/nuevo")}
        >
          <Plus className="h-5 w-5" />
          <span>Agregar Jugador</span>
        </Button>

        {/* Players List */}
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          {sortedPlayers.map((player, index) => (
            <button
              key={player.id}
              type="button"
              onClick={() => router.push(`/jugadores/${player.id}`)}
              className={cn(
                "flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-secondary/30 active:bg-secondary/50",
                index !== sortedPlayers.length - 1 && "border-b border-border"
              )}
            >
              {/* Rating Badge */}
              <div className="flex h-12 w-12 flex-shrink-0 flex-col items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/30">
                <span className="text-lg font-bold text-primary">
                  {getPlayerAverage(player).toFixed(1)}
                </span>
              </div>

              {/* Player Info */}
              <div className="flex flex-1 flex-col gap-1 overflow-hidden">
                <div className="flex items-center gap-2">
                  <span className="truncate font-semibold text-foreground">
                    {player.apodo}
                  </span>
                  <span
                    className={cn(
                      "rounded border px-1.5 py-0.5 text-[9px] font-bold",
                      getRoleColor(player.rol)
                    )}
                  >
                    {getRoleLabel(player.rol)}
                  </span>
                </div>
                <span className="truncate text-xs text-muted-foreground">
                  {player.nombre} - {player.edad} anos
                </span>
                {/* Mini stats */}
                <div className="flex gap-2 text-[10px]">
                  <span className="text-muted-foreground">
                    TEC: <span className="text-primary">{player.stat_tecnica}</span>
                  </span>
                  <span className="text-muted-foreground">
                    FIS: <span className="text-accent">{player.stat_fisico}</span>
                  </span>
                  <span className="text-muted-foreground">
                    TAC: <span className="text-warning">{player.stat_tactica}</span>
                  </span>
                  <span className="text-muted-foreground">
                    MEN: <span className="text-emerald-400">{player.stat_mental}</span>
                  </span>
                </div>
              </div>

              <ChevronRight className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
            </button>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
