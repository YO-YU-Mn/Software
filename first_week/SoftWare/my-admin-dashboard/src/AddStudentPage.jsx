import React, { useState } from "react";
import { T, G } from "./theme";

export default function AddStudentPage({ onBack, registeredStudents, setRegisteredStudents, enrollments, setEnrollments, courses }) {
  const [tab,        setTab]        = useState("register");
  const [regForm,    setRegForm]    = useState({ name: "", email: "", code: "", dept: "", year: "" });
  const [regMsg,     setRegMsg]     = useState({ type: "", text: "" });
  const [enrollForm, setEnrollForm] = useState({ studentCode: "", courseId: "" });
  const [enrollMsg,  setEnrollMsg]  = useState({ type: "", text: "" });
  const [found,      setFound]      = useState(null);
  const [eTab,       setETab]       = useState("add");

  const liveCourses = courses.map(c => ({
    ...c,
    students: enrollments.filter(e => e.courseId === String(c.id)).length,
  }));

  const flash = (setter, type, text) => {
    setter({ type, text });
    setTimeout(() => setter({ type: "", text: "" }), 3500);
  };

  const handleRegister = () => {
    if (!regForm.name || !regForm.email || !regForm.code || !regForm.dept || !regForm.year)
      return flash(setRegMsg, "err", "⚠ Please fill in all required fields.");
    if (registeredStudents.find(s => s.code === regForm.code))
      return flash(setRegMsg, "err", "⚠ Student code already exists.");
    setRegisteredStudents(prev => [...prev, { ...regForm, id: Date.now(), status: "Active", gpa: 0 }]);
    flash(setRegMsg, "ok", `✅ "${regForm.name}" registered! Code: ${regForm.code}`);
    setRegForm({ name: "", email: "", code: "", dept: "", year: "" });
  };

  const lookup = code => {
    setEnrollForm(f => ({ ...f, studentCode: code }));
    setFound(registeredStudents.find(s => s.code === code) || null);
  };

  const studentEnrolls = found ? enrollments.filter(e => e.studentCode === found.code) : [];

  const handleEnroll = () => {
    if (!enrollForm.studentCode || !enrollForm.courseId) return flash(setEnrollMsg, "err", "⚠ Fill all fields.");
    if (!found) return flash(setEnrollMsg, "err", "⚠ Student code not found.");
    if (enrollments.find(e => e.studentCode === enrollForm.studentCode && e.courseId === enrollForm.courseId))
      return flash(setEnrollMsg, "err", "⚠ Already enrolled.");
    const course = liveCourses.find(c => c.id === parseInt(enrollForm.courseId));
    if (course && course.students >= course.capacity) return flash(setEnrollMsg, "err", "⚠ Course is full.");
    setEnrollments(prev => [...prev, { ...enrollForm, studentName: found.name, courseName: course?.name, id: Date.now() }]);
    flash(setEnrollMsg, "ok", `✅ "${found.name}" enrolled in "${course?.name}"`);
    setEnrollForm({ studentCode: "", courseId: "" });
    setFound(null);
  };

  const handleRemove = () => {
    if (!enrollForm.studentCode || !enrollForm.courseId) return flash(setEnrollMsg, "err", "⚠ Fill all fields.");
    if (!found) return flash(setEnrollMsg, "err", "⚠ Student code not found.");
    if (!enrollments.find(e => e.studentCode === enrollForm.studentCode && e.courseId === enrollForm.courseId))
      return flash(setEnrollMsg, "err", "⚠ Student not enrolled in this course.");
    const course = courses.find(c => c.id === parseInt(enrollForm.courseId));
    setEnrollments(prev => prev.filter(e => !(e.studentCode === enrollForm.studentCode && e.courseId === enrollForm.courseId)));
    flash(setEnrollMsg, "ok", `✅ "${found.name}" removed from "${course?.name}"`);
    setEnrollForm({ studentCode: "", courseId: "" });
    setFound(null);
  };

  const inp = {
    background: T.surface, border: `1px solid ${T.border}`, color: T.text,
    padding: "10px 13px", borderRadius: 8, fontSize: 13, outline: "none",
    width: "100%", boxSizing: "border-box", transition: "border 0.2s",
  };
  const lbl = {
    display: "block", color: T.muted, fontSize: 11, fontWeight: 600,
    marginBottom: 5, textTransform: "uppercase", letterSpacing: 1,
  };
  const Msg = ({ m }) => m.text
    ? <div style={{ background: (m.type === "ok" ? T.green : T.red) + "18", color: m.type === "ok" ? T.green : T.red, border: `1px solid ${(m.type === "ok" ? T.green : T.red)}35`, borderRadius: 8, padding: "10px 13px", marginBottom: 14, fontSize: 13, fontWeight: m.type === "ok" ? 600 : 400 }}>{m.text}</div>
    : null;

  return (
    <div style={{ padding: 28, flex: 1, overflowY: "auto" }}>
      <button onClick={onBack} style={{ background: T.card, color: T.muted, border: `1px solid ${T.border}`, padding: "7px 14px", borderRadius: 7, cursor: "pointer", fontSize: 12, marginBottom: 22 }}>← Back</button>
      <h1 style={{ margin: "0 0 22px", fontSize: 22, fontWeight: 800, color: T.white }}>Student Registration</h1>

      {/* Main tabs */}
      <div style={{ display: "flex", gap: 0, marginBottom: 26, background: T.card, borderRadius: 10, border: `1px solid ${T.border}`, width: "fit-content" }}>
        {[["register", "⊕ New Student"], ["enroll", "▣ Manage Enrollments"]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{ padding: "10px 26px", border: "none", borderRadius: 9, cursor: "pointer", fontSize: 13, fontWeight: 600, background: tab === id ? G : "transparent", color: tab === id ? "#fff" : T.muted, transition: "all 0.18s" }}>{label}</button>
        ))}
      </div>

      {/* ─ TAB 1: REGISTER ─ */}
      {tab === "register" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {/* Form */}
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: 26 }}>
            <div style={{ fontWeight: 700, color: T.white, fontSize: 15, marginBottom: 18 }}>Student Information</div>
            <Msg m={regMsg} />
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[["name", "Full Name *", "text", ""], ["email", "Email *", "email", "student@sci.edu.eg"]].map(([k, l, t, ph]) => (
                <div key={k}>
                  <label style={lbl}>{l}</label>
                  <input type={t} placeholder={ph} value={regForm[k]} onChange={e => setRegForm(f => ({ ...f, [k]: e.target.value }))} style={inp}
                    onFocus={e => e.target.style.borderColor = T.accent} onBlur={e => e.target.style.borderColor = T.border} />
                </div>
              ))}
              <div>
                <label style={lbl}>Student Code * <span style={{ color: T.accent, fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(unique ID)</span></label>
                <input placeholder="SC-2025-001" value={regForm.code} onChange={e => setRegForm(f => ({ ...f, code: e.target.value }))}
                  style={{ ...inp, fontFamily: "monospace", fontSize: 14, letterSpacing: 1 }}
                  onFocus={e => e.target.style.borderColor = T.accent} onBlur={e => e.target.style.borderColor = T.border} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={lbl}>Department *</label>
                  <select value={regForm.dept} onChange={e => setRegForm(f => ({ ...f, dept: e.target.value }))} style={inp}>
                    <option value="">Select…</option>
                    {["Mathematics", "Physics", "Chemistry", "Biology", "Languages"].map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label style={lbl}>Year *</label>
                  <select value={regForm.year} onChange={e => setRegForm(f => ({ ...f, year: e.target.value }))} style={inp}>
                    <option value="">Select…</option>
                    {["1st", "2nd", "3rd", "4th"].map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>
              <button onClick={handleRegister} style={{ marginTop: 2, background: G, color: "#fff", border: "none", padding: 13, borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 14, boxShadow: `0 4px 16px ${T.accent}30` }}>
                ⊕ Register Student
              </button>
            </div>
          </div>
          {/* Recently registered list */}
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: 26 }}>
            <div style={{ fontWeight: 700, color: T.white, fontSize: 15, marginBottom: 18 }}>
              Recently Registered
              <span style={{ marginLeft: 8, background: T.accent + "20", color: T.accent, padding: "2px 9px", borderRadius: 20, fontSize: 11 }}>{registeredStudents.length}</span>
            </div>
            {registeredStudents.length === 0
              ? <div style={{ textAlign: "center", color: T.muted, padding: "36px 0", fontSize: 13 }}>No students yet</div>
              : (
                <div style={{ display: "flex", flexDirection: "column", gap: 9, maxHeight: 400, overflowY: "auto" }}>
                  {[...registeredStudents].reverse().slice(0, 10).map(s => (
                    <div key={s.id} style={{ background: T.surface, borderRadius: 9, padding: "10px 13px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontWeight: 600, color: T.text, fontSize: 13 }}>{s.name}</div>
                        <div style={{ color: T.muted, fontSize: 11, marginTop: 2 }}>{s.email}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontFamily: "monospace", fontSize: 11, color: T.accent, background: T.accent + "15", padding: "2px 7px", borderRadius: 5, marginBottom: 2 }}>{s.code}</div>
                        <div style={{ fontSize: 10, color: T.muted }}>{s.dept} · {s.year}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            }
          </div>
        </div>
      )}

      {/* ─ TAB 2: ENROLL / REMOVE ─ */}
      {tab === "enroll" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {/* Action panel */}
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: 26 }}>
            {/* Sub-tabs */}
            <div style={{ display: "flex", gap: 0, marginBottom: 20, background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
              {[["add", "➕ Enroll"], ["remove", "🗑 Remove"]].map(([id, label]) => (
                <button key={id} onClick={() => { setETab(id); setEnrollMsg({ type: "", text: "" }); }}
                  style={{ flex: 1, padding: "8px 0", border: "none", borderRadius: 7, cursor: "pointer", fontSize: 13, fontWeight: 600, background: eTab === id ? (id === "remove" ? T.red + "cc" : G) : "transparent", color: eTab === id ? "#fff" : T.muted, transition: "all 0.18s" }}>
                  {label}
                </button>
              ))}
            </div>
            <Msg m={enrollMsg} />
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Code lookup */}
              <div>
                <label style={lbl}>Student Code *</label>
                <input
                  placeholder="SC-2025-001"
                  value={enrollForm.studentCode}
                  onChange={e => lookup(e.target.value)}
                  style={{ ...inp, fontFamily: "monospace", fontSize: 14, letterSpacing: 1, borderColor: found ? T.green : enrollForm.studentCode ? T.red : T.border }}
                />
                {enrollForm.studentCode && (
                  <div style={{ marginTop: 7, padding: "9px 13px", borderRadius: 8, background: found ? T.green + "12" : T.red + "12", border: `1px solid ${found ? T.green : T.red}28` }}>
                    {found ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 30, height: 30, borderRadius: "50%", background: G, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#fff", fontSize: 12, flexShrink: 0 }}>{found.name[0]}</div>
                        <div>
                          <div style={{ fontWeight: 600, color: T.green, fontSize: 13 }}>{found.name}</div>
                          <div style={{ color: T.muted, fontSize: 11 }}>{found.dept} · {found.year}</div>
                        </div>
                      </div>
                    ) : <div style={{ color: T.red, fontSize: 12 }}>✗ Code not found in the system</div>}
                  </div>
                )}
              </div>
              {/* Course select */}
              <div>
                <label style={lbl}>Course *</label>
                <select value={enrollForm.courseId} onChange={e => setEnrollForm(f => ({ ...f, courseId: e.target.value }))} style={inp}>
                  <option value="">Select course…</option>
                  {eTab === "remove"
                    ? studentEnrolls.map(e => {
                      const c = courses.find(c => c.id === parseInt(e.courseId));
                      return <option key={e.courseId} value={e.courseId}>{c?.name || e.courseName}</option>;
                    })
                    : liveCourses.map(c => (
                      <option key={c.id} value={c.id} disabled={c.students >= c.capacity}>
                        {c.name} — {c.instructor} {c.students >= c.capacity ? "(Full)" : `(${c.students}/${c.capacity})`}
                      </option>
                    ))
                  }
                </select>
              </div>
              <button
                onClick={eTab === "add" ? handleEnroll : handleRemove}
                style={{ marginTop: 2, background: eTab === "remove" ? T.red : G, color: "#fff", border: "none", padding: 13, borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 14 }}
              >
                {eTab === "add" ? "▣ Enroll in Course" : "🗑 Remove from Course"}
              </button>
            </div>
          </div>

          {/* Enrollment log */}
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: 26 }}>
            <div style={{ fontWeight: 700, color: T.white, fontSize: 15, marginBottom: 18 }}>
              {found ? `${found.name}'s Courses` : "Enrollment Log"}
              <span style={{ marginLeft: 8, background: T.accent + "20", color: T.accent, padding: "2px 9px", borderRadius: 20, fontSize: 11 }}>
                {found ? studentEnrolls.length : enrollments.length}
              </span>
            </div>
            {(found ? studentEnrolls : enrollments).length === 0
              ? <div style={{ textAlign: "center", color: T.muted, padding: "36px 0", fontSize: 13 }}>{found ? "No courses enrolled" : "No enrollments yet"}</div>
              : (
                <div style={{ display: "flex", flexDirection: "column", gap: 9, maxHeight: 400, overflowY: "auto" }}>
                  {[...(found ? studentEnrolls : enrollments)].reverse().map(e => (
                    <div key={e.id} style={{ background: T.surface, borderRadius: 9, padding: "10px 13px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        {!found && <div style={{ fontWeight: 600, color: T.text, fontSize: 13 }}>{e.studentName}</div>}
                        <div style={{ color: T.accent, fontSize: found ? 14 : 12, fontWeight: found ? 600 : 400, marginTop: found ? 0 : 2 }}>{e.courseName}</div>
                      </div>
                      {!found && <div style={{ fontFamily: "monospace", fontSize: 11, color: T.muted }}>{e.studentCode}</div>}
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
