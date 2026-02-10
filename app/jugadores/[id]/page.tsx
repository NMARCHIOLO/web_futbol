"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { BottomNav } from "@/components/bottom-nav";
import { PlayerCard } from "@/components/player-card";
import {
  getPlayers,
  calculatePlayerStats,
  getIdealPartner,
  getNemesis,
  type PlayerStats,
  type PartnerInsight,
  type RivalInsight,
} from "@/lib/store";
import { type Player, getRoleColor } from "@/lib/data";
import { ArrowLeft, Heart, Skull, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PlayerProfilePage() {
  const router = useRouter();
  const params = useParams();
  const [player, setPlayer] = useState<Player | null>(null);
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [partner, setPartner] = useState<PartnerInsight | null>(null);
  const [nemesis, setNemesis] = useState<RivalInsight | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const playerId = params.id as string;
    const players = getPlayers();
    const found = players.find((p) => p.id === playerId);
    setPlayer(found || null);

    if (found) {
      const allStats = calculatePlayerStats();
      const playerStats = allStats.find((s) => s.player.id === playerId);
      setStats(playerStats || null);
      setPartner(getIdealPartner(playerId));
      setNemesis(getNemesis(playerId));
    }
  }, [params.id]);

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!player) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
        <p className="text-muted-foreground">Jugador no encontrado</p>
        <Button variant="outline" onClick={() => router.push("/jugadores")}>
          Volver al plantel
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background pb-24">
      {/* Custom Header with back button */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-lg safe-area-pt">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary transition-colors hover:bg-secondary/80"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div className="flex flex-1 flex-col">
            <h1 className="text-lg font-bold tracking-tight text-foreground">
              {player.apodo}
            </h1>
            <p className="text-xs text-muted-foreground">
              {player.rol} - {player.edad} anos
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10"
            onClick={() => router.push(`/jugadores/${player.id}/editar`)}
          >
            <Edit className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-6 px-4 py-4">
        {/* Player Card */}
        <PlayerCard player={player} stats={stats || undefined} />

        {/* Chemistry Section */}
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Quimica
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {/* Ideal Partner */}
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10">
                  <Heart className="h-5 w-5 text-success" />
                </div>
                <div className="flex flex-1 flex-col">
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Socio Ideal
                  </span>
                  {partner ? (
                    <>
                      <span className="font-semibold text-foreground">
                        {partner.partner.apodo}
                      </span>
                      <span className="text-xs text-success">
                        {partner.win_rate.toFixed(0)}% de victorias juntos (
                        {partner.wins_together}/{partner.matches_together}{" "}
                        partidos)
                      </span>
                    </>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      Faltan datos (min. 1 partido juntos)
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Nemesis */}
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10">
                  <Skull className="h-5 w-5 text-destructive" />
                </div>
                <div className="flex flex-1 flex-col">
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Bestia Negra
                  </span>
                  {nemesis ? (
                    <>
                      <span className="font-semibold text-foreground">
                        {nemesis.rival.apodo}
                      </span>
                      <span className="text-xs text-destructive">
                        {nemesis.loss_rate.toFixed(0)}% de derrotas contra (
                        {nemesis.losses_against}/{nemesis.matches_against}{" "}
                        partidos)
                      </span>
                    </>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      Faltan datos (min. 1 partido enfrentados)
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
