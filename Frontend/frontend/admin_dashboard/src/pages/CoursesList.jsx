import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { DEPT_COLORS } from "../theme";
import { DetailPanel } from "../components/DetailPanel";

export function CoursesList({ courses, setCourses, enrollments, setPage }) {
  const { theme } = useTheme();
  const G = `linear-gradient(135deg, ${theme.accent2}, ${theme.accent})`;

  const [showAdd, setShowAdd] = useState(false);
  const [panel, setPanel]     = useState(null);
  const [form, setForm]       = useState({ name:"", instructor:"", credit:"", capacity:"" });

  const liveCourses = courses.map(c => ({ ...c, students: enrollments.filter(e => e.courseId === String(c.id)).length }));

  const handleAdd = () => {
    if (form.name && form.instructor && form.credit && form.capacity) {
      setCourses(prev => [...prev, { id:Date.now(), ...form, credit:+form.credit, capacity:+form.capacity, semester:"Fall", dept:"General" }]);
      setForm({ name:"", instructor:"", credit:"", capacity:"" });
      setShowAdd(false);
    }
  };

  const handleEditCapacity = (id, val) => {
    const n = parseInt(val);
    if (!isNaN(n) && n >= 1) {
      setCourses(prev => prev.map(c => c.id===id ? {...c, capacity:n} : c));
      setPanel(p => p && p.id===id ? {...p, capacity:n} : p);
    }
  };

  return (
    <div className="p-7 flex-1 overflow-y-auto" style={{ background: theme.bg }}>
      <button onClick={()=>setPage("dashboard")} className="btn-back" style={{ background: theme.card, color: theme.muted, borderColor: theme.border }}>
        ← Back
      </button>

      <div className="flex justify-between items-center mb-5">
        <h1 className="m-0 text-3xl font-extrabold" style={{ color: theme.white }}>Courses</h1>
        <button onClick={()=>setShowAdd(!showAdd)} className="btn-primary px-5 py-2 text-sm" style={{ background: G }}>+ Add Course</button>
      </div>

      {showAdd && (
        <div className="card mb-5" style={{ background: theme.card, borderColor: theme.border, padding: 20 }}>
          <div className="font-semibold mb-3" style={{ color: theme.white, fontSize: 14 }}>New Course</div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {[["name","Course Name"],["instructor","Instructor"],["credit","Credit Hours"],["capacity","Max Capacity"]].map(([k,pl]) => (
              <input
                key={k}
                type={k==="credit"||k==="capacity"?"number":"text"}
                placeholder={pl}
                value={form[k]}
                onChange={e=>setForm({...form,[k]:e.target.value})}
                className="input-field"
                style={{ background: theme.surface, borderColor: theme.border, color: theme.text }}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} className="btn" style={{ background: theme.green, color: theme.bg, padding: "8px 18px", fontWeight: 700 }}>Save</button>
            <button onClick={()=>setShowAdd(false)} className="btn" style={{ background: theme.border, color: theme.text, padding: "8px 18px" }}>Cancel</button>
          </div>
        </div>
      )}

      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
        {liveCourses.map(c => {
          const pct   = Math.round((c.students/c.capacity)*100);
          const color = DEPT_COLORS[c.dept] || theme.accent;
          const full  = c.students >= c.capacity;
          return (
            <div
              key={c.id}
              onClick={()=>setPanel(c)}
              className="card cursor-pointer"
              style={{ background: theme.card, borderColor: theme.border, padding: 20 }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor = color+"55"; e.currentTarget.style.transform = "translateY(-4px)";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.transform = "none";}}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="font-bold" style={{ color: theme.white, fontSize: 14, marginBottom: 3 }}>{c.name}</div>
                  <div className="text-sm" style={{ color }}>{c.instructor}</div>
                </div>
                <span className="px-2 py-1 rounded-full text-xs font-semibold" style={{ background: `${color}20`, color }}>{c.credit} cr.</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {[["Enrolled",c.students,theme.accent],["Capacity",`${c.students}/${c.capacity}`,full?theme.red:theme.green]].map(([l,v,cl]) => (
                  <div key={l} className="text-center p-3 rounded" style={{ background: theme.surface }}>
                    <div className="text-xs uppercase tracking-wider" style={{ color: theme.muted, marginBottom: 3 }}>{l}</div>
                    <div className="text-lg font-extrabold" style={{ color: cl }}>{v}</div>
                  </div>
                ))}
              </div>
              <div className="progress-bar" style={{ background: theme.border }}>
                <div className="progress-fill" style={{ width: `${Math.min(pct,100)}%`, background: pct>=100 ? theme.red : pct>=80 ? theme.yellow : color }} />
              </div>
              {full && <div className="mt-2 text-center text-xs font-bold py-1 rounded" style={{ background: `${theme.red}15`, color: theme.red }}>⚠ FULL</div>}
            </div>
          );
        })}
      </div>

      <DetailPanel item={panel} type="course" onClose={()=>setPanel(null)} onEditCapacity={handleEditCapacity} />
    </div>
  );
}