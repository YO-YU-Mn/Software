import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import axios from "axios";
import toast from 'react-hot-toast';

export function NotificationsPage({ onBack }) {
  const { theme } = useTheme();
  const G = `linear-gradient(135deg, ${theme.accent2}, ${theme.accent})`;

  const [notifications, setNotifications] = useState([]);
  const [form, setForm] = useState({ 
    title: "", 
    description: "", 
    date: new Date().toISOString().slice(0,10), 
    target: "all",
    studentCode: "" 
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:9000/notifications/all', {
        headers: { Authorization: token }
      });
      setNotifications(res.data);
    } catch (err) {
      toast.error('فشل تحميل الإشعارات');
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleSave = async () => {
    if (!form.title || !form.description) {
      toast.error('العنوان والمحتوى مطلوبان');
      return;
    }
    if (form.target === 'specific' && !form.studentCode) {
      toast.error('يرجى إدخال كود الطالب');
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const payload = { ...form };
      if (form.target !== 'specific') delete payload.studentCode;

      if (editingId) {
        await axios.put(`http://localhost:9000/notifications/update/${editingId}`, payload, {
          headers: { Authorization: token }
        });
        toast.success('تم تعديل الإشعار');
      } else {
        await axios.post('http://localhost:9000/notifications/add', payload, {
          headers: { Authorization: token }
        });
        toast.success('تم إرسال الإشعار');
      }
      setForm({ title: "", description: "", date: new Date().toISOString().slice(0,10), target: "all", studentCode: "" });
      setEditingId(null);
      fetchNotifications();
    } catch (err) {
      toast.error('حدث خطأ أثناء الحفظ');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setForm({
      title: item.title,
      description: item.description,
      date: item.date ? item.date.slice(0,10) : new Date().toISOString().slice(0,10),
      target: item.target || "all",
      studentCode: item.studentCode || ""
    });
    setEditingId(item._id);
  };

 const handleDelete = (id) => {
  toast((t) => (
    <div style={{ direction: 'rtl', textAlign: 'center' }}>
      <p>هل أنت متأكد من حذف هذا الإشعار؟</p>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '10px' }}>
        <button
          onClick={() => {
            toast.dismiss(t.id);
            performDelete(id);
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

const performDelete = async (id) => {
  try {
    const token = localStorage.getItem('token');
    await axios.delete(`http://localhost:9000/notifications/admin/${id}`, {
      headers: { Authorization: token }
    });
    toast.success('تم حذف الإشعار');
    fetchNotifications();
  } catch (err) {
    toast.error('فشل الحذف');
  }
};

  return (
    <div className="p-7 flex-1 overflow-y-auto" style={{ background: theme.bg }}>
      <button onClick={onBack} className="btn-back" style={{ background: theme.card, color: theme.muted, borderColor: theme.border }}>
        ← Back
      </button>

      <h1 className="m-0 mb-5 text-3xl font-extrabold" style={{ color: theme.white }}> Manage Notfications</h1>

      <div className="grid grid-cols-2 gap-6">
        {/* نموذج إضافة/تعديل */}
        <div className="card" style={{ background: theme.card, border: `1px solid ${theme.border}`, padding: 24 }}>
          <h3 style={{ color: theme.white, marginBottom: 16, fontSize: 18 }}>{editingId ? " Edit Notfication " : " New Notfication"}</h3>
          <div className="flex flex-col gap-4">
            <div>
              <label className="input-label" style={{ color: theme.muted }}>Header</label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                className="input-field"
                style={{ background: theme.surface, border: `1px solid ${theme.border}`, color: theme.text }}
              />
            </div>
            <div>
              <label className="input-label" style={{ color: theme.muted }}>المحتوى</label>
              <textarea
                rows="4"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="input-field"
                style={{ background: theme.surface, border: `1px solid ${theme.border}`, color: theme.text }}
              />
            </div>
            <div>
              <label className="input-label" style={{ color: theme.muted }}> Date </label>
              <input
                type="date"
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
                className="input-field"
                style={{ background: theme.surface, border: `1px solid ${theme.border}`, color: theme.text }}
              />
            </div>
            <div>
              <label className="input-label" style={{ color: theme.muted }}>To</label>
              <select
                value={form.target}
                onChange={e => setForm({ ...form, target: e.target.value, studentCode: "" })}
                className="input-field"
                style={{ background: theme.surface, border: `1px solid ${theme.border}`, color: theme.text }}
              >
                <option value="all"> All Student</option>
                <option value="level1">Level 1</option>
                <option value="level2">Level 2</option>
                <option value="level3">Level 3</option>
                <option value="level4">Level 4</option>
                <option value="specific"> Specific Student</option>
              </select>
            </div>
            {form.target === 'specific' && (
              <div>
                <label className="input-label" style={{ color: theme.muted }}> Student Code</label>
                <input
                  type="text"
                  value={form.studentCode}
                  onChange={e => setForm({ ...form, studentCode: e.target.value })}
                  placeholder="SC-2025-001"
                  className="input-field"
                  style={{ background: theme.surface, border: `1px solid ${theme.border}`, color: theme.text }}
                />
              </div>
            )}
            <div className="flex gap-2">
              <button onClick={handleSave} disabled={loading} className="btn btn-primary flex-1 py-2" style={{ background: G, opacity: loading ? 0.6 : 1 }}>
                {loading ? ' Saving...' : (editingId ? "Edit" : "Send")}
              </button>
              {editingId && (
                <button onClick={() => { setForm({ title: "", description: "", date: new Date().toISOString().slice(0,10), target: "all", studentCode: "" }); setEditingId(null); }} className="btn" style={{ background: theme.surface, color: theme.muted, border: `1px solid ${theme.border}` }}>
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        {/* قائمة الإشعارات */}
        <div className="card" style={{ background: theme.card, border: `1px solid ${theme.border}`, padding: 24 }}>
          <h3 style={{ color: theme.white, marginBottom: 16, fontSize: 18 }}> Sent Notifications</h3>
          {notifications.length === 0 ? (
            <p style={{ color: theme.muted, textAlign: 'center', padding: 20 }}>لا توجد إشعارات</p>
          ) : (
            <div className="flex flex-col gap-3 max-h-96 overflow-y-auto">
              {notifications.map(n => (
                <div key={n._id} className="p-3 rounded" style={{ background: theme.surface, border: `1px solid ${theme.border}40` }}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-bold" style={{ color: theme.accent }}>{n.title}</div>
                      <div className="text-xs mt-1" style={{ color: theme.muted }}>{n.date}</div>
                      <p className="text-sm mt-2" style={{ color: theme.text }}>{n.description}</p>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => handleEdit(n)} className="btn p-1 text-xs" style={{ background: theme.accent + '20', color: theme.accent }}>Edit</button>
<button onClick={() => handleDelete(n._id)} className="btn p-1 text-xs" style={{ background: theme.red + '20', color: theme.red }}>Delete</button>                    </div>
                  </div>
                  <div className="mt-2 text-xs">
                    <span style={{ color: theme.muted }}>
                      {n.target === 'all' ? 'الكل' : n.target === 'specific' ? `طالب: ${n.studentCode}` : `المستوى ${n.target.slice(-1)}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}