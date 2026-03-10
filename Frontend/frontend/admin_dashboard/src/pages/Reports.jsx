import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { STATUS_COLORS } from "../theme";
import { DetailPanel } from "../components/DetailPanel";

export function Reports({ students, setPage }) {
  const { theme } = useTheme();
  const [panel, setPanel] = useState(null);

  const numGpa   = students.filter(s => typeof s.gpa === "number");
  const avgGpa   = numGpa.length ? (numGpa.reduce((a,s) => a+s.gpa, 0) / numGpa.length).toFixed(2) : "—";
  const top      = [...students].sort((a,b) => b.gpa-a.gpa).slice(0,3);
  const statuses = students.reduce((acc,s) => { acc[s.status]=(acc[s.status]||0)+1; return acc; }, {});

  return (
    <div className="p-7 flex-1 overflow-y-auto" style={{ background: theme.bg }}>
      <button onClick={()=>setPage("dashboard")} className="btn-back" style={{ background: theme.card, color: theme.muted, borderColor: theme.border }}>
        ← Back
      </button>
      <h1 className="m-0 mb-5 text-3xl font-extrabold" style={{ color: theme.white }}>Academic Reports</h1>

      <div className="grid grid-cols-2 gap-4">
        {/* Status Distribution */}
        <div className="card" style={{ background: theme.card, borderColor: theme.border, padding: 22 }}>
          <div className="font-bold mb-4" style={{ color: theme.white, fontSize: 15 }}>Status Distribution</div>
          {Object.entries(statuses).map(([st,n]) => (
            <div key={st} className="flex items-center justify-between py-2" style={{ borderBottom: `1px solid ${theme.border}20` }}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ background: STATUS_COLORS[st] || theme.muted }} />
                <span className="text-sm" style={{ color: theme.text }}>{st}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-20 h-1 rounded" style={{ background: theme.border }}>
                  <div className="h-full rounded" style={{ width: `${(n/students.length)*100}%`, background: STATUS_COLORS[st] || theme.muted }} />
                </div>
                <span className="text-sm font-bold min-w-5" style={{ color: STATUS_COLORS[st] || theme.muted }}>{n}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Avg GPA */}
        <div className="card flex flex-col items-center justify-center" style={{ background: theme.card, borderColor: theme.border, padding: 22 }}>
          <div className="font-bold mb-3" style={{ color: theme.white, fontSize: 15 }}>Faculty Average GPA</div>
          <div className="text-7xl font-extrabold" style={{ color: theme.purple, lineHeight: 1 }}>{avgGpa}</div>
          <div className="text-sm mt-2" style={{ color: theme.muted }}>out of 4.0</div>
        </div>

        {/* Top Students */}
        <div className="card col-span-2" style={{ background: theme.card, borderColor: theme.border, padding: 22 }}>
          <div className="font-bold mb-4" style={{ color: theme.white, fontSize: 15 }}>Top Performing Students — click for profile</div>
          <div className="flex gap-3">
            {top.map((s,i) => (
              <div
                key={s.id}
                onClick={()=>setPanel(s)}
                className="flex-1 p-4 rounded-lg cursor-pointer transition-transform hover:-translate-y-1"
                style={{ background: theme.surface, borderTop: `3px solid ${[theme.yellow, theme.muted, "#cd7f32"][i]}` }}
              >
                <div className="text-2xl mb-2">{["🥇","🥈","🥉"][i]}</div>
                <div className="font-bold mb-1" style={{ color: theme.white, fontSize: 14 }}>{s.name}</div>
                <div className="text-xs mb-3" style={{ color: theme.muted }}>{s.course}</div>
                <div className="text-2xl font-extrabold" style={{ color: theme.green }}>{s.gpa}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <DetailPanel item={panel} type="student" onClose={()=>setPanel(null)} />
    </div>
  );
}