import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import axios from "axios";
import toast from 'react-hot-toast';

export function SettingsPage({ onBack }) {
  const { theme } = useTheme();
  const G = `linear-gradient(135deg, ${theme.accent2}, ${theme.accent})`;

  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:9000/settings/all', {
          headers: { Authorization: token }
        });
        setSettings(res.data);
      } catch (err) {
        toast.error('فشل تحميل الإعدادات');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:9000/settings/update', settings, {
        headers: { Authorization: token }
      });
      toast.success( ' تم حفظ الإعدادات بنجاح');
    } catch (err) {
      toast.error('فشل الحفظ');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p style={{ color: theme.muted }}>جاري التحميل...</p>;
  if (!settings) return null;

  return (
    <div className="p-7 flex-1 overflow-y-auto" style={{ background: theme.bg }}>
      <button onClick={onBack} className="btn-back" style={{ background: theme.card, color: theme.muted, borderColor: theme.border }}>
        ← Back
      </button>

      <h1 className="m-0 mb-5 text-3xl font-extrabold" style={{ color: theme.white }}> Settings</h1>

      <div className="card" style={{ background: theme.card, border: `1px solid ${theme.border}`, padding: 30, maxWidth: 600 }}>
        <div className="flex flex-col gap-6">
          {/* حالة التسجيل */}
          <div>
            <label className="input-label" style={{ color: theme.muted, marginBottom: 8 }}>حالة تسجيل المواد</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleChange('registrationOpen', true)}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${settings.registrationOpen ? 'btn-primary' : ''}`}
                style={{
                  background: settings.registrationOpen ? G : theme.surface,
                  color: settings.registrationOpen ? '#fff' : theme.muted,
                  border: `1px solid ${settings.registrationOpen ? 'transparent' : theme.border}`,
                }}
              >
                 Open
              </button>
              <button
                onClick={() => handleChange('registrationOpen', false)}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${!settings.registrationOpen ? 'btn-primary' : ''}`}
                style={{
                  background: !settings.registrationOpen ? theme.red : theme.surface,
                  color: !settings.registrationOpen ? '#fff' : theme.muted,
                  border: `1px solid ${!settings.registrationOpen ? 'transparent' : theme.border}`,
                }}
              >
                 Close
              </button>
            </div>
          </div>

          {/* الفصل الدراسي */}
          <div>
            <label className="input-label" style={{ color: theme.muted }}>الفصل الدراسي الحالي</label>
            <select
              value={settings.currentSemester}
              onChange={e => handleChange('currentSemester', e.target.value)}
              className="input-field"
              style={{ background: theme.surface, border: `1px solid ${theme.border}`, color: theme.text, width: '100%', marginTop: 4 }}
            >
              <option value="Fall 2026">Fall 2026</option>
              <option value="Summer 2026">Summer 2026</option>
              <option value="Spring 2025">Spring 2025</option>
              <option value="Fall 2025">Fall 2025</option>
            </select>
          </div>

          {/* الحد الأقصى للساعات 
          <div>
            <label className="input-label" style={{ color: theme.muted }}>الحد الأقصى للساعات المسجلة</label>
            <input
              type="number"
              value={settings.maxCreditHours}
              onChange={e => handleChange('maxCreditHours', parseInt(e.target.value))}
              className="input-field"
              style={{ background: theme.surface, border: `1px solid ${theme.border}`, color: theme.text, marginTop: 4 }}
            />
          </div>
              */}
          <button onClick={handleSave} disabled={saving} className="btn btn-primary py-3" style={{ background: G, opacity: saving ? 0.6 : 1 }}>
            {saving ? 'Saving ...' : 'Save Settings '}
          </button>
        </div>
      </div>
    </div>
  );
}