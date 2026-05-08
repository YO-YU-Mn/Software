import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { DetailPanel } from "../components/DetailPanel";
import axios from "axios";
import toast from 'react-hot-toast';

export function Reports({ setPage }) {
  const { theme } = useTheme();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [panel, setPanel] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/students/all`, {
          headers: { Authorization: token }
        });
        setStudents(res.data);
      } catch (err) {
        toast.error('فشل تحميل الطلاب');
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  if (loading) return <p style={{ color: theme.muted }}>جاري التحميل...</p>;

  const totalStudents = students.length;
  const studentsWithGPA = students.filter(s => typeof s.GPA === 'number');
  const avgGPA = studentsWithGPA.length ? (studentsWithGPA.reduce((a, s) => a + s.GPA, 0) / studentsWithGPA.length).toFixed(2) : '—';
  const topStudents = [...students].sort((a, b) => b.GPA - a.GPA).slice(0, 3);
  const statusCounts = {
    'Honor Roll': students.filter(s => s.GPA >= 3.7).length,
    'Good Standing': students.filter(s => s.GPA >= 3.0 && s.GPA < 3.7).length,
    'At Risk': students.filter(s => s.GPA < 3.0).length
  };

  return (
    <div className="p-7 flex-1 overflow-y-auto" style={{ background: theme.bg }}>
      <button onClick={() => setPage("dashboard")} className="btn-back" style={{ background: theme.card, color: theme.muted, borderColor: theme.border }}>← Back</button>
      <h1 className="m-0 mb-5 text-3xl font-extrabold" style={{ color: theme.white }}>Academic Reports</h1>

      <div className="grid grid-cols-2 gap-4">
        {/* Status Distribution */}
        <div className="card" style={{ background: theme.card, borderColor: theme.border, padding: 22 }}>
          <div className="font-bold mb-4" style={{ color: theme.white, fontSize: 15 }}>Status Distribution</div>
          {Object.entries(statusCounts).map(([status, count]) => (
            <div key={status} className="flex items-center justify-between py-2" style={{ borderBottom: `1px solid ${theme.border}20` }}>
              <span className="text-sm" style={{ color: theme.text }}>{status}</span>
              <span className="text-sm font-bold" style={{ color: theme.accent }}>{count}</span>
            </div>
          ))}
        </div>

        {/* Avg GPA */}
        <div className="card flex flex-col items-center justify-center" style={{ background: theme.card, borderColor: theme.border, padding: 22 }}>
          <div className="font-bold mb-3" style={{ color: theme.white, fontSize: 15 }}>Faculty Average GPA</div>
          <div className="text-7xl font-extrabold" style={{ color: theme.purple, lineHeight: 1 }}>{avgGPA}</div>
          <div className="text-sm mt-2" style={{ color: theme.muted }}>out of 4.0</div>
        </div>

        {/* Top Students */}
        <div className="card col-span-2" style={{ background: theme.card, borderColor: theme.border, padding: 22 }}>
          <div className="font-bold mb-4" style={{ color: theme.white, fontSize: 15 }}>Top Performing Students</div>
          <div className="flex gap-3">
            {topStudents.map((s, i) => (
              <div key={s.code} className="flex-1 p-4 rounded-lg cursor-pointer hover:-translate-y-1" style={{ background: theme.surface, borderTop: `3px solid ${[theme.yellow, theme.muted, '#cd7f32'][i]}` }} onClick={() => setPanel(s)}>
                <div className="text-2xl mb-2">{['🥇','🥈','🥉'][i]}</div>
                <div className="font-bold mb-1" style={{ color: theme.white }}>{s.name}</div>
                <div className="text-xs mb-3" style={{ color: theme.muted }}>{s.specialization}</div>
                <div className="text-2xl font-extrabold" style={{ color: theme.green }}>{s.GPA}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <DetailPanel item={panel} type="student" onClose={() => setPanel(null)} />
    </div>
  );
}