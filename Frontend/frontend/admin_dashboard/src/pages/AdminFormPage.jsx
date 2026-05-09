import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { DetailPanel } from "../components/DetailPanel";
import toast from 'react-hot-toast';

// -- استخدم الرابط الكامل للباك إند (عدّل حسب إعداداتك) --
const API_BASE = "http://localhost:9000/admins";

export function AdminFormPage({ onBack  }) {
  const { theme } = useTheme();
  const G = `linear-gradient(135deg, ${theme.accent2}, ${theme.accent})`;

  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [panel, setPanel] = useState(null);
  const [tab, setTab] = useState("addAdmin");

  const [form, setForm] = useState({
    code: "", name: "", email: "", password: ""
  });
  const [addSuccess, setAddSuccess] = useState(false);

  // --- Helper: استدعاء fetch مع التوكن ---
  const fetchWithToken = async (url, options = {}) => {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: token }),
      ...options.headers,
    };
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }
    return response.json();
  };

  // --- جلب جميع الأدمن (GET /allAdmins) ---
  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const data = await fetchWithToken(`${API_BASE}/allAdmins`);
      setAdmins(data);
    } catch (err) {
      toast.error('Failed to load admins: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // --- إضافة أدمن (POST /addAdmin) ---
  const handleAddAdmin = async () => {
    if (!form.code || !form.name || !form.email || !form.password) {
      toast.error('All fields are required');
      return;
    }
    try {
      const payload = {
        code: Number(form.code),
        name: form.name,
        email: form.email,
        password: form.password,
      };
      const result = await fetchWithToken(`${API_BASE}/addAdmin`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (result.success === false) {
        toast.error(result.message);
        return;
      }
      toast.success('Admin added successfully');
      setForm({ code: "", name: "", email: "", password: "" });
      setAddSuccess(true);
      setTimeout(() => setAddSuccess(false), 3000);
      fetchAdmins(); // تحديث القائمة
    } catch (err) {
      toast.error(err.message || 'Failed to add admin');
    }
  };

  if (loading) return <p style={{ color: theme.muted, textAlign: 'center', padding: '2rem' }}>Loading...</p>;

  return (
    <div className="p-7 flex-1 overflow-y-auto" style={{ background: theme.bg }}>
      <button
        onClick={onBack}
        className="btn-back"
        style={{ background: theme.card, color: theme.muted, borderColor: theme.border }}
      >
        ← Back
      </button>
      <h1 className="m-0 mb-5 text-3xl font-extrabold" style={{ color: theme.white }}>Admins</h1>

      {/* Tabs */}
      <div className="flex gap-0 mb-6" style={{ background: theme.card, borderRadius: 10, border: `1px solid ${theme.border}`, width: "fit-content" }}>
        {[
          ["addAdmin", " Add Admin"],
          ["allAdmins", " All Admins"],
        ].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className="btn"
            style={{
              padding: "10px 26px",
              borderRadius: 9,
              background: tab === id ? G : "transparent",
              color: tab === id ? "#fff" : theme.muted,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* تبويب إضافة أدمن */}
      {tab === "addAdmin" && (
        <div className="card" style={{ background: theme.card, borderColor: theme.border, padding: 20 }}>
          <div className="font-semibold mb-3" style={{ color: theme.white, fontSize: 14 }}>Add New Admin</div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <input
              placeholder="Admin Code *"
              type="number"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              className="input-field"
              style={{ background: theme.surface, borderColor: theme.border, color: theme.text }}
            />
            <input
              placeholder="Full Name *"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input-field"
              style={{ background: theme.surface, borderColor: theme.border, color: theme.text }}
            />
            <input
              placeholder="Email *"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="input-field"
              style={{ background: theme.surface, borderColor: theme.border, color: theme.text }}
            />
            <input
              placeholder="Password *"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="input-field"
              style={{ background: theme.surface, borderColor: theme.border, color: theme.text }}
            />
          </div>

          {addSuccess && (
            <div
              className="message message-success text-center mb-4"
              style={{
                background: `${theme.green}18`,
                color: theme.green,
                borderColor: `${theme.green}35`,
              }}
            >
              ✓ Admin added successfully!
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleAddAdmin}
              className="btn"
              style={{ background: theme.green, color: theme.bg, padding: "8px 18px", fontWeight: 700 }}
            >
              Save Admin
            </button>
            <button
              onClick={() => setForm({ code: "", name: "", email: "", password: "" })}
              className="btn"
              style={{ background: theme.border, color: theme.text, padding: "8px 18px" }}
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* تبويب عرض كل الأدمن (بطاقات) */}
      {tab === "allAdmins" && (
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
          {admins.length === 0 ? (
            <p style={{ color: theme.muted }}>No admins yet</p>
          ) : (
            admins.map((admin) => (
              <div
                key={admin._id}
                onClick={() => setPanel(admin)}
                className="card cursor-pointer"
                style={{ background: theme.card, borderColor: theme.border, padding: 20 }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = theme.accent + "55";
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = theme.border;
                  e.currentTarget.style.transform = "none";
                }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-bold" style={{ color: theme.white, fontSize: 14 }}>{admin.name}</div>
                    <div className="text-sm" style={{ color: theme.muted }}>{admin.email}</div>
                  </div>
                  <span
                    className="px-2 py-1 rounded-full text-xs font-semibold"
                    style={{ background: `${theme.accent}20`, color: theme.accent }}
                  >
                    #{admin.code}
                  </span>
                </div>
                <div className="text-center p-3 rounded" style={{ background: theme.surface }}>
                  <div className="text-xs uppercase" style={{ color: theme.muted }}>Admin Code</div>
                  <div className="text-lg font-extrabold" style={{ color: theme.accent }}>{admin.code}</div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* لوحة التفاصيل (DetailPanel) – داخلها بيستخدم نفس الـ fetch للتحديث والحذف */}
      <DetailPanel
        key={panel?._id}
        item={panel}
        type="admin"
        onClose={() => setPanel(null)}
        onRefresh={fetchAdmins}
      />
    </div>
  );
}