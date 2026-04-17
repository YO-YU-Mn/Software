import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { Sparkline } from "./Sparkline";
import { useCountUp } from "../hooks/useCountUp";

export function KpiCard({ label, value, color, icon, trend, spark, onClick }) {
  const { theme } = useTheme();
  const animated = useCountUp(typeof value === "number" ? value : 0);
  const [hov, setHov] = useState(false);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      className="kpi-card"
      style={{
        background: theme.card,
        borderColor: hov ? color + "55" : theme.border,
        boxShadow: hov ? `0 12px 32px ${color}22` : "none",
      }}
    >
      <div style={{ position:"absolute", top:-20, right:-20, width:80, height:80, borderRadius:"50%", background:color+"10", pointerEvents:"none" }} />
      <div className="flex justify-between items-start mb-3">
        <div className="kpi-icon" style={{ background: color+"18" }}>{icon}</div>
        {trend !== undefined && (
          <div
            className="kpi-trend"
            style={{
              color: trend>0 ? theme.green : trend<0 ? theme.red : theme.muted,
              background: (trend>0 ? theme.green : trend<0 ? theme.red : theme.muted)+"15",
            }}
          >
            {trend>0?"↑":trend<0?"↓":"—"} {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className="kpi-value" style={{ color }}>
        {typeof value === "number" ? animated : value}
      </div>
      <div className="kpi-label" style={{ color: theme.muted }}>{label}</div>
      {spark && (
        <div style={{ position:"absolute", bottom:0, left:0, right:0, opacity:0.5 }}>
          <Sparkline data={spark} color={color} width={200} height={24} />
        </div>
      )}
    </div>
  );
}