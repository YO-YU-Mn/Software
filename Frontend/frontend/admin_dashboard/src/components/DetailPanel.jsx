import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { DEPT_COLORS, STATUS_COLORS } from "../theme";

export function DetailPanel({ item, type, onClose, onEditCapacity }) {
  const { theme } = useTheme();
  const G = `linear-gradient(135deg, ${theme.accent2}, ${theme.accent})`;

  const [editCap, setEditCap] = useState(false);
  const [capVal, setCapVal] = useState(item?.capacity ?? "");

  useEffect(() => { setCapVal(item?.capacity ?? ""); setEditCap(false); }, [item]);

  if (!item) return null;

  const isCourse = type === "course";
  const color = isCourse ? (DEPT_COLORS[item.dept] || theme.accent) : (STATUS_COLORS[item.status] || theme.muted);
  const pct = isCourse ? Math.round((item.students / item.capacity) * 100) : null;
  const rows = isCourse
    ? [["Course",item.name],["Instructor",item.instructor],["Department",item.dept],["Semester",item.semester],["Credits",item.credit],["Enrolled",item.students]]
    : [["Name",item.name],["Email",item.email],["Department",item.dept],["Year",item.year],["Course",item.course||"—"],["GPA",item.gpa]];

  return (
    <div className="panel-overlay" onClick={onClose}>
      <div className="panel" style={{ border: `1px solid ${color}50` }} onClick={e=>e.stopPropagation()}>
        <div className="panel-header" style={{ background: `linear-gradient(90deg,${color},${color}40)` }} />
        <div className="panel-content">
          <div className="flex justify-between items-start mb-5">
            <div>
              <div className="panel-title" style={{ color: theme.muted }}>{isCourse ? "Course Details" : "Student Profile"}</div>
              <h2 className="panel-name" style={{ color: theme.white }}>{item.name}</h2>
              {isCourse && <div className="text-sm mt-1" style={{ color }}>{item.instructor}</div>}
              {!isCourse && <span className="mt-1 inline-block px-2 py-1 rounded-full text-xs font-semibold" style={{ background: `${color}22`, color }}>{item.status}</span>}
            </div>
            <button onClick={onClose} className="panel-close" style={{ background: theme.surface, borderColor: theme.border, color: theme.muted }}>✕</button>
          </div>

          <div className="rounded-lg overflow-hidden" style={{ border: `1px solid ${theme.border}` }}>
            {rows.map(([k,v],i) => (
              <div key={k} className="panel-info-row" style={{ background: i%2===0 ? theme.surface : theme.card }}>
                <span className="panel-info-label" style={{ color: theme.muted }}>{k}</span>
                <span className="panel-info-value" style={{ color: theme.text }}>{v}</span>
              </div>
            ))}
            {isCourse && (
              <div className="panel-info-row" style={{ background: rows.length%2===0 ? theme.surface : theme.card }}>
                <span className="panel-info-label" style={{ color: theme.muted }}>Max Capacity</span>
                <div className="flex items-center gap-2">
                  {editCap ? (
                    <>
                      <input
                        type="number"
                        value={capVal}
                        onChange={e=>setCapVal(e.target.value)}
                        autoFocus
                        className="input-field w-16 text-center"
                        style={{ background: theme.bg, border: `1px solid ${theme.accent}`, color: theme.accent, fontSize: 14, fontWeight: 700, padding: "3px 8px" }}
                      />
                      <button onClick={()=>{onEditCapacity(item.id,capVal);setEditCap(false);}} className="btn" style={{ background: theme.green, color: theme.bg, padding: "3px 9px", fontSize: 12 }}>✓</button>
                      <button onClick={()=>setEditCap(false)} className="btn" style={{ background: theme.border, color: theme.muted, padding: "3px 9px", fontSize: 12 }}>✕</button>
                    </>
                  ) : (
                    <>
                      <span className="font-semibold" style={{ color: theme.text }}>{item.capacity}</span>
                      <button onClick={()=>{setCapVal(String(item.capacity));setEditCap(true);}} className="btn" style={{ background: `${theme.accent}22`, color: theme.accent, padding: "2px 9px", fontSize: 11 }}>Edit</button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {isCourse && (
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1" style={{ color: theme.muted }}>
                <span>Enrollment</span>
                <span style={{ color: pct>=100 ? theme.red : pct>=80 ? theme.yellow : theme.green, fontWeight: 700 }}>{item.students}/{item.capacity} ({Math.min(pct,100)}%)</span>
              </div>
              <div className="progress-bar" style={{ background: theme.border }}>
                <div className="progress-fill" style={{ width: `${Math.min(pct,100)}%`, background: pct>=100 ? theme.red : pct>=80 ? theme.yellow : color }} />
              </div>
            </div>
          )}

          {!isCourse && typeof item.gpa === "number" && (
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1" style={{ color: theme.muted }}>
                <span>GPA</span>
                <span style={{ color: item.gpa>=3.7 ? theme.green : item.gpa>=3.0 ? theme.accent : theme.yellow, fontWeight: 700 }}>{item.gpa} / 4.0</span>
              </div>
              <div className="progress-bar" style={{ background: theme.border }}>
                <div className="progress-fill" style={{ width: `${(item.gpa/4.0)*100}%`, background: item.gpa>=3.7 ? theme.green : item.gpa>=3.0 ? theme.accent : theme.yellow }} />
              </div>
            </div>
          )}

          <button onClick={onClose} className="btn btn-primary w-full mt-4 py-3 text-base" style={{ background: G }}>Close</button>
        </div>
      </div>
    </div>
  );
}