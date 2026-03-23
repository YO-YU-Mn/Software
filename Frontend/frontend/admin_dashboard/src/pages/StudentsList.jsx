import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { DEPT_COLORS } from "../theme";
import { DetailPanel } from "../components/DetailPanel";
import axios from "axios";
import toast from 'react-hot-toast';

export function StudentsList({ setPage }) {
  const { theme } = useTheme();
  const [students, setStudents] = useState([]);
  const [filterSpecialization, setFilterSpecialization] = useState("");
  const [search, setSearch] = useState("");
  const [panel, setPanel] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('يرجى تسجيل الدخول أولاً');
        return;
      }
      const res = await axios.get('http://localhost:9000/students/all', {
        headers: { Authorization: token }
      });
      setStudents(res.data);
    } catch (err) {
      console.error(err);
      toast.error('فشل تحميل الطلاب');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const specializationOptions = [...new Set(students.map(s => s.specialization).filter(Boolean))];

  const filtered = students.filter(s =>
    (!filterSpecialization || s.specialization === filterSpecialization) &&
    (!search || 
      (s.name && s.name.toLowerCase().includes(search.toLowerCase())) || 
      (s.email && s.email.toLowerCase().includes(search.toLowerCase())) ||
      (s.code && s.code.toString().includes(search))
    )
  );

  if (loading) return <p style={{ color: theme.muted, textAlign: 'center', padding: '2rem' }}>جاري التحميل...</p>;

  return (
    <div className="p-7 flex-1 overflow-y-auto" style={{ background: theme.bg }}>
      <button onClick={() => setPage("dashboard")} className="btn-back" style={{ background: theme.card, color: theme.muted, borderColor: theme.border }}>
        ← Back
      </button>
      <h1 className="m-0 mb-5 text-3xl font-extrabold" style={{ color: theme.white }}>Students</h1>

      <div className="card" style={{ background: theme.card, borderColor: theme.border, padding: 20 }}>
        <div className="flex gap-2 mb-4 flex-wrap items-center">
          <input
            placeholder="Search by Name or Code"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field flex-1 min-w-44"
            style={{ background: theme.card, borderColor: theme.border, color: theme.text }}
          />
          <select
            value={filterSpecialization}
            onChange={e => setFilterSpecialization(e.target.value)}
            className="input-field"
            style={{ background: theme.card, borderColor: theme.border, color: theme.text }}
          >
            <option value="">جميع التخصصات</option>
            {specializationOptions.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <div className="btn-primary px-4 py-2 text-sm font-bold rounded" style={{ background: `linear-gradient(135deg, ${theme.accent2}, ${theme.accent})`, color: "#fff" }}>
            {filtered.length} Student
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              {["code", "name", "level", "Department", "semester", "GPA"].map(h => (
                <th key={h} style={{ color: theme.muted, borderColor: theme.border }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr
                key={s.code}
                onClick={() => setPanel(s)}
                className="cursor-pointer"
                onMouseEnter={e => e.currentTarget.style.background = theme.surface}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                style={{ borderColor: `${theme.border}20` }}
              >
                <td className="mono" style={{ color: theme.muted, fontSize: 11 }}>{s.code}</td>
                <td style={{ color: theme.text, fontWeight: 600, fontSize: 13 }}>{s.name}</td>
            <td style={{ color: theme.muted, fontSize: 12 }}>{s.level}</td>
                <td style={{ fontSize: 12 }}><span style={{ color: DEPT_COLORS[s.specialization] || theme.accent, fontWeight: 500 }}>{s.specialization}</span></td>
                <td style={{ color: theme.muted, fontSize: 12 }}>{s.semester}</td>
                <td style={{ fontWeight: 700, fontSize: 13, color: s.GPA >= 3.7 ? theme.green : s.GPA >= 3.0 ? theme.accent : theme.yellow }}>{s.GPA}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

     <DetailPanel 
  key={panel?.code}  // إضافة key فريد
  item={panel} 
  type="student" 
  onClose={() => setPanel(null)} 
  onRefresh={fetchStudents} 
/>
    </div>
  );
}