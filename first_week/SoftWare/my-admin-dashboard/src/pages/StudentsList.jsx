import { useState } from "react";
import { T, G, DEPT_COLORS } from "../theme";
import { DetailPanel } from "../components/DetailPanel";

export function StudentsList({ students, setPage }) {
  const [filterCourse, setFilterCourse] = useState("");
  const [search, setSearch]             = useState("");
  const [panel, setPanel]               = useState(null);

  const courseOptions = [...new Set(students.map(s => s.course))];
  const filtered = students.filter(s =>
    (!filterCourse || s.course === filterCourse) &&
    (!search || s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase()))
  );

  const sel = { background:T.card, border:`1px solid ${T.border}`, color:T.text, padding:"8px 12px", borderRadius:8, fontSize:13, cursor:"pointer", outline:"none" };

  return (
    <div style={{ padding:28, flex:1, overflowY:"auto" }}>
      <button onClick={()=>setPage("dashboard")} style={{ background:T.card, color:T.muted, border:`1px solid ${T.border}`, padding:"7px 14px", borderRadius:7, cursor:"pointer", fontSize:12, marginBottom:22 }}>← Back</button>
      <h1 style={{ margin:"0 0 22px", fontSize:22, fontWeight:800, color:T.white }}>Students</h1>

      <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:14, padding:20 }}>
        <div style={{ display:"flex", gap:10, marginBottom:18, flexWrap:"wrap", alignItems:"center" }}>
          <input placeholder="Search name or email…" value={search} onChange={e=>setSearch(e.target.value)} style={{ ...sel, flex:1, minWidth:180 }} />
          <select value={filterCourse} onChange={e=>setFilterCourse(e.target.value)} style={sel}>
            <option value="">All Courses</option>
            {courseOptions.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <div style={{ background:G, color:"#fff", padding:"8px 16px", borderRadius:8, fontSize:13, fontWeight:700 }}>{filtered.length} student{filtered.length!==1?"s":""}</div>
        </div>

        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ borderBottom:`1px solid ${T.border}` }}>
              {["ID","Name","Email","Course","Dept","GPA"].map(h => (
                <th key={h} style={{ padding:"8px 12px", color:T.muted, fontSize:11, fontWeight:600, textAlign:"left", textTransform:"uppercase", letterSpacing:1 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id} style={{ borderBottom:`1px solid ${T.border}20`, cursor:"pointer", transition:"background 0.12s" }}
                onClick={()=>setPanel(s)}
                onMouseEnter={e=>e.currentTarget.style.background=T.surface}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <td style={{ padding:"11px 12px", color:T.muted, fontSize:11, fontFamily:"monospace" }}>{s.id}</td>
                <td style={{ padding:"11px 12px", color:T.text, fontWeight:600, fontSize:13 }}>{s.name}</td>
                <td style={{ padding:"11px 12px", color:T.muted, fontSize:12 }}>{s.email}</td>
                <td style={{ padding:"11px 12px", fontSize:12 }}><span style={{ color:DEPT_COLORS[s.dept]||T.accent, fontWeight:500 }}>{s.course}</span></td>
                <td style={{ padding:"11px 12px", color:T.muted, fontSize:12 }}>{s.dept}</td>
                <td style={{ padding:"11px 12px", fontWeight:700, fontSize:13, color:s.gpa>=3.7?T.green:s.gpa>=3.0?T.accent:T.yellow }}>{s.gpa}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DetailPanel item={panel} type="student" onClose={()=>setPanel(null)} />
    </div>
  );
}
