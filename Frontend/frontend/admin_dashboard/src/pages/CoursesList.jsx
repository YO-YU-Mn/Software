import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { DEPT_COLORS } from "../theme";
import { DetailPanel } from "../components/DetailPanel";
import axios from "axios";
import toast from 'react-hot-toast';
import Select from 'react-select';

export function CoursesList({ setPage }) {
  const { theme } = useTheme();
  const G = `linear-gradient(135deg, ${theme.accent2}, ${theme.accent})`;

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [allCourses, setAllCourses] = useState([]);

  const [form, setForm] = useState({ 
    course_id: "", title: "", credits: "", instructor: "", department: "", 
    level: "", semester: "", capacity: "", prerequisites: [], schedule: [] 
  });
  const [newSchedule, setNewSchedule] = useState({ day: "", time: "", location: "" });
  const [panel, setPanel] = useState(null);

  const days = ["Sunday", "Monday", "Tuesday", "Wendsday", "Thursday", "Friday", "Saturday"];
  const times = ["08:00-10:00", "10:00-12:00", "12:00-14:00", "14:00-16:00", "16:00-18:00", "18:00-20:00"];

  const fetchAllCourses = async () => {
  try {
    const token = localStorage.getItem('token');
    const res = await axios.get('http://localhost:9000/courses/allcourses', { headers: { Authorization: token } });
    setAllCourses(res.data);
    console.log('Loaded courses for prerequisites:', res.data); // للتأكد
  } catch (err) {
    console.error(err);
    toast.error('فشل تحميل قائمة الكورسات');
  }
};

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:9000/courses/allcourses', { headers: { Authorization: token } });
      setCourses(res.data);
    } catch (err) {
      toast.error('فشل تحميل الكورسات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchAllCourses();
  }, []);

  const addScheduleItem = () => {
    if (!newSchedule.day || !newSchedule.time) {
      toast.error("يرجى اختيار اليوم والوقت");
      return;
    }
    setForm({
      ...form,
      schedule: [...form.schedule, { day: newSchedule.day, time: newSchedule.time, location: newSchedule.location || "غير محدد" }]
    });
    setNewSchedule({ day: "", time: "", location: "" });
  };

  const removeScheduleItem = (index) => {
    const newList = [...form.schedule];
    newList.splice(index, 1);
    setForm({ ...form, schedule: newList });
  };

  const handlePrerequisiteChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    setForm({ ...form, prerequisites: selected });
  };

  const handleAdd = async () => {
    if (!form.course_id || !form.title || !form.credits || !form.instructor || !form.department || !form.level || !form.semester || !form.capacity) {
      toast.error('جميع الحقول المطلوبة يجب ملؤها');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const payload = {
        course_id: form.course_id,
        title: form.title,
        credits: Number(form.credits),
        instructor: form.instructor,
        department: form.department,
        level: Number(form.level),
        semester: Number(form.semester),
        capacity: Number(form.capacity),
        prerequisites: form.prerequisites,
        schedule: form.schedule
      };
      await axios.post('http://localhost:9000/courses/addCourse', payload, { headers: { Authorization: token } });
      toast.success('تمت إضافة المادة بنجاح');
      setShowAdd(false);
      setForm({ course_id: "", title: "", credits: "", instructor: "", department: "", level: "", semester: "", capacity: "", prerequisites: [], schedule: [] });
      fetchCourses();
      fetchAllCourses();
    } catch (err) {
      toast.error('فشل إضافة المادة');
    }
  };

  const handleEditCapacity = async (id, val) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:9000/courses/updateCourse/${id}`, { capacity: val }, { headers: { Authorization: token } });
      toast.success('تم تحديث السعة');
      fetchCourses();
    } catch (err) {
      toast.error('فشل التحديث');
    }
  };

  if (loading) return <p style={{ color: theme.muted, textAlign: 'center', padding: '2rem' }}>جاري التحميل...</p>;

  return (
    <div className="p-7 flex-1 overflow-y-auto" style={{ background: theme.bg }}>
      <button onClick={() => setPage("dashboard")} className="btn-back" style={{ background: theme.card, color: theme.muted, borderColor: theme.border }}>
        ← Back
      </button>

      <div className="flex justify-between items-center mb-5">
        <h1 className="m-0 text-3xl font-extrabold" style={{ color: theme.white }}>Courses</h1>
        {!showAdd && (
          <button onClick={() => setShowAdd(true)} className="btn-primary px-5 py-2 text-sm" style={{ background: G }}>+ Add Course</button>
        )}
      </div>


      

      {showAdd && (
        <div className="card mb-5" style={{ background: theme.card, borderColor: theme.border, padding: 20 }}>
          <div className="font-semibold mb-3" style={{ color: theme.white, fontSize: 14 }}>New Course</div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <input placeholder="Course ID *" value={form.course_id} onChange={e => setForm({...form, course_id: e.target.value})} className="input-field" style={{ background: theme.surface, borderColor: theme.border, color: theme.text }} />
            <input placeholder="Title *" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="input-field" style={{ background: theme.surface, borderColor: theme.border, color: theme.text }} />
            <input placeholder="Credits *" type="number" value={form.credits} onChange={e => setForm({...form, credits: e.target.value})} className="input-field" style={{ background: theme.surface, borderColor: theme.border, color: theme.text }} />
            <input placeholder="Instructor *" value={form.instructor} onChange={e => setForm({...form, instructor: e.target.value})} className="input-field" style={{ background: theme.surface, borderColor: theme.border, color: theme.text }} />
            <input placeholder="Department *" value={form.department} onChange={e => setForm({...form, department: e.target.value})} className="input-field" style={{ background: theme.surface, borderColor: theme.border, color: theme.text }} />
            <input placeholder="Level *" type="number" value={form.level} onChange={e => setForm({...form, level: e.target.value})} className="input-field" style={{ background: theme.surface, borderColor: theme.border, color: theme.text }} />
            <input placeholder="Semester *" type="number" value={form.semester} onChange={e => setForm({...form, semester: e.target.value})} className="input-field" style={{ background: theme.surface, borderColor: theme.border, color: theme.text }} />
            <input placeholder="Capacity *" type="number" value={form.capacity} onChange={e => setForm({...form, capacity: e.target.value})} className="input-field" style={{ background: theme.surface, borderColor: theme.border, color: theme.text }} />
          </div>

         <div className="mb-3">
  <label className="input-label" style={{ color: theme.muted }}>Prerequisites </label>
  <Select
    isMulti
    options={allCourses.map(c => ({ value: c.course_id, label: `${c.course_id} - ${c.title}` }))}
    value={form.prerequisites.map(p => {
      const found = allCourses.find(c => c.course_id === p);
      return { value: p, label: found ? `${found.course_id} - ${found.title}` : p };
    })}
    onChange={(selected) => {
      setForm({ ...form, prerequisites: selected.map(s => s.value) });
    }}
    placeholder={allCourses.length === 0 ? "جاري تحميل المواد..." : "  choose prerequisites ..."}
    isLoading={allCourses.length === 0}
    noOptionsMessage={() => "لا توجد مواد متاحة"}
    styles={{
      control: (base, { isFocused }) => ({
        ...base,
        background: theme.surface,
        borderColor: isFocused ? theme.accent : theme.border,
        boxShadow: 'none',
        '&:hover': { borderColor: theme.accent },
        minHeight: '42px',
      }),
      menu: (base) => ({
        ...base,
        background: theme.surface,
        zIndex: 1000,
      }),
      option: (base, { isFocused, isSelected }) => ({
        ...base,
        background: isSelected ? theme.accent : (isFocused ? `${theme.accent}30` : theme.surface),
        color: theme.text,
      }),
      multiValue: (base) => ({
        ...base,
        background: `${theme.accent}20`,
        borderRadius: '6px',
      }),
      multiValueLabel: (base) => ({
        ...base,
        color: theme.text,
        fontSize: '12px',
      }),
      multiValueRemove: (base) => ({
        ...base,
        color: theme.muted,
        ':hover': {
          background: theme.red,
          color: '#fff',
        },
      }),
      placeholder: (base) => ({
        ...base,
        color: theme.muted,
      }),
      input: (base) => ({
        ...base,
        color: theme.text,
      }),
    }}
  />
</div>

          {/* Schedule */}
          <div className="mb-3">
            <label className="input-label" style={{ color: theme.muted }}>Schedule </label>
            <div className="flex gap-2 mb-2">
              <select value={newSchedule.day} onChange={e => setNewSchedule({...newSchedule, day: e.target.value})} className="input-field flex-1" style={{ background: theme.surface, borderColor: theme.border, color: theme.text }}>
                <option value=""> Choose Day</option>
                {days.map(day => <option key={day} value={day}>{day}</option>)}
              </select>
              <select value={newSchedule.time} onChange={e => setNewSchedule({...newSchedule, time: e.target.value})} className="input-field flex-1" style={{ background: theme.surface, borderColor: theme.border, color: theme.text }}>
                <option value=""> Choose Time</option>
                {times.map(time => <option key={time} value={time}>{time}</option>)}
              </select>
              <input type="text" placeholder="Place " value={newSchedule.location} onChange={e => setNewSchedule({...newSchedule, location: e.target.value})} className="input-field flex-1" style={{ background: theme.surface, borderColor: theme.border, color: theme.text }} />
              <button onClick={addScheduleItem} className="btn" style={{ background: theme.accent, color: "#fff", padding: "0 12px" }}>+</button>
            </div>
            {form.schedule.length > 0 && (
              <div className="mt-2">
                {form.schedule.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 rounded mb-1" style={{ background: theme.surface }}>
                    <span>{item.day} - {item.time} - {item.location}</span>
                    <button onClick={() => removeScheduleItem(idx)} className="text-xs" style={{ color: theme.red }}>✖</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button onClick={handleAdd} className="btn" style={{ background: theme.green, color: theme.bg, padding: "8px 18px", fontWeight: 700 }}>Save</button>
            <button onClick={() => setShowAdd(false)} className="btn" style={{ background: theme.border, color: theme.text, padding: "8px 18px" }}>Cancel</button>
          </div>
        </div>
      )}

      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
        {courses.map(c => {
          const pct = c.capacity ? Math.round((c.enrolledStudents / c.capacity) * 100) : 0;
          const color = DEPT_COLORS[c.department] || theme.accent;
          const full = c.enrolledStudents >= c.capacity;
          return (
            <div
              key={c._id}
              onClick={() => setPanel(c)}
              className="card cursor-pointer"
              style={{ background: theme.card, borderColor: theme.border, padding: 20 }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = color + "55"; e.currentTarget.style.transform = "translateY(-4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.transform = "none"; }}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="font-bold" style={{ color: theme.white, fontSize: 14, marginBottom: 3 }}>{c.title}</div>
                  <div className="text-sm" style={{ color }}>{c.instructor}</div>
                </div>
                <span className="px-2 py-1 rounded-full text-xs font-semibold" style={{ background: `${color}20`, color }}>{c.credits} cr.</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="text-center p-3 rounded" style={{ background: theme.surface }}>
                  <div className="text-xs uppercase tracking-wider" style={{ color: theme.muted, marginBottom: 3 }}>Enrolled</div>
                  <div className="text-lg font-extrabold" style={{ color: theme.accent }}>{c.enrolledStudents}</div>
                </div>
                <div className="text-center p-3 rounded" style={{ background: theme.surface }}>
                  <div className="text-xs uppercase tracking-wider" style={{ color: theme.muted, marginBottom: 3 }}>Capacity</div>
                  <div className="text-lg font-extrabold" style={{ color: full ? theme.red : theme.green }}>{c.enrolledStudents}/{c.capacity}</div>
                </div>
              </div>
              <div className="progress-bar" style={{ background: theme.border }}>
                <div className="progress-fill" style={{ width: `${Math.min(pct, 100)}%`, background: pct >= 100 ? theme.red : pct >= 80 ? theme.yellow : color }} />
              </div>
              {full && <div className="mt-2 text-center text-xs font-bold py-1 rounded" style={{ background: `${theme.red}15`, color: theme.red }}>⚠ FULL</div>}
            </div>
          );
        })}
      </div>

      <DetailPanel 
        key={panel?._id} 
        item={panel} 
        type="course" 
        onClose={() => setPanel(null)} 
        onRefresh={fetchCourses} 
      />
    </div>
  );
}