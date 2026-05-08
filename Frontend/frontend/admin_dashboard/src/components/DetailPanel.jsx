import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import axios from "axios";
import toast from 'react-hot-toast';

export function DetailPanel({ item, type, onClose, onRefresh }) {
  const { theme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(item || {});
  const [loading, setLoading] = useState(false);
  const [specializations, setSpecializations] = useState([]);

// قائمة التخصصات الثابتة (بدلاً من جلبها من API)
  const dep = ["CS", "Physics", "Chem", "Math", "Bio"];

  // جلب التخصصات المتاحة
  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/students/all`, {
          headers: { Authorization: token }
        });
        const uniqueSpecs = [...new Set(res.data.map(s => s.specialization).filter(Boolean))];
        setSpecializations(uniqueSpecs);
      } catch (err) {
        console.error("Failed to fetch specializations", err);
      }
    };
    if (type === 'student') fetchSpecializations();
  }, [type]);

  useEffect(() => {
    setEditData(item || {});
  }, [item]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (type === 'student') {
        await axios.put(`${import.meta.env.VITE_API_URL}/students/updatestudent/${item.code}`, editData, {
          headers: { Authorization: token }
        });
        toast.success('تم تحديث بيانات الطالب');
      } else if (type === 'course') {
        await axios.put(`${import.meta.env.VITE_API_URL}/courses/updateCourse/${item._id}`, editData, {
          headers: { Authorization: token }
        });
        toast.success('تم تحديث بيانات المادة');
      } else if (type === 'admin') {
        const payload = {
          name: editData.name,
          email: editData.email,
        };
        if (editData.password) payload.password = editData.password;
        await axios.put(`${import.meta.env.VITE_API_URL}/admins/updateAdmin/${item.code}`, payload, {
          headers: { Authorization: token }
        });
        toast.success('تم تحديث بيانات المدير');
      }
      setIsEditing(false);
      onClose();
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error('فشل التحديث');
    } finally {
      setLoading(false);
    }
  };

  // تأكيد الحذف باستخدام toast
  const handleDelete = () => {
    toast((t) => (
      <div style={{ direction: 'rtl', textAlign: 'center' }}>
        <p>هل أنت متأكد من حذف {type === 'student' ? 'الطالب' : type === 'course' ? 'المادة' : 'المدير'} "{item.name || item.title}"؟</p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '10px' }}>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              performDelete();
            }}
            style={{
              background: theme.red,
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 12px',
              cursor: 'pointer'
            }}
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            style={{
              background: theme.border,
              color: theme.text,
              border: 'none',
              borderRadius: '6px',
              padding: '6px 12px',
              cursor: 'pointer'
            }}
          >
            No
          </button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  const performDelete = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (type === 'student') {
        await axios.delete(`${import.meta.env.VITE_API_URL}/students/delete/${item.code}`, {
          headers: { Authorization: token }
        });
        toast.success('تم حذف الطالب');
      } else if (type === 'course') {
        await axios.delete(`${import.meta.env.VITE_API_URL}/courses/deleteCourse/${item._id}`, {
          headers: { Authorization: token }
        });
        toast.success('تم حذف المادة');
      } else if (type === 'admin') {
        await axios.delete(`${import.meta.env.VITE_API_URL}/admins/delAdmin/${item.code}`, {
          headers: { Authorization: token }
        });
        toast.success('تم حذف المدير');
      }
      onClose();
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error('فشل الحذف');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (isEditing) handleSave();
    } else if (e.key === 'Escape') {
      if (isEditing) setIsEditing(false);
      else onClose();
    }
  };

  if (!item) return null;

  const fields = type === 'student'
    ? [
        { label: 'code', key: 'code', type: 'text', readonly: true },
        { label: 'name', key: 'name', type: 'text' },
        { label: 'Department', key: 'specialization', type: 'select', options: specializations },
        { label: 'level', key: 'level', type: 'number' },
        { label: 'semester', key: 'semester', type: 'number' },
        { label: 'email', key: 'email', type: 'email' },
        { label: 'phone', key: 'phone', type: 'text' },
        { label: 'GPA', key: 'GPA', type: 'number', step: 0.1 },
      ]
    : type === 'course'
      ? [
          { label: 'Course ID', key: 'course_id', type: 'text', readonly: true },
          { label: 'Title', key: 'title', type: 'text' },
          { label: 'Department', key: 'specialization', type: 'select', options: dep },
          { label: 'Level', key: 'level', type: 'number' },
          { label: 'Semester', key: 'semester', type: 'number' },
          { label: 'Credits', key: 'credits', type: 'number' },
          { label: 'Instructor', key: 'instructor', type: 'text' },
          { label: 'Capacity', key: 'capacity', type: 'number' },
          { label: 'Enrolled', key: 'enrolledStudents', type: 'number', readonly: true },
        ]
      : [
          { label: 'Admin Code', key: 'code', type: 'text', readonly: true },
          { label: 'Full Name', key: 'name', type: 'text' },
          { label: 'Email', key: 'email', type: 'email' },
          { label: 'New Password', key: 'password', type: 'password', hideInView: true },
        ];

  return (
    <div className="panel-overlay" onClick={onClose}>
      <div className="panel" onClick={e => e.stopPropagation()} onKeyDown={handleKeyDown} tabIndex={-1}>
        <div className="panel-header" style={{ background: `linear-gradient(90deg, ${theme.accent}, ${theme.accent}40)` }} />
        <div className="panel-content">
          <div className="flex justify-between items-start mb-5">
            <div>
              <div className="panel-title" style={{ color: theme.muted }}>
                {type === 'student' ? 'Student Profile' : type === 'course' ? 'Course Details' : 'Admin Details'}
              </div>
              <h2 className="panel-name" style={{ color: theme.white }}>{item.name || item.title || `Admin #${item.code}`}</h2>
            </div>
            <button onClick={onClose} className="panel-close" style={{ background: theme.surface, borderColor: theme.border, color: theme.muted }}>✕</button>
          </div>

          {!isEditing ? (
            <div className="rounded-lg overflow-hidden" style={{ border: `1px solid ${theme.border}` }}>
              {fields.map((field, i) => (
                <div key={field.key} className="panel-info-row" style={{ background: i % 2 === 0 ? theme.surface : theme.card }}>
                  <span className="panel-info-label" style={{ color: theme.muted }}>{field.label}</span>
                  <span className="panel-info-value" style={{ color: theme.text }}>
                    {field.readonly
                      ? item[field.key]
                      : field.hideInView
                        ? '•••••••'
                        : (item[field.key] ?? '—')}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg overflow-hidden" style={{ border: `1px solid ${theme.border}`, padding: 16 }}>
              {fields.map(field => (
                <div key={field.key} className="mb-3">
                  <label className="input-label" style={{ color: theme.muted }}>{field.label}</label>
                  {field.readonly ? (
                    <div className="p-2 rounded" style={{ background: theme.surface, color: theme.muted }}>{item[field.key]}</div>
                  ) : field.type === 'select' ? (
                    <select
                      value={editData[field.key] || ''}
                      onChange={e => setEditData({ ...editData, [field.key]: e.target.value })}
                      className="input-field"
                      style={{ background: theme.surface, border: `1px solid ${theme.border}`, color: theme.text }}
                    >
                      <option value="">Choose {field.label}</option>
                      {field.options.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      value={editData[field.key] ?? ''}
                      onChange={e => setEditData({ ...editData, [field.key]: field.type === 'number' ? Number(e.target.value) : e.target.value })}
                      className="input-field"
                      style={{ background: theme.surface, border: `1px solid ${theme.border}`, color: theme.text }}
                      step={field.step}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2 mt-4">
            {!isEditing ? (
              <>
                <button onClick={() => setIsEditing(true)} className="btn" style={{ background: theme.accent, color: '#fff', padding: '8px 16px' }}> Edit</button>
                <button onClick={handleDelete} className="btn" style={{ background: theme.red, color: '#fff', padding: '8px 16px' }}> Delete</button>
              </>
            ) : (
              <>
                <button onClick={handleSave} disabled={loading} className="btn" style={{ background: theme.green, color: '#fff', padding: '8px 16px' }}>{loading ? 'جاري...' : 'Save'}</button>
                <button onClick={() => setIsEditing(false)} className="btn" style={{ background: theme.border, color: theme.muted, padding: '8px 16px' }}>Cancel</button>
              </>
            )}
          </div>

          <button onClick={onClose} className="btn btn-primary w-full mt-4 py-3 text-base" style={{ background: `linear-gradient(135deg, ${theme.accent2}, ${theme.accent})` }}>Close</button>
        </div>
      </div>
    </div>
  );
}