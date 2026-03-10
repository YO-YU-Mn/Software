import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { DEPT_COLORS } from "../theme";
import { DetailPanel } from "../components/DetailPanel";

export function StudentsList({ students, setPage }) {
  const { theme } = useTheme();
  const [filterCourse, setFilterCourse] = useState("");
  const [search, setSearch]             = useState("");
  const [panel, setPanel]               = useState(null);

  const courseOptions = [...new Set(students.map(s => s.course))];
  const filtered = students.filter(s =>
    (!filterCourse || s.course === filterCourse) &&
    (!search || s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-7 flex-1 overflow-y-auto" style={{ background: theme.bg }}>
      <button onClick={()=>setPage("dashboard")} className="btn-back" style={{ background: theme.card, color: theme.muted, borderColor: theme.border }}>
        ← Back
      </button>
      <h1 className="m-0 mb-5 text-3xl font-extrabold" style={{ color: theme.white }}>Students</h1>

      <div className="card" style={{ background: theme.card, borderColor: theme.border, padding: 20 }}>
        <div className="flex gap-2 mb-4 flex-wrap items-center">
          <input
            placeholder="Search name or email…"
            value={search}
            onChange={e=>setSearch(e.target.value)}
            className="input-field flex-1 min-w-44"
            style={{ background: theme.card, borderColor: theme.border, color: theme.text }}
          />
          <select
            value={filterCourse}
            onChange={e=>setFilterCourse(e.target.value)}
            className="input-field"
            style={{ background: theme.card, borderColor: theme.border, color: theme.text }}
          >
            <option value="">All Courses</option>
            {courseOptions.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <div className="btn-primary px-4 py-2 text-sm font-bold rounded" style={{ background: `linear-gradient(135deg, ${theme.accent2}, ${theme.accent})`, color: "#fff" }}>
            {filtered.length} student{filtered.length!==1?"s":""}
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              {["ID","Name","Email","Course","Dept","GPA"].map(h => (
                <th key={h} style={{ color: theme.muted, borderColor: theme.border }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr
                key={s.id}
                onClick={()=>setPanel(s)}
                className="cursor-pointer"
                onMouseEnter={e=>e.currentTarget.style.background = theme.surface}
                onMouseLeave={e=>e.currentTarget.style.background = "transparent"}
                style={{ borderColor: `${theme.border}20` }}
              >
                <td className="mono" style={{ color: theme.muted, fontSize: 11 }}>{s.id}</td>
                <td style={{ color: theme.text, fontWeight: 600, fontSize: 13 }}>{s.name}</td>
                <td style={{ color: theme.muted, fontSize: 12 }}>{s.email}</td>
                <td style={{ fontSize: 12 }}><span style={{ color: DEPT_COLORS[s.dept] || theme.accent, fontWeight: 500 }}>{s.course}</span></td>
                <td style={{ color: theme.muted, fontSize: 12 }}>{s.dept}</td>
                <td style={{ fontWeight: 700, fontSize: 13, color: s.gpa>=3.7 ? theme.green : s.gpa>=3.0 ? theme.accent : theme.yellow }}>{s.gpa}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DetailPanel item={panel} type="student" onClose={()=>setPanel(null)} />
    </div>
  );
}