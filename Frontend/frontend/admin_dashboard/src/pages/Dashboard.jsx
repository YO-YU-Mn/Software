import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { DEPT_COLORS } from "../theme";
import { KpiCard } from "../components/KpiCard";
import axios from "axios";
import toast from 'react-hot-toast';

function NavCard({ icon, label, sub, color, onClick }) {
  const [hov, setHov] = useState(false);
  const { theme, isDark } = useTheme();
  
  const hoverBg = isDark ? `${color}18` : `${color}30`;
  const hoverBorder = isDark ? `${color}60` : `${color}80`;
  const hoverShadow = isDark ? `0 12px 32px ${color}22` : `0 12px 32px ${color}40`;

  return (
    <div
      onClick={onClick}
      onMouseEnter={()=>setHov(true)}
      onMouseLeave={()=>setHov(false)}
      className="nav-card"
      style={{
        background: hov ? hoverBg : theme.card,
        borderColor: hov ? hoverBorder : theme.border,
        boxShadow: hov ? hoverShadow : "none",
      }}
    >
      <div className="nav-card-icon">{icon}</div>
      <div className="nav-card-label" style={{ color: hov ? theme.white : theme.text }}>{label}</div>
      <div className="nav-card-sub" style={{ color: theme.muted }}>{sub}</div>
      <div className="nav-card-bar" style={{ background: hov ? color : theme.border }} />
    </div>
  );
}

function StatCard({ icon, label, value, sub, color }) {
  const [hov, setHov] = useState(false);
  const { theme, isDark } = useTheme();
  
  const hoverBorder = isDark ? `${color}40` : `${color}80`;
  const hoverShadow = isDark ? `0 8px 28px ${color}14` : `0 8px 28px ${color}30`;
  return (
    <div
      onMouseEnter={()=>setHov(true)}
      onMouseLeave={()=>setHov(false)}
      className="stat-card"
      style={{
        background: theme.card,
        borderColor: hov ? hoverBorder : theme.border,
        boxShadow: hov ? hoverShadow : "none",
      }}
    >
      <div className="stat-icon" style={{ background: `linear-gradient(135deg,${color}22,${color}10)`, borderColor: `${color}30` }}>{icon}</div>
      <div>
        <div className="stat-value" style={{ color }}>{value}</div>
        <div className="stat-label" style={{ color: theme.white }}>{label}</div>
        <div className="stat-sub" style={{ color: theme.muted }}>{sub}</div>
      </div>
    </div>
  );
}

const Card = ({ children, style={}, onClick }) => {
  const [hov,setHov] = useState(false);
  const { theme, isDark } = useTheme();
  
  const hoverBorder = isDark ? `${theme.accent}50` : `${theme.accent}80`;
  const hoverShadow = isDark ? `0 8px 32px ${theme.accent}12` : `0 8px 32px ${theme.accent}30`;

  return (
    <div
      onMouseEnter={()=>setHov(true)}
      onMouseLeave={()=>setHov(false)}
      onClick={onClick}
      className="card"
      style={{
        background: theme.card,
        borderColor: hov && onClick ? hoverBorder : theme.border,
        boxShadow: hov && onClick ? hoverShadow : "none",
        cursor: onClick ? "pointer" : "default",
        ...style
      }}
    >
      {children}
    </div>
  );
};

export function Dashboard({ setPage }) {
  const { theme, isDark, toggleTheme } = useTheme();
  const G = `linear-gradient(135deg, ${theme.accent2}, ${theme.accent})`;
  const dateStr = new Date().toLocaleDateString("en-US", { weekday:"long", year:"numeric", month:"long", day:"numeric" });

  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('يرجى تسجيل الدخول أولاً');
          return;
        }
        const [studentsRes, coursesRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/students/all`, { headers: { Authorization: token } }),
          axios.get(`${import.meta.env.VITE_API_URL}/courses/allcourses`, { headers: { Authorization: token } })
        ]);
        setStudents(studentsRes.data);
        setCourses(coursesRes.data);
      } catch (err) {
        toast.error('فشل تحميل البيانات');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p style={{ color: theme.muted, textAlign: 'center', padding: '2rem' }}> Loading...</p>;

  // حساب الإحصائيات
  const totalStudents = students.length;
  const totalCourses = courses.length;

  const liveCourses = courses.map(c => ({
    ...c,
    students: c.enrolledStudents || 0,
    id: c._id,
    name: c.title,
    dept: c.department,
    instructor: c.instructor,
    capacity: c.capacity,
    enrolled: c.enrolledStudents
  }));

  const totalEnrolled = liveCourses.reduce((acc, c) => acc + c.enrolled, 0);
  const numGpa = students.filter(s => typeof s.GPA === "number");
  const avgGpa = numGpa.length ? (numGpa.reduce((a, s) => a + s.GPA, 0) / numGpa.length).toFixed(2) : "—";

  // آخر 5 طلاب مسجلين (بناءً على createdAt)
  const recentStudents = [...students].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 7);
{ /* */}
  // نشاط وهمي مؤقتاً (يمكن تحسينه لاحقاً)
  const recentActivity = [
    { icon: "📋", color: theme.accent, text: "تم تحديث الإعدادات", time: "منذ قليل" },
    { icon: "🎓", color: theme.green, text: "تمت إضافة طالب جديد", time: "منذ ساعة" },
  ];

  return (
    <div className="p-7 flex-1 overflow-y-auto" style={{ background: theme.bg }}>
      {/* HERO SECTION */}
      <div className="dashboard-hero" style={{ borderColor: theme.border }}>
        <div className="dashboard-hero-bg" />
        <svg className="dashboard-hero-svg" width="100%" height="100%">
          <defs><pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill={theme.accent}/></pattern></defs>
          <rect width="100%" height="100%" fill="url(#dots)"/>
        </svg>
        <div className="dashboard-hero-dot">
          <div>
            <div className="live-indicator">
              <div className="live-dot" style={{ background: theme.green, boxShadow: `0 0 10px ${theme.green}` }} />
              <span className="live-text" style={{ color: theme.green }}>Live · Academic Year 2026</span>
            </div>
            <h1 className="hero-title" style={{ color: theme.white }}>
              Faculty of <span className="hero-gradient" style={{ background: G, WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", display: "inline-block" }}>Science</span>
            </h1>
            <div className="hero-date" style={{ color: theme.muted }}>{dateStr}</div>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            {/* <button onClick={()=>setPage("addStudent")} className="hero-btn" style={{ background: G }}>+ Register Student</button>*/}
            <button onClick={toggleTheme} className="hero-btn" style={{ background: theme.surface, color: theme.text, border: `1px solid ${theme.border}` }}>
              {isDark ? "🌙" : "☀️"}
            </button>
          </div>
        </div>
      </div> 

      {/* NAV CARDS */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        <NavCard icon="🎓" label="Students"        sub={`${totalStudents} registered`}           color={theme.accent} onClick={()=>setPage("students")}   />
        <NavCard icon="📚" label="Courses"          sub={`${totalCourses} sections`}              color={theme.green}  onClick={()=>setPage("courses")}    />
        <NavCard icon="📊" label="Reports"          sub="Academic stats"                          color={theme.purple} onClick={()=>setPage("reports")}    />
        <NavCard icon="➕" label="Register Student" sub="Enroll new student"                      color={theme.yellow} onClick={()=>setPage("addStudent")} />
        <NavCard icon="🔐" label="Register Admin"   sub="Admin access"                            color={theme.red}    onClick={()=>setPage("addAdmin")}   />
        <NavCard icon="🔔" label="Notifications"    sub="Send alerts"                             color={theme.orange} onClick={()=>setPage("notifications")} />
        <NavCard icon="⚙️" label="Settings"         sub="Registration control"                    color={theme.blue}   onClick={()=>setPage("settings")} />
        <NavCard icon="📰" label="News"             sub="Manage announcements"                    color={theme.teal}   onClick={()=>setPage("news")} />
      </div>

      {/* STAT STRIP */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        <KpiCard label="Total Students" value={totalStudents} color={theme.accent} icon="🎓" trend={5} spark={[8,10,9,11,13,12,totalStudents]} onClick={()=>setPage("students")} />
        <StatCard icon="📚" label="Total Enrollments" value={totalEnrolled} sub="across all courses" color={theme.accent} />
        <StatCard icon="📈" label="Avg Faculty GPA"   value={avgGpa}        sub="out of 4.0"         color={theme.purple} />
        <StatCard icon="🏫" label="Course Sections"   value={totalCourses} sub={`${liveCourses.filter(c=>c.enrolled < c.capacity).length} with open seats`} color={theme.green} />
      </div>

      {/* MAIN GRID */}
      <div className="grid" style={{ gridTemplateColumns: "1.6fr 1fr", gap: 18, marginBottom: 18 }}>
        {/* Course Enrollment Bars */}
        <Card>
          <div className="p-6">
            <div className="flex justify-between items-center mb-5">
              <div>
                <div className="font-extrabold text-base" style={{ color: theme.white }}>Course Enrollment</div>
                <div className="text-xs mt-1" style={{ color: theme.muted }}>{totalEnrolled} students across {totalCourses} courses</div>
              </div>
              <button onClick={()=>setPage("courses")} className="btn-primary px-4 py-2 text-xs" style={{ background: G }}>Manage →</button>
            </div>
            {liveCourses.slice(0, 5).map(c => {
              const capPct = c.capacity > 0 ? Math.round((c.enrolled / c.capacity) * 100) : 0;
              const color = DEPT_COLORS[c.dept] || theme.accent;
              const barColor = capPct >= 100 ? theme.red : capPct >= 80 ? theme.yellow : color;
              return (
                <div key={c.id} className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: color }} />
                      <span className="text-sm font-bold" style={{ color: theme.white }}>{c.name}</span>
                      <span className="text-xs" style={{ color: theme.muted }}>{c.instructor}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ color: barColor, background: `${barColor}18` }}>{c.enrolled}/{c.capacity}</span>
                      <span className="text-xs min-w-9 text-right" style={{ color: theme.muted }}>{capPct}%</span>
                    </div>
                  </div>
                  <div className="h-2 rounded overflow-hidden" style={{ background: theme.surface }}>
                    <div className="h-full rounded transition-all duration-500" style={{ width: `${Math.min(capPct,100)}%`, background: `linear-gradient(90deg,${barColor}90,${barColor})` }} />
                  </div>
                  {capPct >= 100 && <div className="mt-1 text-xs font-bold" style={{ color: theme.red }}>⚠ Course is full</div>}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          {/* Capacity rings */}
          <Card style={{ padding: 22 }}>
            <div className="font-extrabold mb-4" style={{ color: theme.white, fontSize: 15 }}>Capacity Overview</div>
            {liveCourses.slice(0, 5).map(c => {
              const pct = c.capacity > 0 ? Math.round((c.enrolled / c.capacity) * 100) : 0;
              const color = pct >= 100 ? theme.red : pct >= 80 ? theme.yellow : DEPT_COLORS[c.dept] || theme.green;
              const circ = 2 * Math.PI * 16;
              return (
                <div key={c.id} className="flex items-center gap-3 mb-3">
                  <div className="capacity-ring">
                    <svg className="capacity-ring-svg" viewBox="0 0 42 42">
                      <circle className="capacity-ring-bg" cx="21" cy="21" r="16" stroke={theme.border} />
                      <circle className="capacity-ring-fill" cx="21" cy="21" r="16" stroke={color}
                        strokeDasharray={`${(Math.min(pct, 100) / 100) * circ} ${circ}`} />
                    </svg>
                    <span className="capacity-ring-text" style={{ color }}>{Math.min(pct, 100)}%</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold truncate" style={{ color: theme.text }}>{c.name}</div>
                    <div className="text-xs mt-1" style={{ color: theme.muted }}>{c.enrolled}/{c.capacity} enrolled</div>
                  </div>
                  {pct >= 100 && <span className="text-xs font-extrabold px-2 py-1 rounded" style={{ color: theme.red, background: `${theme.red}15` }}>FULL</span>}
                </div>
              );
            })}
          </Card>

          {/* Activity feed */}
          <Card style={{ padding: 22, flex: 1 }}>
            <div className="font-extrabold mb-4" style={{ color: theme.white, fontSize: 15 }}>Recent Activity</div>
            {recentActivity.map((a, i) => (
              <div key={i} className="flex gap-3 py-2" style={{ borderBottom: i < recentActivity.length - 1 ? `1px solid ${theme.border}20` : "none" }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${a.color}15`, border: `1px solid ${a.color}25` }}>{a.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs truncate" style={{ color: theme.text }}>{a.text}</div>
                  <div className="text-xs mt-1" style={{ color: theme.muted }}>{a.time}</div>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>

      {/* BOTTOM ROW */}
      <div className="grid" style={{ gridTemplateColumns: "1fr 1.3fr", gap: 18 }}>
        {/* GPA Distribution */}
        <Card style={{ padding: 24 }}>
          <div className="font-extrabold mb-1" style={{ color: theme.white, fontSize: 15 }}>GPA Distribution</div>
          <div className="text-xs mb-5" style={{ color: theme.muted }}>Academic performance breakdown</div>
          <div className="flex items-center gap-5 mb-5 p-4 rounded-lg" style={{ background: `linear-gradient(135deg,${theme.purple}18,${theme.purple}08)`, border: `1px solid ${theme.purple}25` }}>
            <div className="text-5xl font-extrabold" style={{ color: theme.purple, lineHeight: 1 }}>{avgGpa}</div>
            <div>
              <div className="text-xs font-bold" style={{ color: theme.white }}>Faculty Average</div>
              <div className="text-xs mt-1" style={{ color: theme.muted }}>out of 4.0 · {numGpa.length} students</div>
              <div className="mt-2 h-1 w-24 rounded" style={{ background: theme.border }}>
                <div className="h-full rounded" style={{ width: `${numGpa.length ? (parseFloat(avgGpa) / 4) * 100 : 0}%`, background: theme.purple }} />
              </div>
            </div>
          </div>
          {[
            ["🏆 Honor Roll",    "3.7–4.0",  students.filter(s => typeof s.GPA === "number" && s.GPA >= 3.7).length,             theme.green ],
            ["📘 Good Standing", "3.0–3.69", students.filter(s => typeof s.GPA === "number" && s.GPA >= 3.0 && s.GPA < 3.7).length, theme.accent],
            ["⚠ At Risk",       "< 3.0",    students.filter(s => typeof s.GPA === "number" && s.GPA < 3.0).length,              theme.red   ],
          ].map(([lbl, range, n, c]) => (
            <div key={lbl} className="mb-3">
              <div className="flex justify-between items-center mb-1">
                <div><span className="text-xs font-semibold" style={{ color: theme.text }}>{lbl}</span><span className="text-xs ml-2" style={{ color: theme.muted }}>GPA {range}</span></div>
                <span className="text-base font-extrabold" style={{ color: c }}>{n}</span>
              </div>
              <div className="h-1.5 rounded overflow-hidden" style={{ background: theme.surface }}>
                <div className="h-full rounded" style={{ width: `${totalStudents > 0 ? (n / totalStudents) * 100 : 0}%`, background: `linear-gradient(90deg,${c}80,${c})` }} />
              </div>
            </div>
          ))}
        </Card>

        {/* Recent Students */}
        <Card style={{ padding: 24 }}>
          <div className="flex justify-between items-center mb-4">
            <div>
              <div className="font-extrabold" style={{ color: theme.white, fontSize: 15 }}>Recent Students</div>
              <div className="text-xs mt-1" style={{ color: theme.muted }}>Latest registrations</div>
            </div>
            <button onClick={()=>setPage("students")} className="btn-primary px-4 py-2 text-xs" style={{ background: G }}>View All →</button>
          </div>
          {recentStudents.map((s, i) => {
            const dc = DEPT_COLORS[s.specialization] || theme.accent;
            return (
              <div key={s.code} className="flex items-center gap-3 py-2" style={{ borderBottom: i < recentStudents.length - 1 ? `1px solid ${theme.border}30` : "none" }}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center font-extrabold flex-shrink-0" style={{ background: `linear-gradient(135deg,${dc}30,${dc}18)`, border: `1px solid ${dc}35`, color: dc }}>{s.name ? s.name[0] : '?'}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold truncate" style={{ color: theme.white }}>{s.name}</div>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs px-2 py-0.5 rounded font-semibold" style={{ background: `${dc}15`, color: dc }}>{s.specialization}</span>
                    <span className="text-xs" style={{ color: theme.muted }}>Level {s.level}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-lg font-extrabold" style={{ color: s.GPA >= 3.7 ? theme.green : s.GPA >= 3.0 ? theme.accent : theme.yellow, lineHeight: 1 }}>{s.GPA}</div>
                  <div className="text-xs mt-1" style={{ color: theme.muted }}>GPA</div>
                </div>
              </div>
            );
          })}
        </Card>
      </div>
    </div>
  );
}