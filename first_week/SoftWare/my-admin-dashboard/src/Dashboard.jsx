import React from "react";
import { T, G, DEPT_COLORS, STATUS_COLORS } from "./theme";
import KpiCard from "./KpiCard";

export default function Dashboard({ students, courses, enrollments, setPage }) {
  const liveCourses = courses.map(c => ({
    ...c,
    students: enrollments.filter(e => e.courseId === String(c.id)).length,
  }));

  const total  = students.length;
  const active  = students.filter(s => s.status === "Active").length;
  const honor   = students.filter(s => s.status === "Honor Roll").length;
  const watch  = students.filter(s => s.status === "On Watch").length;
  const numGpa = students.filter(s => typeof s.gpa === "number");
  const avgGpa= numGpa.length ? (numGpa.reduce((a, s) => a + s.gpa, 0) / numGpa.length).toFixed(2) : "—";
  const totalEnrolled = liveCourses.reduce((a, c) => a + c.students, 0);

  const now     = new Date();
  const dateStr = now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  const sparks = {
    total:  [8, 10, 9, 11, 13, 12, total],
    active: [6,  7, 7,  8, 10,  9, active],
    honor:  [1,  1, 2,  1,  2,  2, honor],
    watch:  [2,  2, 1,  2,  1,  1, watch],
  };

  const recentActivity = [
    ...enrollments.slice(-5).reverse().map(e => ({
      icon: "▣", color: T.accent,
      text: `${e.studentName} enrolled in ${e.courseName}`,
      time: "just now",
    })),
    ...students.filter(s => s.status === "Honor Roll").slice(0, 2).map(s => ({
      icon: "★", color: T.yellow,
      text: `${s.name} achieved Honor Roll`,
      time: "today",
    })),
  ].slice(0, 6);

  return (
    <div style={{ padding: "28px 32px", flex: 1, overflowY: "auto", background: T.bg }}>

      {/* ── HERO HEADER ── */}
      <div style={{ marginBottom: 28, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontSize: 10, color: T.muted, letterSpacing: 3, textTransform: "uppercase", marginBottom: 6 }}>Academic Year 2025</div>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: T.white, letterSpacing: -0.5 }}>Faculty of Science</h1>
          <div style={{ fontSize: 13, color: T.muted, marginTop: 4 }}>{dateStr}</div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, background: T.green + "14", border: `1px solid ${T.green}28`, borderRadius: 30, padding: "6px 14px" }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: T.green, boxShadow: `0 0 8px ${T.green}` }} />
            <span style={{ fontSize: 12, color: T.green, fontWeight: 600 }}>Live Data</span>
          </div>
          <button onClick={() => setPage("addStudent")} style={{ background: G, color: "#fff", border: "none", borderRadius: 30, padding: "7px 18px", cursor: "pointer", fontSize: 12, fontWeight: 700, boxShadow: `0 4px 14px ${T.accent}35` }}>
            + Register Student
          </button>
        </div>
      </div>

      {/* ── KPI ROW ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 22 }}>
        {[
          { label: "Total Students", value: total,  color: T.accent, icon: "◎", trend: 5,  spark: sparks.total,  pg: "students" },
          { label: "Active",         value: active, color: T.green,  icon: "✓", trend: 2,  spark: sparks.active, pg: "students" },
          { label: "Honor Roll",     value: honor,  color: T.yellow, icon: "★", trend: 0,  spark: sparks.honor,  pg: "reports"  },
          { label: "On Watch",       value: watch,  color: T.red,    icon: "⚠", trend: -1, spark: sparks.watch,  pg: "students" },
        ].map(({ label, value, color, icon, trend, spark, pg }) => (
          <KpiCard key={label} label={label} value={value} color={color} icon={icon} trend={trend} spark={spark} onClick={() => setPage(pg)} />
        ))}
      </div>

      {/* ── SECONDARY KPIs ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 22 }}>
        {[
          { label: "Total Enrollments", value: totalEnrolled,       color: T.accent,  sub: "across all courses" },
          { label: "Avg Faculty GPA",   value: avgGpa,              color: T.purple,  sub: "out of 4.0" },
          { label: "Course Sections",   value: liveCourses.length,  color: T.green,   sub: `${liveCourses.filter(c => c.students < c.capacity).length} with open seats` },
        ].map(({ label, value, color, sub }) => (
          <div key={label} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: "18px 22px", display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 50, height: 50, borderRadius: 14, background: color + "18", border: `1px solid ${color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 800, color, flexShrink: 0 }}>
              {typeof value === "number" ? value : <span style={{ fontSize: 18 }}>{value}</span>}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.white, marginBottom: 2 }}>{label}</div>
              <div style={{ fontSize: 11, color: T.muted }}>{sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── MAIN GRID ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 18, marginBottom: 18 }}>

        {/* Course enrollment bars */}
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
            <div>
              <div style={{ fontWeight: 700, color: T.white, fontSize: 15 }}>Course Enrollment</div>
              <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{totalEnrolled} students · {liveCourses.length} courses</div>
            </div>
            <button onClick={() => setPage("courses")} style={{ background: T.accent + "18", color: T.accent, border: "none", borderRadius: 8, padding: "5px 12px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Manage →</button>
          </div>
          {liveCourses.map((c) => {
            const sharePct = totalEnrolled > 0 ? (c.students / totalEnrolled) * 100 : 0;
            const capPct   = c.capacity > 0 ? Math.round((c.students / c.capacity) * 100) : 0;
            const color    = DEPT_COLORS[c.dept] || T.accent;
            const capColor = capPct >= 100 ? T.red : capPct >= 80 ? T.yellow : T.green;
            return (
              <div key={c.id} style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    <div style={{ width: 9, height: 9, borderRadius: "50%", background: color, boxShadow: `0 0 7px ${color}80`, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: T.text, fontWeight: 600 }}>{c.name}</span>
                    <span style={{ fontSize: 11, color: T.muted }}>· {c.instructor}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ background: color + "15", border: `1px solid ${color}30`, borderRadius: 8, padding: "3px 10px", display: "flex", alignItems: "baseline", gap: 4 }}>
                      <span style={{ fontSize: 18, fontWeight: 800, color, fontVariantNumeric: "tabular-nums" }}>{c.students}</span>
                      <span style={{ fontSize: 11, color: T.muted }}>/ {c.capacity}</span>
                    </div>
                    <span style={{ fontSize: 11, color: capColor, fontWeight: 700, minWidth: 34, textAlign: "right" }}>{capPct}%</span>
                  </div>
                </div>
                <div style={{ height: 7, background: T.border, borderRadius: 6, overflow: "hidden", marginBottom: 3 }}>
                  <div style={{ width: `${sharePct}%`, height: "100%", background: `linear-gradient(90deg, ${color}70, ${color})`, borderRadius: 6, transition: "width 0.7s cubic-bezier(.4,0,.2,1)" }} />
                </div>
                <div style={{ height: 3, background: T.border + "80", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ width: `${Math.min(capPct, 100)}%`, height: "100%", background: capColor, borderRadius: 3 }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 10, color: T.muted }}>
                  <span>{sharePct.toFixed(0)}% of total enrollment</span>
                  {capPct >= 100 && <span style={{ color: T.red, fontWeight: 700 }}>⚠ FULL</span>}
                  {capPct >= 80 && capPct < 100 && <span style={{ color: T.yellow, fontWeight: 600 }}>Nearly full</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

          {/* SVG capacity rings */}
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 20 }}>
            <div style={{ fontWeight: 700, color: T.white, fontSize: 14, marginBottom: 16 }}>Capacity Rings</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {liveCourses.map(c => {
                const pct   = c.capacity > 0 ? Math.round((c.students / c.capacity) * 100) : 0;
                const color = pct >= 100 ? T.red : pct >= 80 ? T.yellow : T.green;
                const circ  = 2 * Math.PI * 14;
                return (
                  <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ position: "relative", width: 36, height: 36, flexShrink: 0 }}>
                      <svg width="36" height="36" viewBox="0 0 36 36" style={{ transform: "rotate(-90deg)" }}>
                        <circle cx="18" cy="18" r="14" fill="none" stroke={T.border} strokeWidth="3.5" />
                        <circle cx="18" cy="18" r="14" fill="none" stroke={color} strokeWidth="3.5"
                          strokeDasharray={`${(Math.min(pct, 100) / 100) * circ} ${circ}`}
                          strokeLinecap="round" style={{ transition: "stroke-dasharray 0.8s cubic-bezier(.4,0,.2,1)" }} />
                      </svg>
                      <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 7.5, fontWeight: 800, color }}>{Math.min(pct, 100)}%</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: T.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</div>
                      <div style={{ fontSize: 11, color: T.muted }}>{c.students} / {c.capacity} enrolled</div>
                    </div>
                    {pct >= 100 && <span style={{ fontSize: 9, color: T.red, fontWeight: 800, background: T.red + "18", padding: "2px 7px", borderRadius: 10 }}>FULL</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Activity feed */}
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 20, flex: 1 }}>
            <div style={{ fontWeight: 700, color: T.white, fontSize: 14, marginBottom: 16 }}>Recent Activity</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {recentActivity.map((a, i) => (
                <div key={i} style={{ display: "flex", gap: 12, paddingBottom: 12, borderBottom: i < recentActivity.length - 1 ? `1px solid ${T.border}` : "none", marginBottom: i < recentActivity.length - 1 ? 12 : 0 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: a.color + "18", border: `1px solid ${a.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: a.color, flexShrink: 0 }}>{a.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, color: T.text, lineHeight: 1.4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.text}</div>
                    <div style={{ fontSize: 10, color: T.muted, marginTop: 2 }}>{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM ROW ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 18 }}>

        {/* GPA Distribution */}
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 22 }}>
          <div style={{ fontWeight: 700, color: T.white, fontSize: 15, marginBottom: 20 }}>GPA Distribution</div>
          {[
            ["Honor Roll (3.7–4.0)",    students.filter(s => typeof s.gpa === "number" && s.gpa >= 3.7).length,                           T.green],
            ["Good Standing (3.0–3.69)", students.filter(s => typeof s.gpa === "number" && s.gpa >= 3.0 && s.gpa < 3.7).length,           T.accent],
            ["At Risk (< 3.0)",          students.filter(s => typeof s.gpa === "number" && s.gpa < 3.0).length,                           T.red],
          ].map(([lbl, n, c]) => (
            <div key={lbl} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />
                  <span style={{ fontSize: 12, color: T.text }}>{lbl}</span>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                  <span style={{ fontSize: 18, fontWeight: 800, color: c }}>{n}</span>
                  <span style={{ fontSize: 10, color: T.muted }}>students</span>
                </div>
              </div>
              <div style={{ height: 6, background: T.border, borderRadius: 4, overflow: "hidden" }}>
                <div style={{ width: `${total > 0 ? (n / total) * 100 : 0}%`, height: "100%", background: c, borderRadius: 4, transition: "width 0.7s ease" }} />
              </div>
            </div>
          ))}
          <div style={{ marginTop: 20, padding: "14px 18px", background: T.purple + "12", border: `1px solid ${T.purple}22`, borderRadius: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 10, color: T.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 2 }}>Faculty Average GPA</div>
              <div style={{ fontSize: 10, color: T.muted }}>All {numGpa.length} graded students</div>
            </div>
            <div style={{ fontSize: 42, fontWeight: 900, color: T.purple, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{avgGpa}</div>
          </div>
        </div>

        {/* Recent Students */}
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <div style={{ fontWeight: 700, color: T.white, fontSize: 15 }}>Recent Students</div>
            <button onClick={() => setPage("students")} style={{ background: T.accent + "18", color: T.accent, border: "none", borderRadius: 8, padding: "5px 12px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>View all →</button>
          </div>
          {students.slice(0, 7).map((s, i) => {
            const dc = DEPT_COLORS[s.dept] || T.accent;
            const sc = STATUS_COLORS[s.status] || T.muted;
            return (
              <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < 6 ? `1px solid ${T.border}` : "none" }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: dc + "18", border: `1px solid ${dc}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: dc, flexShrink: 0 }}>
                  {s.name[0]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: T.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: T.muted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.course}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3, flexShrink: 0 }}>
                  <span style={{ fontSize: 15, fontWeight: 800, color: s.gpa >= 3.7 ? T.green : s.gpa >= 3.0 ? T.accent : T.yellow, fontVariantNumeric: "tabular-nums" }}>{s.gpa}</span>
                  <span style={{ fontSize: 10, background: sc + "20", color: sc, padding: "1px 8px", borderRadius: 10, fontWeight: 600, whiteSpace: "nowrap" }}>{s.status}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
