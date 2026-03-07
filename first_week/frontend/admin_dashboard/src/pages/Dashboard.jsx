import { useState } from "react";
import { T, G, DEPT_COLORS } from "../theme";
import { KpiCard } from "../components/KpiCard";

function NavCard({ icon, label, sub, color, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ background:hov?color+"18":T.card, border:`1px solid ${hov?color+"60":T.border}`, borderRadius:18,
        padding:"18px 14px", cursor:"pointer", transition:"all 0.2s", transform:hov?"translateY(-4px)":"none",
        boxShadow:hov?`0 12px 32px ${color}22`:"none", textAlign:"center" }}>
      <div style={{ fontSize:26, marginBottom:8 }}>{icon}</div>
      <div style={{ fontSize:13, fontWeight:700, color:hov?T.white:T.text, marginBottom:3 }}>{label}</div>
      <div style={{ fontSize:10, color:T.muted }}>{sub}</div>
      <div style={{ marginTop:10, height:2, background:hov?color:T.border, borderRadius:2, transition:"all 0.2s" }} />
    </div>
  );
}

function StatCard({ icon, label, value, sub, color }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ background:T.card, border:`1px solid ${hov?color+"40":T.border}`, borderRadius:18, padding:"18px 20px",
        display:"flex", alignItems:"center", gap:14, transition:"all 0.2s", boxShadow:hov?`0 8px 28px ${color}14`:"none" }}>
      <div style={{ width:50, height:50, borderRadius:14, background:`linear-gradient(135deg,${color}22,${color}10)`,
        border:`1px solid ${color}30`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>{icon}</div>
      <div>
        <div style={{ fontSize:22, fontWeight:900, color, lineHeight:1, marginBottom:2 }}>{value}</div>
        <div style={{ fontSize:12, fontWeight:600, color:T.white, marginBottom:1 }}>{label}</div>
        <div style={{ fontSize:10, color:T.muted }}>{sub}</div>
      </div>
    </div>
  );
}

export function Dashboard({ students, courses, enrollments, setPage }) {
  const liveCourses = courses.map(c => ({ ...c, students: enrollments.filter(e => e.courseId === String(c.id)).length }));
  const total       = students.length;
  const numGpa      = students.filter(s => typeof s.gpa === "number");
  const avgGpa      = numGpa.length ? (numGpa.reduce((a,s) => a+s.gpa, 0) / numGpa.length).toFixed(2) : "—";
  const totalEnrolled = liveCourses.reduce((a,c) => a+c.students, 0);
  const dateStr     = new Date().toLocaleDateString("en-US", { weekday:"long", year:"numeric", month:"long", day:"numeric" });
  const sparks      = { total: [8,10,9,11,13,12,total] };
  const recentActivity = [
    ...enrollments.slice(-5).reverse().map(e => ({ icon:"📋", color:T.accent, text:`${e.studentName} enrolled in ${e.courseName}`, time:"just now" })),
    ...students.filter(s => s.status==="Honor Roll").slice(0,2).map(s => ({ icon:"⭐", color:T.yellow, text:`${s.name} achieved Honor Roll`, time:"today" })),
  ].slice(0,6);

  const Card = ({ children, style={}, onClick }) => {
    const [hov,setHov] = useState(false);
    return (
      <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} onClick={onClick}
        style={{ background:T.card, borderRadius:20, border:`1px solid ${hov&&onClick?T.accent+"50":T.border}`,
          boxShadow:hov&&onClick?`0 8px 32px rgba(56,189,248,0.12)`:"none", transition:"all 0.2s",
          cursor:onClick?"pointer":"default", ...style }}>
        {children}
      </div>
    );
  };

  return (
    <div style={{ padding:"28px", flex:1, overflowY:"auto", background:T.bg }}>

      {/* ── HERO ── */}
      <div style={{ position:"relative", borderRadius:24, overflow:"hidden", marginBottom:22, padding:"26px 32px", background:"linear-gradient(135deg,#0c1f3f 0%,#061428 50%,#080f1e 100%)", border:`1px solid ${T.border}` }}>
        <div style={{ position:"absolute", top:-60, right:-60, width:220, height:220, borderRadius:"50%", background:"#38bdf808", pointerEvents:"none" }} />
        <svg style={{ position:"absolute", inset:0, opacity:0.03 }} width="100%" height="100%">
          <defs><pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#38bdf8"/></pattern></defs>
          <rect width="100%" height="100%" fill="url(#dots)"/>
        </svg>
        <div style={{ position:"relative", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
              <div style={{ width:6, height:6, borderRadius:"50%", background:T.green, boxShadow:`0 0 10px ${T.green}` }} />
              <span style={{ fontSize:11, color:T.green, fontWeight:600, letterSpacing:2, textTransform:"uppercase" }}>Live · Academic Year 2025</span>
            </div>
            <h1 style={{ margin:"0 0 6px", fontSize:30, fontWeight:900, color:T.white, letterSpacing:-1 }}>
              Faculty of <span style={{ background:G, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Science</span>
            </h1>
            <div style={{ fontSize:13, color:T.muted }}>{dateStr}</div>
          </div>
          <button onClick={()=>setPage("addStudent")} style={{ background:G, color:"#fff", border:"none", borderRadius:12, padding:"10px 20px", cursor:"pointer", fontSize:13, fontWeight:700, boxShadow:`0 4px 20px ${T.accent}40` }}>
            + Register Student
          </button>
        </div>
      </div>

      {/* ── NAV CARDS ── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:12, marginBottom:20 }}>
        <NavCard icon="🎓" label="Students"        sub={`${total} registered`}           color={T.accent} onClick={()=>setPage("students")}   />
        <NavCard icon="📚" label="Courses"          sub={`${liveCourses.length} sections`} color={T.green}  onClick={()=>setPage("courses")}    />
        <NavCard icon="📊" label="Reports"          sub="Academic stats"                  color={T.purple} onClick={()=>setPage("reports")}    />
        <NavCard icon="➕" label="Register Student" sub="Enroll new student"              color={T.yellow} onClick={()=>setPage("addStudent")} />
        <NavCard icon="🔐" label="Register Admin"   sub="Admin access"                    color={T.red}    onClick={()=>setPage("addAdmin")}   />
      </div>

      {/* ── STAT STRIP ── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
        <KpiCard label="Total Students" value={total} color={T.accent} icon="🎓" trend={5} spark={sparks.total} onClick={()=>setPage("students")} />
        <StatCard icon="📚" label="Total Enrollments" value={totalEnrolled} sub="across all courses" color={T.accent} />
        <StatCard icon="📈" label="Avg Faculty GPA"   value={avgGpa}        sub="out of 4.0"         color={T.purple} />
        <StatCard icon="🏫" label="Course Sections"   value={liveCourses.length} sub={`${liveCourses.filter(c=>c.students<c.capacity).length} with open seats`} color={T.green} />
      </div>

      {/* ── MAIN GRID ── */}
      <div style={{ display:"grid", gridTemplateColumns:"1.6fr 1fr", gap:18, marginBottom:18 }}>

        {/* Course Enrollment Bars */}
        <Card>
          <div style={{ padding:"22px 24px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22 }}>
              <div>
                <div style={{ fontWeight:800, color:T.white, fontSize:16 }}>Course Enrollment</div>
                <div style={{ fontSize:12, color:T.muted, marginTop:3 }}>{totalEnrolled} students across {liveCourses.length} courses</div>
              </div>
              <button onClick={()=>setPage("courses")} style={{ background:G, color:"#fff", border:"none", borderRadius:10, padding:"7px 16px", cursor:"pointer", fontSize:12, fontWeight:700 }}>Manage →</button>
            </div>
            {liveCourses.map(c => {
              const capPct  = c.capacity>0 ? Math.round((c.students/c.capacity)*100) : 0;
              const color   = DEPT_COLORS[c.dept] || T.accent;
              const barColor= capPct>=100?T.red:capPct>=80?T.yellow:color;
              return (
                <div key={c.id} style={{ marginBottom:18 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{ width:10, height:10, borderRadius:3, background:color, flexShrink:0 }} />
                      <span style={{ fontSize:13, color:T.white, fontWeight:700 }}>{c.name}</span>
                      <span style={{ fontSize:11, color:T.muted }}>{c.instructor}</span>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <span style={{ fontSize:12, color:barColor, fontWeight:700, background:barColor+"18", padding:"2px 10px", borderRadius:20 }}>{c.students}/{c.capacity}</span>
                      <span style={{ fontSize:12, color:T.muted, minWidth:36, textAlign:"right" }}>{capPct}%</span>
                    </div>
                  </div>
                  <div style={{ height:8, background:T.surface, borderRadius:8, overflow:"hidden" }}>
                    <div style={{ width:`${Math.min(capPct,100)}%`, height:"100%", background:`linear-gradient(90deg,${barColor}90,${barColor})`, borderRadius:8, transition:"width 0.8s ease" }} />
                  </div>
                  {capPct>=100 && <div style={{ marginTop:5, fontSize:10, color:T.red, fontWeight:700 }}>⚠ Course is full</div>}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Right column */}
        <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
          {/* Capacity rings */}
          <Card style={{ padding:22 }}>
            <div style={{ fontWeight:800, color:T.white, fontSize:15, marginBottom:16 }}>Capacity Overview</div>
            {liveCourses.map(c => {
              const pct  = c.capacity>0 ? Math.round((c.students/c.capacity)*100) : 0;
              const color= pct>=100?T.red:pct>=80?T.yellow:DEPT_COLORS[c.dept]||T.green;
              const circ = 2*Math.PI*16;
              return (
                <div key={c.id} style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
                  <div style={{ position:"relative", width:42, height:42, flexShrink:0 }}>
                    <svg width="42" height="42" viewBox="0 0 42 42" style={{ transform:"rotate(-90deg)" }}>
                      <circle cx="21" cy="21" r="16" fill="none" stroke={T.border} strokeWidth="4" />
                      <circle cx="21" cy="21" r="16" fill="none" stroke={color} strokeWidth="4"
                        strokeDasharray={`${(Math.min(pct,100)/100)*circ} ${circ}`} strokeLinecap="round" />
                    </svg>
                    <span style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:8, fontWeight:900, color }}>{Math.min(pct,100)}%</span>
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:12, fontWeight:700, color:T.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.name}</div>
                    <div style={{ fontSize:11, color:T.muted, marginTop:2 }}>{c.students}/{c.capacity} enrolled</div>
                  </div>
                  {pct>=100 && <span style={{ fontSize:9, color:T.red, fontWeight:800, background:T.red+"15", padding:"2px 7px", borderRadius:8 }}>FULL</span>}
                </div>
              );
            })}
          </Card>

          {/* Activity feed */}
          <Card style={{ padding:22, flex:1 }}>
            <div style={{ fontWeight:800, color:T.white, fontSize:15, marginBottom:16 }}>Recent Activity</div>
            {recentActivity.map((a,i) => (
              <div key={i} style={{ display:"flex", gap:12, padding:"10px 0", borderBottom:i<recentActivity.length-1?`1px solid ${T.border}20`:"none" }}>
                <div style={{ width:32, height:32, borderRadius:10, background:a.color+"15", border:`1px solid ${a.color}25`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0 }}>{a.icon}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:12, color:T.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{a.text}</div>
                  <div style={{ fontSize:10, color:T.muted, marginTop:2 }}>{a.time}</div>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>

      {/* ── BOTTOM ROW ── */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1.3fr", gap:18 }}>
        {/* GPA Distribution */}
        <Card style={{ padding:24 }}>
          <div style={{ fontWeight:800, color:T.white, fontSize:15, marginBottom:6 }}>GPA Distribution</div>
          <div style={{ fontSize:11, color:T.muted, marginBottom:20 }}>Academic performance breakdown</div>
          <div style={{ display:"flex", alignItems:"center", gap:20, marginBottom:22, padding:"16px 20px", background:`linear-gradient(135deg,${T.purple}18,${T.purple}08)`, borderRadius:16, border:`1px solid ${T.purple}25` }}>
            <div style={{ fontSize:52, fontWeight:900, color:T.purple, lineHeight:1 }}>{avgGpa}</div>
            <div>
              <div style={{ fontSize:12, color:T.white, fontWeight:700 }}>Faculty Average</div>
              <div style={{ fontSize:11, color:T.muted, marginTop:2 }}>out of 4.0 · {numGpa.length} students</div>
              <div style={{ marginTop:8, height:4, width:90, background:T.border, borderRadius:4 }}>
                <div style={{ width:`${numGpa.length?(parseFloat(avgGpa)/4)*100:0}%`, height:"100%", background:T.purple, borderRadius:4 }} />
              </div>
            </div>
          </div>
          {[
            ["🏆 Honor Roll",    "3.7–4.0",  students.filter(s=>typeof s.gpa==="number"&&s.gpa>=3.7).length,             T.green ],
            ["📘 Good Standing", "3.0–3.69", students.filter(s=>typeof s.gpa==="number"&&s.gpa>=3.0&&s.gpa<3.7).length, T.accent],
            ["⚠ At Risk",       "< 3.0",    students.filter(s=>typeof s.gpa==="number"&&s.gpa<3.0).length,              T.red   ],
          ].map(([lbl,range,n,c]) => (
            <div key={lbl} style={{ marginBottom:14 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                <div><span style={{ fontSize:12, color:T.text, fontWeight:600 }}>{lbl}</span><span style={{ fontSize:10, color:T.muted, marginLeft:8 }}>GPA {range}</span></div>
                <span style={{ fontSize:16, fontWeight:800, color:c }}>{n}</span>
              </div>
              <div style={{ height:6, background:T.surface, borderRadius:6, overflow:"hidden" }}>
                <div style={{ width:`${total>0?(n/total)*100:0}%`, height:"100%", background:`linear-gradient(90deg,${c}80,${c})`, borderRadius:6 }} />
              </div>
            </div>
          ))}
        </Card>

        {/* Recent Students */}
        <Card style={{ padding:24 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
            <div>
              <div style={{ fontWeight:800, color:T.white, fontSize:15 }}>Recent Students</div>
              <div style={{ fontSize:11, color:T.muted, marginTop:3 }}>Latest registrations</div>
            </div>
            <button onClick={()=>setPage("students")} style={{ background:G, color:"#fff", border:"none", borderRadius:10, padding:"7px 16px", cursor:"pointer", fontSize:12, fontWeight:700 }}>View All →</button>
          </div>
          {students.slice(0,7).map((s,i) => {
            const dc = DEPT_COLORS[s.dept] || T.accent;
            return (
              <div key={s.id} style={{ display:"flex", alignItems:"center", gap:14, padding:"10px 0", borderBottom:i<6?`1px solid ${T.border}30`:"none" }}>
                <div style={{ width:36, height:36, borderRadius:12, background:`linear-gradient(135deg,${dc}30,${dc}18)`, border:`1px solid ${dc}35`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:800, color:dc, flexShrink:0 }}>{s.name[0]}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:T.white, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{s.name}</div>
                  <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:2 }}>
                    <span style={{ fontSize:10, color:dc, background:dc+"15", padding:"1px 7px", borderRadius:8, fontWeight:600 }}>{s.dept}</span>
                    <span style={{ fontSize:10, color:T.muted }}>{s.year} year</span>
                  </div>
                </div>
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <div style={{ fontSize:18, fontWeight:900, color:s.gpa>=3.7?T.green:s.gpa>=3.0?T.accent:T.yellow, lineHeight:1 }}>{s.gpa}</div>
                  <div style={{ fontSize:9, color:T.muted, marginTop:2 }}>GPA</div>
                </div>
              </div>
            );
          })}
        </Card>
      </div>
    </div>
  );
}