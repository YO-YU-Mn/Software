import React, { useState } from "react";
import { T, STATUS_COLORS } from "./theme";
import DetailPanel from "./DetailPanel";

export default function Reports({ students }) {
  const [panel, setPanel] = useState(null);

  const numGpa   = students.filter(s => typeof s.gpa === "number");
  const avgGpa   = numGpa.length ? (numGpa.reduce((a, s) => a + s.gpa, 0) / numGpa.length).toFixed(2) : "—";
  const top      = [...students].sort((a, b) => b.gpa - a.gpa).slice(0, 3);
  const statuses = students.reduce((acc, s) => { acc[s.status] = (acc[s.status] || 0) + 1; return acc; }, {});

  return (
    <div style={{ padding: 28, flex: 1, overflowY: "auto" }}>
      <h1 style={{ margin: "0 0 22px", fontSize: 22, fontWeight: 800, color: T.white }}>Academic Reports</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>

        {/* Status Distribution */}
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: 22 }}>
          <div style={{ fontWeight: 700, color: T.white, marginBottom: 18, fontSize: 15 }}>Status Distribution</div>
          {Object.entries(statuses).map(([st, n]) => (
            <div key={st} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${T.border}20` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: STATUS_COLORS[st] || T.muted }} />
                <span style={{ color: T.text, fontSize: 13 }}>{st}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ height: 4, width: 80, background: T.border, borderRadius: 3 }}>
                  <div style={{ width: `${(n / students.length) * 100}%`, height: "100%", background: STATUS_COLORS[st] || T.muted, borderRadius: 3 }} />
                </div>
                <span style={{ color: STATUS_COLORS[st] || T.muted, fontWeight: 700, fontSize: 13, minWidth: 20 }}>{n}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Average GPA */}
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: 22, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontWeight: 700, color: T.white, marginBottom: 14, fontSize: 15 }}>Faculty Average GPA</div>
          <div style={{ fontSize: 72, fontWeight: 800, color: T.purple, lineHeight: 1 }}>{avgGpa}</div>
          <div style={{ color: T.muted, fontSize: 13, marginTop: 8 }}>out of 4.0</div>
        </div>

        {/* Top Students */}
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: 22, gridColumn: "span 2" }}>
          <div style={{ fontWeight: 700, color: T.white, marginBottom: 16, fontSize: 15 }}>Top Performing Students — click for profile</div>
          <div style={{ display: "flex", gap: 14 }}>
            {top.map((s, i) => (
              <div
                key={s.id}
                onClick={() => setPanel(s)}
                style={{ flex: 1, background: T.surface, borderRadius: 12, padding: 18, borderTop: `3px solid ${[T.yellow, T.muted, "#cd7f32"][i]}`, cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 10px 24px rgba(0,0,0,0.3)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ fontSize: 22, marginBottom: 10 }}>{["🥇", "🥈", "🥉"][i]}</div>
                <div style={{ fontWeight: 700, color: T.white, marginBottom: 3, fontSize: 14 }}>{s.name}</div>
                <div style={{ fontSize: 11, color: T.muted, marginBottom: 12 }}>{s.course}</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: T.green }}>{s.gpa}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <DetailPanel item={panel} type="student" onClose={() => setPanel(null)} />
    </div>
  );
}
