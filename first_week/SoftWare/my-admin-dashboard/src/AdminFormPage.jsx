import React, { useState } from "react";
import { T, G } from "./theme";

export default function AdminFormPage({ onBack }) {
  const [data, setData] = useState({ name: "", email: "", role: "admin" });
  const [ok,   setOk]   = useState(false);

  const inp = {
    background: T.surface, border: `1px solid ${T.border}`, color: T.text,
    padding: "11px 14px", borderRadius: 8, fontSize: 14, outline: "none",
    width: "100%", boxSizing: "border-box", transition: "border 0.2s",
  };

  const handleSave = () => {
    if (data.name && data.email) {
      setOk(true);
      setData({ name: "", email: "", role: "admin" });
      setTimeout(() => setOk(false), 3000);
    }
  };

  return (
    <div style={{ padding: 28, flex: 1 }}>
      <button onClick={onBack} style={{ background: T.card, color: T.muted, border: `1px solid ${T.border}`, padding: "7px 14px", borderRadius: 7, cursor: "pointer", fontSize: 12, marginBottom: 22 }}>← Back</button>
      <div style={{ maxWidth: 500, margin: "0 auto", background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 34 }}>
        <h2 style={{ color: T.white, textAlign: "center", marginBottom: 6, fontSize: 20, fontWeight: 800 }}>Register New Admin</h2>
        <div style={{ height: 3, background: G, width: 50, margin: "0 auto 26px", borderRadius: 2 }} />
        {ok && (
          <div style={{ background: T.green + "18", color: T.green, border: `1px solid ${T.green}35`, borderRadius: 8, padding: 12, marginBottom: 18, textAlign: "center", fontWeight: 600, fontSize: 13 }}>
            ✅ Admin registered!
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[["name", "Full Name", "text"], ["email", "Email Address", "email"]].map(([k, l, t]) => (
            <div key={k}>
              <label style={{ display: "block", color: T.muted, fontSize: 11, fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>{l}</label>
              <input
                type={t}
                value={data[k]}
                onChange={e => setData({ ...data, [k]: e.target.value })}
                style={inp}
                onFocus={e => e.target.style.borderColor = T.accent}
                onBlur={e => e.target.style.borderColor = T.border}
              />
            </div>
          ))}
          <div>
            <label style={{ display: "block", color: T.muted, fontSize: 11, fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Role</label>
            <select value={data.role} onChange={e => setData({ ...data, role: e.target.value })} style={inp}>
              <option value="admin">Admin</option>
              <option value="superadmin">Super Admin</option>
            </select>
          </div>
          <button
            onClick={handleSave}
            style={{ marginTop: 6, background: G, color: "#fff", border: "none", padding: 13, borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 14, boxShadow: `0 4px 16px ${T.accent}35` }}
          >
            Confirm & Save
          </button>
        </div>
      </div>
    </div>
  );
}
