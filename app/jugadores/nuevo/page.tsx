"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { savePlayer } from "@/lib/store";
import { type PlayerRole } from "@/lib/data";
import { BottomNav } from "@/components/bottom-nav";

export default function NuevoJugadorPage() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [apodo, setApodo] = useState("");
  const [edad, setEdad] = useState(25);
  const [rol, setRol] = useState<PlayerRole>("Medio");
  const [tecnica, setTecnica] = useState(5);
  const [fisico, setFisico] = useState(5);
  const [tactica, setTactica] = useState(5);
  const [mental, setMental] = useState(5);
  const [fortaleza, setFortaleza] = useState("");
  const [debilidad, setDebilidad] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    if (!nombre.trim() || !apodo.trim()) return;

    setSaving(true);
    const promedio = (tecnica + fisico + tactica + mental) / 4;

    const newPlayer = {
      id: `p${Date.now()}`,
      nombre: nombre.trim(),
      apodo: apodo.trim(),
      edad,
      rol,
      stat_tecnica: tecnica,
      stat_fisico: fisico,
      stat_tactica: tactica,
      stat_mental: mental,
      promedio_general: Number(promedio.toFixed(1)),
      fortaleza: fortaleza.trim() || "Sin definir",
      debilidad: debilidad.trim() || "Sin definir",
    };

    savePlayer(newPlayer);
    router.push("/jugadores");
  };

  const promedio = ((tecnica + fisico + tactica + mental) / 4).toFixed(1);

  return (
    <div className="flex min-h-screen flex-col bg-background pb-24">
      {/* Header */}
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
              Nuevo Jugador
            </h1>
            <p className="text-xs text-muted-foreground">
              Agrega un jugador al plantel
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary">
            {promedio}
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-6 px-4 py-6">
        {/* Basic Info */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Informacion Basica
          </h2>
          <div className="space-y-4 rounded-xl border border-border bg-card p-4">
            <div className="space-y-2">
              <Label htmlFor="nombre" className="text-foreground">
                Nombre Completo
              </Label>
              <Input
                id="nombre"
                placeholder="Ej: Martin Gonzalez"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="h-12 bg-input text-base"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="apodo" className="text-foreground">
                  Apodo
                </Label>
                <Input
                  id="apodo"
                  placeholder="Ej: Tini"
                  value={apodo}
                  onChange={(e) => setApodo(e.target.value)}
                  className="h-12 bg-input text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edad" className="text-foreground">
                  Edad
                </Label>
                <Input
                  id="edad"
                  type="number"
                  min={10}
                  max={70}
                  value={edad}
                  onChange={(e) => setEdad(Number(e.target.value))}
                  className="h-12 bg-input text-base"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Posicion Principal</Label>
              <Select
                value={rol}
                onValueChange={(v) => setRol(v as PlayerRole)}
              >
                <SelectTrigger className="h-12 bg-input text-base">
                  <SelectValue placeholder="Selecciona posicion" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Arquero">Arquero</SelectItem>
                  <SelectItem value="Defensor">Defensor</SelectItem>
                  <SelectItem value="Medio">Mediocampista</SelectItem>
                  <SelectItem value="Delantero">Delantero</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Atributos (1-10)
          </h2>
          <div className="space-y-6 rounded-xl border border-border bg-card p-4">
            {/* Tecnica */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-foreground">Tecnica</Label>
                <span className="text-lg font-bold text-primary">{tecnica}</span>
              </div>
              <Slider
                value={[tecnica]}
                onValueChange={([v]) => setTecnica(v)}
                min={1}
                max={10}
                step={0.5}
                className="[&_[role=slider]]:h-5 [&_[role=slider]]:w-5 [&_[role=slider]]:bg-primary"
              />
              <p className="text-[10px] text-muted-foreground">
                Control, pase, tiro, habilidad con el balon
              </p>
            </div>

            {/* Fisico */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-foreground">Fisico</Label>
                <span className="text-lg font-bold text-accent">{fisico}</span>
              </div>
              <Slider
                value={[fisico]}
                onValueChange={([v]) => setFisico(v)}
                min={1}
                max={10}
                step={0.5}
                className="[&_[role=slider]]:h-5 [&_[role=slider]]:w-5 [&_[role=slider]]:bg-accent"
              />
              <p className="text-[10px] text-muted-foreground">
                Velocidad, resistencia, fuerza
              </p>
            </div>

            {/* Tactica */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-foreground">Tactica</Label>
                <span className="text-lg font-bold text-warning">{tactica}</span>
              </div>
              <Slider
                value={[tactica]}
                onValueChange={([v]) => setTactica(v)}
                min={1}
                max={10}
                step={0.5}
                className="[&_[role=slider]]:h-5 [&_[role=slider]]:w-5 [&_[role=slider]]:bg-warning"
              />
              <p className="text-[10px] text-muted-foreground">
                Defensa, ataque, orden tactico
              </p>
            </div>

            {/* Mental */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-foreground">Mental</Label>
                <span className="text-lg font-bold text-emerald-400">
                  {mental}
                </span>
              </div>
              <Slider
                value={[mental]}
                onValueChange={([v]) => setMental(v)}
                min={1}
                max={10}
                step={0.5}
                className="[&_[role=slider]]:h-5 [&_[role=slider]]:w-5 [&_[role=slider]]:bg-emerald-500"
              />
              <p className="text-[10px] text-muted-foreground">
                Concentracion, trabajo en equipo
              </p>
            </div>
          </div>
        </section>

        {/* Qualitative */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Cualidades
          </h2>
          <div className="space-y-4 rounded-xl border border-border bg-card p-4">
            <div className="space-y-2">
              <Label htmlFor="fortaleza" className="text-success">
                Fortaleza Principal
              </Label>
              <Textarea
                id="fortaleza"
                placeholder="Ej: Bueno en marca, velocidad..."
                value={fortaleza}
                onChange={(e) => setFortaleza(e.target.value)}
                className="min-h-[80px] bg-input text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="debilidad" className="text-destructive">
                Debilidad Principal
              </Label>
              <Textarea
                id="debilidad"
                placeholder="Ej: Lento, egoista, falta de concentracion..."
                value={debilidad}
                onChange={(e) => setDebilidad(e.target.value)}
                className="min-h-[80px] bg-input text-base"
              />
            </div>
          </div>
        </section>

        {/* Save Button */}
        <Button
          size="lg"
          className="h-14 text-base font-semibold"
          onClick={handleSave}
          disabled={!nombre.trim() || !apodo.trim() || saving}
        >
          <Save className="mr-2 h-5 w-5" />
          {saving ? "Guardando..." : "Guardar Jugador"}
        </Button>
      </main>

      <BottomNav />
    </div>
  );
}
