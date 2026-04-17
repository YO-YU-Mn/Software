import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import axios from "axios";
import toast from 'react-hot-toast';

export function NewsPage({ onBack }) {
  const { theme } = useTheme();
  const G = `linear-gradient(135deg, ${theme.accent2}, ${theme.accent})`;

  const [newsList, setNewsList] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", date: "", published: true });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchNews = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:9000/news/admin/all', {
        headers: { Authorization: token }
      });
      setNewsList(res.data);
    } catch (err) {
      toast.error('فشل تحميل الأخبار');
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleSave = async () => {
    if (!form.title || !form.description) {
      toast.error('العنوان والمحتوى مطلوبان');
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (editingId) {
        await axios.put(`http://localhost:9000/news/admin/${editingId}`, form, {
          headers: { Authorization: token }
        });
        toast.success('تم تعديل الخبر');
      } else {
        await axios.post('http://localhost:9000/news/admin/add', form, {
          headers: { Authorization: token }
        });
        toast.success('تم إضافة الخبر');
      }
      setForm({ title: "", description: "", date: "", published: true });
      setEditingId(null);
      fetchNews();
    } catch (err) {
      toast.error('حدث خطأ');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setForm({ 
      title: item.title, 
      description: item.description, 
      date: item.date ? item.date.slice(0,10) : "", 
      published: item.published 
    });
    setEditingId(item._id);
  };

 const handleDelete = (id) => {
  toast((t) => (
    <div style={{ direction: 'rtl', textAlign: 'center' }}>
      <p>هل أنت متأكد من حذف هذا الخبر؟</p>
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
    await axios.delete(`http://localhost:9000/news/admin/${id}`, {
      headers: { Authorization: token }
    });
    toast.success('تم حذف الخبر');
    fetchNews();
  } catch (err) {
    toast.error('فشل الحذف');
  }
};

  return (
    <div className="p-7 flex-1 overflow-y-auto" style={{ background: theme.bg }}>
      <button onClick={onBack} className="btn-back" style={{ background: theme.card, color: theme.muted, borderColor: theme.border }}>
        ← Back
      </button>

      <h1 className="m-0 mb-5 text-3xl font-extrabold" style={{ color: theme.white }}>Manage News </h1>

      <div className="grid grid-cols-2 gap-6">
        {/* نموذج إضافة/تعديل */}
        <div className="card" style={{ background: theme.card, border: `1px solid ${theme.border}`, padding: 24 }}>
          <h3 style={{ color: theme.white, marginBottom: 16, fontSize: 18 }}>{editingId ? " Edit" : " Add New"}</h3>
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
                rows="3"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="input-field"
                style={{ background: theme.surface, border: `1px solid ${theme.border}`, color: theme.text }}
              />
            </div>
            <div>
              <label className="input-label" style={{ color: theme.muted }}>Date </label>
              <input
                type="date"
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
                className="input-field"
                style={{ background: theme.surface, border: `1px solid ${theme.border}`, color: theme.text }}
              />
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={form.published}
                onChange={e => setForm({ ...form, published: e.target.checked })}
                id="published"
                style={{ accentColor: theme.green }}
              />
              <label htmlFor="published" style={{ color: theme.muted }}>Post</label>
            </div>
            <div className="flex gap-2">
              <button onClick={handleSave} disabled={loading} className="btn btn-primary flex-1 py-2" style={{ background: G, opacity: loading ? 0.6 : 1 }}>
                {loading ? '= Saving...' : (editingId ? "Update" : "Add")}
              </button>
              {editingId && (
                <button onClick={() => { setForm({ title: "", description: "", date: "", published: true }); setEditingId(null); }} className="btn" style={{ background: theme.surface, color: theme.muted, border: `1px solid ${theme.border}` }}>
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        {/* قائمة الأخبار */}
        <div className="card" style={{ background: theme.card, border: `1px solid ${theme.border}`, padding: 24 }}>
          <h3 style={{ color: theme.white, marginBottom: 16, fontSize: 18 }}> Current News</h3>
          {newsList.length === 0 ? (
            <p style={{ color: theme.muted, textAlign: 'center' }}>There is No News  </p>
          ) : (
            <div className="flex flex-col gap-3 max-h-96 overflow-y-auto">
              {newsList.map(item => (
                <div key={item._id} className="p-3 rounded" style={{ background: theme.surface, border: `1px solid ${item.published ? theme.green + '30' : theme.border}` }}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-bold" style={{ color: theme.text }}>{item.title}</div>
                      <div className="text-xs mt-1" style={{ color: theme.muted }}>{item.date ? new Date(item.date).toLocaleDateString('ar-EG') : 'بدون تاريخ'}</div>
                      <p className="text-sm mt-2" style={{ color: theme.muted }}>{item.description.length > 60 ? item.description.substring(0, 60) + '...' : item.description}</p>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => handleEdit(item)} className="btn p-1 text-xs" style={{ background: theme.accent + '20', color: theme.accent }}> edit</button>
<button onClick={() => handleDelete(item._id)} className="btn p-1 text-xs" style={{ background: theme.red + '20', color: theme.red }}>Delete</button>                    </div>
                  </div>
                  <div className="mt-2 text-xs">
                    <span style={{ color: item.published ? theme.green : theme.yellow }}>{item.published ? 'منشور' : 'مسودة'}</span>
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