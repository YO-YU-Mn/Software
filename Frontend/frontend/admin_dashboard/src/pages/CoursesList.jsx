import { useState } from "react";
import { T, G, DEPT_COLORS } from "../theme";
import { DetailPanel } from "../components/DetailPanel";

export function CoursesList({ courses, setCourses, enrollments, setPage }) {
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

  const inp = { background:T.surface, border:`1px solid ${T.border}`, color:T.text, padding:"9px 12px", borderRadius:8, fontSize:13, outline:"none", width:"100%", boxSizing:"border-box" };

  return (
    <div style={{ padding:28, flex:1, overflowY:"auto" }}>
      <button onClick={()=>setPage("dashboard")} style={{ background:T.card, color:T.muted, border:`1px solid ${T.border}`, padding:"7px 14px", borderRadius:7, cursor:"pointer", fontSize:12, marginBottom:22 }}>← Back</button>

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22 }}>
        <h1 style={{ margin:0, fontSize:22, fontWeight:800, color:T.white }}>Courses</h1>
        <button onClick={()=>setShowAdd(!showAdd)} style={{ background:G, color:"#fff", border:"none", padding:"9px 20px", borderRadius:8, cursor:"pointer", fontWeight:600, fontSize:13 }}>+ Add Course</button>
      </div>

      {showAdd && (
        <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:14, padding:20, marginBottom:22 }}>
          <div style={{ fontWeight:600, color:T.white, marginBottom:14, fontSize:14 }}>New Course</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 }}>
            {[["name","Course Name"],["instructor","Instructor"],["credit","Credit Hours"],["capacity","Max Capacity"]].map(([k,pl]) => (
              <input key={k} type={k==="credit"||k==="capacity"?"number":"text"} placeholder={pl}
                value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})} style={inp} />
            ))}
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={handleAdd} style={{ background:T.green, color:T.bg, border:"none", padding:"8px 18px", borderRadius:7, cursor:"pointer", fontWeight:700 }}>Save</button>
            <button onClick={()=>setShowAdd(false)} style={{ background:T.border, color:T.text, border:"none", padding:"8px 18px", borderRadius:7, cursor:"pointer" }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:16 }}>
        {liveCourses.map(c => {
          const pct   = Math.round((c.students/c.capacity)*100);
          const color = DEPT_COLORS[c.dept] || T.accent;
          const full  = c.students >= c.capacity;
          return (
            <div key={c.id} onClick={()=>setPanel(c)}
              style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:14, padding:20, cursor:"pointer", transition:"all 0.2s" }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=color+"55";e.currentTarget.style.transform="translateY(-4px)";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.transform="none";}}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
                <div>
                  <div style={{ fontWeight:700, fontSize:14, color:T.white, marginBottom:3 }}>{c.name}</div>
                  <div style={{ fontSize:12, color }}>{c.instructor}</div>
                </div>
                <span style={{ background:color+"20", color, padding:"3px 9px", borderRadius:20, fontSize:11, fontWeight:600 }}>{c.credit} cr.</span>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:14 }}>
                {[["Enrolled",c.students,T.accent],["Capacity",`${c.students}/${c.capacity}`,full?T.red:T.green]].map(([l,v,cl]) => (
                  <div key={l} style={{ background:T.surface, borderRadius:8, padding:"9px 10px", textAlign:"center" }}>
                    <div style={{ fontSize:10, color:T.muted, marginBottom:3, textTransform:"uppercase", letterSpacing:1 }}>{l}</div>
                    <div style={{ fontSize:18, fontWeight:800, color:cl }}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{ height:4, background:T.border, borderRadius:4 }}>
                <div style={{ width:`${Math.min(pct,100)}%`, height:"100%", background:pct>=100?T.red:pct>=80?T.yellow:color, borderRadius:4 }} />
              </div>
              {full && <div style={{ background:T.red+"15", color:T.red, padding:6, borderRadius:7, marginTop:10, fontSize:11, textAlign:"center", fontWeight:700 }}>⚠ FULL</div>}
            </div>
          );
        })}
      </div>

      <DetailPanel item={panel} type="course" onClose={()=>setPanel(null)} onEditCapacity={handleEditCapacity} />
    </div>
  );
}