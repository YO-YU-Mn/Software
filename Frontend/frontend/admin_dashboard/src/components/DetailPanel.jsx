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

  const dep = ["CS", "Physics", "Chem", "Math", "Bio"];

  // جلب التخصصات للطالب فقط
  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:9000/students/all', {
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
        await axios.put(`http://localhost:9000/students/updatestudent/${item.code}`, editData, {
          headers: { Authorization: token }
        });
        toast.success('تم تحديث بيانات الطالب');
      } else if (type === 'course') {
        await axios.put(`http://localhost:9000/courses/updateCourse/${item._id}`, editData, {
          headers: { Authorization: token }
        });
        toast.success('تم تحديث بيانات المادة');
      } else if (type === 'admin') {
        const payload = {
          name: editData.name,
          email: editData.email,
        };
        if (editData.password && editData.password.trim() !== '') {
          payload.password = editData.password;
        }
        await axios.put(`http://localhost:9000/admins/updateAdmin/${item.code}`, payload, {
          headers: { Authorization: token }
        });
        toast.success('تم تحديث بيانات admin');
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

  const handleDelete = () => {
    toast((t) => (
      <div style={{ direction: 'rtl', textAlign: 'center' }}>
        <p>هل أنت متأكد من حذف {type === 'student' ? 'الطالب' : type === 'course' ? 'المادة' : 'المدير'} "{item.name || item.title || item.code}"؟</p>
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
            نعم
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
            لا
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
        await axios.delete(`http://localhost:9000/students/delete/${item.code}`, {
          headers: { Authorization: token }
        });
        toast.success('student deleted');
      } else if (type === 'course') {
        await axios.delete(`http://localhost:9000/courses/deleteCourse/${item._id}`, {
          headers: { Authorization: token }
        });
        toast.success('course deleted');
      } else if (type === 'admin') {
        await axios.delete(`http://localhost:9000/admins/delAdmin/${item.code}`, {
          headers: { Authorization: token }
        });
        toast.success('admin deleted');  
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
        { label: 'الكود', key: 'code', type: 'text', readonly: true },
        { label: 'الاسم الكامل', key: 'name', type: 'text' },
        { label: 'القسم', key: 'specialization', type: 'select', options: specializations },
        { label: 'المستوى', key: 'level', type: 'number' },
        { label: 'الترم', key: 'semester', type: 'number' },
        { label: 'البريد الإلكتروني', key: 'email', type: 'email' },
        { label: 'رقم الهاتف', key: 'phone', type: 'text' },
        { label: 'المعدل التراكمي', key: 'GPA', type: 'number', step: 0.1 },
      ]
    : type === 'course'
      ? [
          { label: 'كود المادة', key: 'course_id', type: 'text', readonly: true },
          { label: 'عنوان المادة', key: 'title', type: 'text' },
          { label: 'القسم', key: 'specialization', type: 'select', options: dep },
          { label: 'المستوى', key: 'level', type: 'number' },
          { label: 'الترم', key: 'semester', type: 'number' },
          { label: 'عدد الساعات', key: 'credits', type: 'number' },
          { label: 'المدرس', key: 'instructor', type: 'text' },
          { label: 'السعة', key: 'capacity', type: 'number' },
          { label: 'المسجلين', key: 'enrolledStudents', type: 'number', readonly: true },
        ]
      : [
          { label: 'Admin code ', key: 'code', type: 'text', readonly: true },
          { label: 'الاسم الكامل', key: 'name', type: 'text' },
          { label: 'البريد الإلكتروني', key: 'email', type: 'email' },
          { label: 'كلمة المرور ', key: 'password', type: 'password', hideInView: true },
        ];

  return (
    <div className="panel-overlay" onClick={onClose}>
      <div className="panel" onClick={e => e.stopPropagation()} onKeyDown={handleKeyDown} tabIndex={-1}>
        <div className="panel-header" style={{ background: `linear-gradient(90deg, ${theme.accent}, ${theme.accent}40)` }} />
        <div className="panel-content">
          <div className="flex justify-between items-start mb-5">
            <div>
              <div className="panel-title" style={{ color: theme.muted }}>
                {type === 'student' ? 'بيانات الطالب' : type === 'course' ? 'بيانات المادة' : 'admin data '}
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
                      <option value="">اختر {field.label}</option>
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
                <button onClick={() => setIsEditing(true)} className="btn" style={{ background: theme.accent, color: '#fff', padding: '8px 16px' }}> تعديل</button>
                <button onClick={handleDelete} className="btn" style={{ background: theme.red, color: '#fff', padding: '8px 16px' }}> حذف</button>
              </>
            ) : (
              <>
                <button onClick={handleSave} disabled={loading} className="btn" style={{ background: theme.green, color: '#fff', padding: '8px 16px' }}>{loading ? 'جاري...' : 'حفظ'}</button>
                <button onClick={() => setIsEditing(false)} className="btn" style={{ background: theme.border, color: theme.muted, padding: '8px 16px' }}>إلغاء</button>
              </>
            )}
          </div>

          <button onClick={onClose} className="btn btn-primary w-full mt-4 py-3 text-base" style={{ background: `linear-gradient(135deg, ${theme.accent2}, ${theme.accent})` }}>إغلاق</button>
        </div>
      </div>
    </div>
  );
}