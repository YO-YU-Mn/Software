import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

export function AddStudentPage({ onBack, registeredStudents, setRegisteredStudents, enrollments, setEnrollments, courses }) {
  const { theme } = useTheme();
  const G = `linear-gradient(135deg, ${theme.accent2}, ${theme.accent})`;

  const [tab, setTab]           = useState("register");
  const [regForm, setRegForm]   = useState({ name:"", email:"", code:"", dept:"", year:"" });
  const [regMsg, setRegMsg]     = useState({ type:"", text:"" });
  const [enrollForm, setEnrollForm] = useState({ studentCode:"", courseId:"" });
  const [enrollMsg, setEnrollMsg]   = useState({ type:"", text:"" });
  const [found, setFound]       = useState(null);
  const [eTab, setETab]         = useState("add");

  const liveCourses = courses.map(c => ({ ...c, students: enrollments.filter(e => e.courseId === String(c.id)).length }));
  const flash = (setter, type, text) => { setter({type,text}); setTimeout(()=>setter({type:"",text:""}), 3500); };

  const handleRegister = () => {
    if (!regForm.name||!regForm.email||!regForm.code||!regForm.dept||!regForm.year)
      return flash(setRegMsg,"err","⚠ Please fill in all required fields.");
    if (registeredStudents.find(s=>s.code===regForm.code))
      return flash(setRegMsg,"err","⚠ Student code already exists.");
    setRegisteredStudents(prev=>[...prev,{...regForm,id:Date.now(),status:"Active",gpa:0}]);
    flash(setRegMsg,"ok",`✅ "${regForm.name}" registered! Code: ${regForm.code}`);
    setRegForm({name:"",email:"",code:"",dept:"",year:""});
  };

  const lookup = code => {
    setEnrollForm(f=>({...f,studentCode:code}));
    setFound(registeredStudents.find(s=>s.code===code)||null);
  };

  const studentEnrolls = found ? enrollments.filter(e=>e.studentCode===found.code) : [];

  const handleEnroll = () => {
    if (!enrollForm.studentCode||!enrollForm.courseId) return flash(setEnrollMsg,"err","⚠ Fill all fields.");
    if (!found) return flash(setEnrollMsg,"err","⚠ Student code not found.");
    if (enrollments.find(e=>e.studentCode===enrollForm.studentCode&&e.courseId===enrollForm.courseId))
      return flash(setEnrollMsg,"err","⚠ Already enrolled.");
    const course = liveCourses.find(c=>c.id===parseInt(enrollForm.courseId));
    if (course&&course.students>=course.capacity) return flash(setEnrollMsg,"err","⚠ Course is full.");
    setEnrollments(prev=>[...prev,{...enrollForm,studentName:found.name,courseName:course?.name,id:Date.now()}]);
    flash(setEnrollMsg,"ok",`✅ "${found.name}" enrolled in "${course?.name}"`);
    setEnrollForm({studentCode:"",courseId:""}); setFound(null);
  };

  const handleRemove = () => {
    if (!enrollForm.studentCode||!enrollForm.courseId) return flash(setEnrollMsg,"err","⚠ Fill all fields.");
    if (!found) return flash(setEnrollMsg,"err","⚠ Student code not found.");
    if (!enrollments.find(e=>e.studentCode===enrollForm.studentCode&&e.courseId===enrollForm.courseId))
      return flash(setEnrollMsg,"err","⚠ Not enrolled.");
    const course = courses.find(c=>c.id===parseInt(enrollForm.courseId));
    setEnrollments(prev=>prev.filter(e=>!(e.studentCode===enrollForm.studentCode&&e.courseId===enrollForm.courseId)));
    flash(setEnrollMsg,"ok",`✅ "${found.name}" removed from "${course?.name}"`);
    setEnrollForm({studentCode:"",courseId:""}); setFound(null);
  };

  const Msg = ({m}) => m.text
    ? <div className={`message ${m.type==="ok" ? "message-success" : "message-error"}`}
        style={{ background: m.type==="ok" ? `${theme.green}18` : `${theme.red}18`, color: m.type==="ok" ? theme.green : theme.red, borderColor: m.type==="ok" ? `${theme.green}35` : `${theme.red}35` }}>
        {m.text}
      </div>
    : null;

  return (
    <div className="p-7 flex-1 overflow-y-auto" style={{ background: theme.bg }}>
      <button onClick={onBack} className="btn-back" style={{ background: theme.card, color: theme.muted, borderColor: theme.border }}>← Back</button>
      <h1 className="m-0 mb-5 text-3xl font-extrabold" style={{ color: theme.white }}>Student Registration</h1>

      {/* Main Tabs */}
      <div className="flex gap-0 mb-6" style={{ background: theme.card, borderRadius: 10, border: `1px solid ${theme.border}`, width: "fit-content" }}>
        {[["register","⊕ New Student"],["enroll","▣ Manage Enrollments"]].map(([id,label]) => (
          <button
            key={id}
            onClick={()=>setTab(id)}
            className="btn"
            style={{
              padding: "10px 26px",
              borderRadius: 9,
              background: tab===id ? G : "transparent",
              color: tab===id ? "#fff" : theme.muted,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* TAB 1: REGISTER */}
      {tab==="register" && (
        <div className="grid grid-cols-2 gap-6">
          <div className="card" style={{ background: theme.card, border: `1px solid ${theme.border}` }}>
            <div className="font-bold mb-4" style={{ color: theme.white, fontSize: 15 }}>Student Information</div>
            <Msg m={regMsg} />
            <div className="flex flex-col gap-3">
              {[["name","Full Name *","text",""],["email","Email *","email","student@sci.edu.eg"]].map(([k,l,t,ph]) => (
                <div key={k}>
                  <label className="input-label" style={{ color: theme.muted }}>{l}</label>
                  <input
                    type={t}
                    placeholder={ph}
                    value={regForm[k]}
                    onChange={e=>setRegForm(f=>({...f,[k]:e.target.value}))}
                    className="input-field"
                    style={{ background: theme.surface, border: `1px solid ${theme.border}`, color: theme.text }}
                    onFocus={e=>e.target.style.borderColor=theme.accent}
                    onBlur={e=>e.target.style.borderColor=theme.border}
                  />
                </div>
              ))}
              <div>
                <label className="input-label" style={{ color: theme.muted }}>Student Code * <span style={{ color: theme.accent, fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(unique ID)</span></label>
                <input
                  placeholder="SC-2025-001"
                  value={regForm.code}
                  onChange={e=>setRegForm(f=>({...f,code:e.target.value}))}
                  className="input-field mono"
                  style={{ background: theme.surface, border: `1px solid ${theme.border}`, color: theme.text, fontSize: 14, letterSpacing: 1 }}
                  onFocus={e=>e.target.style.borderColor=theme.accent}
                  onBlur={e=>e.target.style.borderColor=theme.border}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="input-label" style={{ color: theme.muted }}>Department *</label>
                  <select
                    value={regForm.dept}
                    onChange={e=>setRegForm(f=>({...f,dept:e.target.value}))}
                    className="input-field"
                    style={{ background: theme.surface, border: `1px solid ${theme.border}`, color: theme.text }}
                  >
                    <option value="">Select…</option>
                    {["Mathematics","Physics","Chemistry","Biology","Languages"].map(d=><option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="input-label" style={{ color: theme.muted }}>Year *</label>
                  <select
                    value={regForm.year}
                    onChange={e=>setRegForm(f=>({...f,year:e.target.value}))}
                    className="input-field"
                    style={{ background: theme.surface, border: `1px solid ${theme.border}`, color: theme.text }}
                  >
                    <option value="">Select…</option>
                    {["1st","2nd","3rd","4th"].map(y=><option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>
              <button onClick={handleRegister} className="btn btn-primary mt-1" style={{ background: G, padding: 13, fontSize: 14 }}>⊕ Register Student</button>
            </div>
          </div>

          {/* Recently Registered */}
          <div className="card" style={{ background: theme.card, border: `1px solid ${theme.border}` }}>
            <div className="font-bold mb-4" style={{ color: theme.white, fontSize: 15 }}>
              Recently Registered
              <span className="ml-2 px-2 py-1 rounded-full" style={{ background: `${theme.accent}20`, color: theme.accent, fontSize: 11 }}>{registeredStudents.length}</span>
            </div>
            {registeredStudents.length===0
              ? <div className="text-center py-9" style={{ color: theme.muted, fontSize: 13 }}>No students yet</div>
              : (
                <div className="flex flex-col gap-2 max-h-96 overflow-y-auto">
                  {[...registeredStudents].reverse().slice(0,10).map(s => (
                    <div key={s.id} className="flex justify-between items-center p-3 rounded" style={{ background: theme.surface }}>
                      <div>
                        <div className="font-semibold" style={{ color: theme.text, fontSize: 13 }}>{s.name}</div>
                        <div style={{ color: theme.muted, fontSize: 11, marginTop: 2 }}>{s.email}</div>
                      </div>
                      <div className="text-right">
                        <div className="mono px-2 py-1 rounded mb-1" style={{ fontSize: 11, color: theme.accent, background: `${theme.accent}15` }}>{s.code}</div>
                        <div style={{ fontSize: 10, color: theme.muted }}>{s.dept} · {s.year}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            }
          </div>
        </div>
      )}

      {/* TAB 2: ENROLL / REMOVE */}
      {tab==="enroll" && (
        <div className="grid grid-cols-2 gap-6">
          <div className="card" style={{ background: theme.card, border: `1px solid ${theme.border}` }}>
            {/* Sub-tabs */}
            <div className="flex gap-0 mb-5 rounded" style={{ background: theme.surface, border: `1px solid ${theme.border}` }}>
              {[["add","➕ Enroll"],["remove","🗑 Remove"]].map(([id,label]) => (
                <button
                  key={id}
                  onClick={()=>{setETab(id);setEnrollMsg({type:"",text:""}); }}
                  className="btn flex-1 py-2 rounded"
                  style={{
                    background: eTab===id ? (id==="remove" ? `${theme.red}cc` : G) : "transparent",
                    color: eTab===id ? "#fff" : theme.muted,
                    fontSize: 13,
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
            <Msg m={enrollMsg} />
            <div className="flex flex-col gap-3">
              <div>
                <label className="input-label" style={{ color: theme.muted }}>Student Code *</label>
                <input
                  placeholder="SC-2025-001"
                  value={enrollForm.studentCode}
                  onChange={e=>lookup(e.target.value)}
                  className="input-field mono"
                  style={{
                    background: theme.surface,
                    border: `1px solid ${found ? theme.green : enrollForm.studentCode ? theme.red : theme.border}`,
                    color: theme.text,
                    fontSize: 14,
                    letterSpacing: 1
                  }}
                />
                {enrollForm.studentCode && (
                  <div className="mt-2 p-3 rounded" style={{ background: found ? `${theme.green}12` : `${theme.red}12`, border: `1px solid ${found ? theme.green : theme.red}28` }}>
                    {found ? (
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0" style={{ background: G }}>{found.name[0]}</div>
                        <div>
                          <div className="font-semibold" style={{ color: theme.green, fontSize: 13 }}>{found.name}</div>
                          <div style={{ color: theme.muted, fontSize: 11 }}>{found.dept} · {found.year}</div>
                        </div>
                      </div>
                    ) : <div style={{ color: theme.red, fontSize: 12 }}>✗ Code not found in the system</div>}
                  </div>
                )}
              </div>
              <div>
                <label className="input-label" style={{ color: theme.muted }}>Course *</label>
                <select
                  value={enrollForm.courseId}
                  onChange={e=>setEnrollForm(f=>({...f,courseId:e.target.value}))}
                  className="input-field"
                  style={{ background: theme.surface, border: `1px solid ${theme.border}`, color: theme.text }}
                >
                  <option value="">Select course…</option>
                  {eTab==="remove"
                    ? studentEnrolls.map(e=>{const c=courses.find(c=>c.id===parseInt(e.courseId));return<option key={e.courseId} value={e.courseId}>{c?.name||e.courseName}</option>;})
                    : liveCourses.map(c=>(
                      <option key={c.id} value={c.id} disabled={c.students>=c.capacity}>
                        {c.name} — {c.instructor} {c.students>=c.capacity?"(Full)":`(${c.students}/${c.capacity})`}
                      </option>
                    ))
                  }
                </select>
              </div>
              <button
                onClick={eTab==="add"?handleEnroll:handleRemove}
                className="btn mt-1"
                style={{
                  background: eTab==="remove" ? theme.red : G,
                  color: "#fff",
                  padding: 13,
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                {eTab==="add" ? "▣ Enroll in Course" : "🗑 Remove from Course"}
              </button>
            </div>
          </div>

          {/* Enrollment Log */}
          <div className="card" style={{ background: theme.card, border: `1px solid ${theme.border}` }}>
            <div className="font-bold mb-4" style={{ color: theme.white, fontSize: 15 }}>
              {found ? `${found.name}'s Courses` : "Enrollment Log"}
              <span className="ml-2 px-2 py-1 rounded-full" style={{ background: `${theme.accent}20`, color: theme.accent, fontSize: 11 }}>
                {found ? studentEnrolls.length : enrollments.length}
              </span>
            </div>
            {(found ? studentEnrolls : enrollments).length === 0
              ? <div className="text-center py-9" style={{ color: theme.muted, fontSize: 13 }}>{found ? "No courses enrolled" : "No enrollments yet"}</div>
              : (
                <div className="flex flex-col gap-2 max-h-96 overflow-y-auto">
                  {[...(found ? studentEnrolls : enrollments)].reverse().map(e => (
                    <div key={e.id} className="flex justify-between items-center p-3 rounded" style={{ background: theme.surface }}>
                      <div>
                        {!found && <div className="font-semibold" style={{ color: theme.text, fontSize: 13 }}>{e.studentName}</div>}
                        <div style={{ color: theme.accent, fontSize: found ? 14 : 12, fontWeight: found ? 600 : 400, marginTop: found ? 0 : 2 }}>{e.courseName}</div>
                      </div>
                      {!found && <div className="mono" style={{ fontSize: 11, color: theme.muted }}>{e.studentCode}</div>}
                      {found && (
                        <button
                          onClick={()=>{setEnrollForm({studentCode:found.code,courseId:e.courseId});setETab("remove");}}
                          className="btn"
                          style={{ background: `${theme.red}18`, color: theme.red, border: `1px solid ${theme.red}30`, borderRadius: 6, padding: "4px 10px", fontSize: 11, fontWeight: 600 }}
                        >
                          🗑 Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )
            }
          </div>
        </div>
      )}
    </div>
  );
}