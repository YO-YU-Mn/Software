import React from "react";
import { T, G } from "./theme";

export default function Sidebar({ page, setPage }) {
  const items = [
    { id: "dashboard",  label: "Dashboard",       icon: "⬡" },
    { id: "students",   label: "Students",         icon: "◎" },
    { id: "courses",    label: "Courses",           icon: "⬜" },
    { id: "reports",    label: "Reports",           icon: "◑" },
    { id: "addStudent", label: "Register Student",  icon: "⊕" },
    { id: "addAdmin",   label: "Register Admin",    icon: "⊞" },
  ];

  return (
    <div style={{
      width: 230, minWidth: 230,
      background: T.surface,
      borderRight: `1px solid ${T.border}`,
      display: "flex", flexDirection: "column",
      padding: "20px 0",
      position: "sticky", top: 0, height: "100vh",
    }}>
      {/* Logo */}
      <div style={{ padding: "0 18px 22px", borderBottom: `1px solid ${T.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, background: G,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 17, color: "#fff", flexShrink: 0,
            boxShadow: `0 4px 14px #38bdf840`,
          }}>⚗</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, color: T.white, letterSpacing: 0.3 }}>Faculty of Science</div>
            <div style={{ fontSize: 10, color: T.muted, marginTop: 1 }}>Academic Portal</div>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <div style={{ flex: 1, padding: "14px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
        {items.map(item => {
          const active = page === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              style={{
                width: "100%", padding: "9px 12px", borderRadius: 8,
                cursor: "pointer", border: "none",
                background: active ? G : "transparent",
                color: active ? "#fff" : T.muted,
                fontSize: 13, fontWeight: active ? 600 : 400,
                display: "flex", alignItems: "center", gap: 10,
                transition: "all 0.18s",
                boxShadow: active ? `0 4px 14px #38bdf830` : "none",
              }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = T.border; e.currentTarget.style.color = T.text; } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.muted; } }}
            >
              <span style={{ fontSize: 14, width: 18, textAlign: "center", opacity: active ? 1 : 0.7 }}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Admin footer */}
      <div style={{ padding: "14px 10px", borderTop: `1px solid ${T.border}` }}>
        <div style={{ padding: "8px 12px", display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <div style={{
            width: 30, height: 30, borderRadius: "50%", background: G,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 700, color: "#fff", fontSize: 11, flexShrink: 0,
          }}>A</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: T.text }}>System Admin</div>
            <div style={{ fontSize: 10, color: T.muted }}>admin@sci.edu.eg</div>
          </div>
        </div>
        <button style={{
          width: "100%", padding: "8px 12px",
          background: T.red + "12", border: `1px solid ${T.red}28`,
          borderRadius: 8, cursor: "pointer", color: T.red,
          fontSize: 12, display: "flex", alignItems: "center", gap: 8,
        }}>
          <span>⏻</span> Sign Out
        </button>
      </div>
    </div>
  );
}
