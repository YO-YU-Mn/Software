import React, { useState, useEffect } from "react";
import { T, G, DEPT_COLORS, STATUS_COLORS } from "./theme";

export default function DetailPanel({ item, type, onClose, onEditCapacity }) {
  const [editCap, setEditCap] = useState(false);
  const [capVal,  setCapVal]  = useState(item?.capacity ?? "");

  useEffect(() => {
    setCapVal(item?.capacity ?? "");
    setEditCap(false);
  }, [item]);

  if (!item) return null;

  const isCourse = type === "course";
  const color    = isCourse
    ? (DEPT_COLORS[item.dept] || T.accent)
    : (STATUS_COLORS[item.status] || T.muted);
  const pct = isCourse ? Math.round((item.students / item.capacity) * 100) : null;

  const rows = isCourse
    ? [
        ["Course",      item.name],
        ["Instructor",  item.instructor],
        ["Department",  item.dept],
        ["Semester",    item.semester],
        ["Credits",     item.credit],
        ["Enrolled",    item.students],
      ]
    : [
        ["Name",        item.name],
        ["Email",       item.email],
        ["Department",  item.dept],
        ["Year",        item.year],
        ["Course",      item.course || "—"],
        ["GPA",         item.gpa],
      ];

  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1000, backdropFilter: "blur(4px)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: T.card, border: `1px solid ${color}50`,
          borderRadius: 20, width: 430, maxWidth: "93vw", overflow: "hidden",
          boxShadow: `0 32px 80px rgba(0,0,0,0.6), 0 0 40px ${color}18`,
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Top color stripe */}
        <div style={{ height: 3, background: `linear-gradient(90deg, ${color}, ${color}40)` }} />

        <div style={{ padding: "26px 26px 22px" }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 10, color: T.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 5 }}>
                {isCourse ? "Course Details" : "Student Profile"}
              </div>
              <h2 style={{ margin: 0, fontSize: 19, fontWeight: 700, color: T.white }}>{item.name}</h2>
              {isCourse && <div style={{ fontSize: 12, color, marginTop: 3 }}>{item.instructor}</div>}
              {!isCourse && (
                <span style={{ marginTop: 6, display: "inline-block", background: color + "22", color, padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
                  {item.status}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              style={{ background: T.surface, border: `1px solid ${T.border}`, color: T.muted, width: 30, height: 30, borderRadius: 8, cursor: "pointer", fontSize: 14, flexShrink: 0 }}
            >✕</button>
          </div>

          {/* Info table */}
          <div style={{ borderRadius: 10, overflow: "hidden", border: `1px solid ${T.border}` }}>
            {rows.map(([k, v], i) => (
              <div
                key={k}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: i % 2 === 0 ? T.surface : T.card }}
              >
                <span style={{ fontSize: 12, color: T.muted }}>{k}</span>
                <span style={{ fontSize: 13, color: T.text, fontWeight: 600 }}>{v}</span>
              </div>
            ))}

            {/* Editable capacity row */}
            {isCourse && (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: rows.length % 2 === 0 ? T.surface : T.card }}>
                <span style={{ fontSize: 12, color: T.muted }}>Max Capacity</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {editCap ? (
                    <>
                      <input
                        type="number"
                        value={capVal}
                        onChange={e => setCapVal(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === "Enter") { onEditCapacity(item.id, capVal); setEditCap(false); }
                          if (e.key === "Escape") setEditCap(false);
                        }}
                        autoFocus
                        style={{ width: 60, background: T.bg, border: `1px solid ${T.accent}`, color: T.accent, borderRadius: 6, padding: "3px 8px", fontSize: 14, fontWeight: 700, textAlign: "center", outline: "none" }}
                      />
                      <button onClick={() => { onEditCapacity(item.id, capVal); setEditCap(false); }} style={{ background: T.green, color: T.bg, border: "none", borderRadius: 5, padding: "3px 9px", cursor: "pointer", fontWeight: 700, fontSize: 12 }}>✓</button>
                      <button onClick={() => setEditCap(false)} style={{ background: T.border, color: T.muted, border: "none", borderRadius: 5, padding: "3px 9px", cursor: "pointer", fontSize: 12 }}>✕</button>
                    </>
                  ) : (
                    <>
                      <span style={{ fontSize: 13, color: T.text, fontWeight: 600 }}>{item.capacity}</span>
                      <button
                        onClick={() => { setCapVal(String(item.capacity)); setEditCap(true); }}
                        style={{ background: T.accent + "22", color: T.accent, border: "none", borderRadius: 5, padding: "2px 9px", cursor: "pointer", fontSize: 11, fontWeight: 600 }}
                      >Edit</button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Enrollment bar (course) */}
          {isCourse && (
            <div style={{ marginTop: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: T.muted, marginBottom: 6 }}>
                <span>Enrollment</span>
                <span style={{ color: pct >= 100 ? T.red : pct >= 80 ? T.yellow : T.green, fontWeight: 700 }}>
                  {item.students}/{item.capacity} ({Math.min(pct, 100)}%)
                </span>
              </div>
              <div style={{ height: 6, background: T.border, borderRadius: 4 }}>
                <div style={{ width: `${Math.min(pct, 100)}%`, height: "100%", background: pct >= 100 ? T.red : pct >= 80 ? T.yellow : color, borderRadius: 4, transition: "width 0.5s" }} />
              </div>
              {pct >= 100 && (
                <div style={{ marginTop: 10, background: T.red + "18", color: T.red, border: `1px solid ${T.red}30`, borderRadius: 8, padding: "8px 12px", fontSize: 12, fontWeight: 600, textAlign: "center" }}>
                  ⚠ Course is full
                </div>
              )}
            </div>
          )}

          {/* GPA bar (student) */}
          {!isCourse && typeof item.gpa === "number" && (
            <div style={{ marginTop: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: T.muted, marginBottom: 6 }}>
                <span>GPA</span>
                <span style={{ color: item.gpa >= 3.7 ? T.green : item.gpa >= 3.0 ? T.accent : T.yellow, fontWeight: 700 }}>
                  {item.gpa} / 4.0
                </span>
              </div>
              <div style={{ height: 6, background: T.border, borderRadius: 4 }}>
                <div style={{ width: `${(item.gpa / 4.0) * 100}%`, height: "100%", background: item.gpa >= 3.7 ? T.green : item.gpa >= 3.0 ? T.accent : T.yellow, borderRadius: 4 }} />
              </div>
            </div>
          )}

          <button
            onClick={onClose}
            style={{ marginTop: 18, width: "100%", background: G, color: "#fff", border: "none", padding: "11px", borderRadius: 9, cursor: "pointer", fontWeight: 700, fontSize: 14 }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
