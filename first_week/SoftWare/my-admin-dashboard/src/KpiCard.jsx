import React, { useState } from "react";
import { T } from "./theme";
import { useCountUp } from "./hooks";

// ─── SPARKLINE ────────────────────────────────────────────────
export function Sparkline({ data, color, width = 80, height = 28 }) {
  if (!data || data.length < 2) return null;
  const max   = Math.max(...data);
  const min   = Math.min(...data);
  const range = max - min || 1;
  const pts   = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(" ");
  const gradId = `sg_${color.replace("#", "")}`;

  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
      <polyline points={`0,${height} ${pts} ${width},${height}`} fill={`url(#${gradId})`} stroke="none" opacity="0.15" />
    </svg>
  );
}

// ─── KPI CARD ─────────────────────────────────────────────────
export default function KpiCard({ label, value, color, icon, trend, spark, onClick }) {
  const animated = useCountUp(typeof value === "number" ? value : 0);
  const [hov, setHov] = useState(false);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      style={{
        background: T.card, borderRadius: 16, padding: "20px 22px",
        border: `1px solid ${hov ? color + "55" : T.border}`,
        cursor: onClick ? "pointer" : "default", transition: "all 0.22s",
        transform: hov ? "translateY(-4px)" : "none",
        boxShadow: hov ? `0 12px 32px ${color}22` : "none",
        position: "relative", overflow: "hidden",
      }}
    >
      {/* Background glow blob */}
      <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: color + "10", pointerEvents: "none" }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>{icon}</div>
        {trend !== undefined && (
          <div style={{
            fontSize: 11,
            color: trend > 0 ? T.green : trend < 0 ? T.red : T.muted,
            fontWeight: 600,
            background: (trend > 0 ? T.green : trend < 0 ? T.red : T.muted) + "15",
            padding: "2px 7px", borderRadius: 20,
          }}>
            {trend > 0 ? "↑" : trend < 0 ? "↓" : "—"} {Math.abs(trend)}%
          </div>
        )}
      </div>

      <div style={{ fontSize: 36, fontWeight: 900, color, lineHeight: 1, marginBottom: 4, fontVariantNumeric: "tabular-nums" }}>
        {typeof value === "number" ? animated : value}
      </div>
      <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginBottom: spark ? 8 : 0 }}>{label}</div>

      {spark && (
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, opacity: 0.5 }}>
          <Sparkline data={spark} color={color} width={200} height={24} />
        </div>
      )}
    </div>
  );
}
