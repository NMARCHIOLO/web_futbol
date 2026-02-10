"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import { type Player } from "@/lib/data";

interface PlayerRadarChartProps {
  player: Player;
  compact?: boolean;
}

export function PlayerRadarChart({ player, compact = false }: PlayerRadarChartProps) {
  // Define colors as hex values for Recharts
  const primaryColor = "#00ff88";

  const data = [
    { stat: "TEC", value: player.stat_tecnica, fullMark: 10 },
    { stat: "FIS", value: player.stat_fisico, fullMark: 10 },
    { stat: "TAC", value: player.stat_tactica, fullMark: 10 },
    { stat: "MEN", value: player.stat_mental, fullMark: 10 },
  ];

  return (
    <div className={compact ? "h-36 w-full" : "h-52 w-full"}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} cx="50%" cy="50%" outerRadius={compact ? "65%" : "70%"}>
          <PolarGrid stroke="#2a2a3d" strokeOpacity={0.6} />
          <PolarAngleAxis
            dataKey="stat"
            tick={{ fill: "#a0a0b0", fontSize: compact ? 9 : 11, fontWeight: 600 }}
            tickLine={false}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 10]}
            tick={false}
            axisLine={false}
          />
          <Radar
            name={player.apodo}
            dataKey="value"
            stroke={primaryColor}
            fill={primaryColor}
            fillOpacity={0.25}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
