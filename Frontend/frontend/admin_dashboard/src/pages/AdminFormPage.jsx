import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

const ADMIN_PASSWORD = ""; // ضع كلمة المرور هنا

export function AdminFormPage({ onBack }) {
  const { theme } = useTheme();
  const G = `linear-gradient(135deg, ${theme.accent2}, ${theme.accent})`;

  const [unlocked, setUnlocked]   = useState(false);
  const [passInput, setPassInput] = useState("");
  const [passErr, setPassErr]     = useState(false);
  const [showPass, setShowPass]   = useState(false);
  const [data, setData]           = useState({ name:"", email:"", role:"admin" });
  const [ok, setOk]               = useState(false);

  const handleUnlock = () => {
    if (passInput === ADMIN_PASSWORD) { setUnlocked(true); setPassErr(false); }
    else { setPassErr(true); setPassInput(""); setTimeout(()=>setPassErr(false), 3000); }
  };

  const handleSave = () => {
    if (data.name && data.email) {
      setOk(true);
      setData({ name:"", email:"", role:"admin" });
      setTimeout(()=>setOk(false), 3000);
    }
  };

  return (
    <div className="p-7 flex-1 flex flex-col" style={{ background: theme.bg }}>
      <button onClick={onBack} className="btn-back" style={{ background: theme.card, color: theme.muted, borderColor: theme.border }}>
        ← Back
      </button>

      {/* PASSWORD GATE */}
      {!unlocked ? (
        <div className="max-w-md mx-auto mt-10 card text-center" style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 16, padding: 36 }}>
          <div className="text-4xl mb-4">🔐</div>
          <h2 className="m-0 mb-1 text-xl font-extrabold" style={{ color: theme.white }}>Admin Access Required</h2>
          <p className="text-sm mb-6" style={{ color: theme.muted }}>Enter the admin password to continue</p>

          {passErr && (
            <div className="message message-error mb-4" style={{ background: `${theme.red}18`, color: theme.red, borderColor: `${theme.red}35` }}>
              ✗ Incorrect password. Try again.
            </div>
          )}

          <div className="relative mb-4">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Enter password…"
              value={passInput}
              onChange={e=>setPassInput(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&handleUnlock()}
              className="input-field w-full"
              style={{
                background: theme.surface,
                border: `1px solid ${passErr ? theme.red : theme.border}`,
                color: theme.text,
                paddingRight: 44,
                letterSpacing: passInput && !showPass ? 4 : 1
              }}
              onFocus={e=>e.target.style.borderColor = passErr ? theme.red : theme.accent}
              onBlur={e=>e.target.style.borderColor = passErr ? theme.red : theme.border}
              autoFocus
            />
            <button
              onClick={()=>setShowPass(v=>!v)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-transparent border-none cursor-pointer"
              style={{ color: theme.muted, fontSize: 16 }}
            >
              {showPass ? "🙈" : "👁"}
            </button>
          </div>

          <button onClick={handleUnlock} className="btn btn-primary w-full py-3 text-base" style={{ background: G }}>🔓 Unlock</button>
        </div>
      ) : (
        /* REGISTER FORM */
        <div className="max-w-md mx-auto card" style={{ background: theme.card, border: `1px solid ${theme.accent}30`, borderRadius: 16, padding: 34 }}>
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-lg">✅</span>
            <h2 className="m-0 text-xl font-extrabold" style={{ color: theme.white }}>Register New Admin</h2>
          </div>
          <div className="h-1 w-12 mx-auto mb-6 rounded" style={{ background: G }} />

          {ok && (
            <div className="message message-success text-center mb-4" style={{ background: `${theme.green}18`, color: theme.green, borderColor: `${theme.green}35` }}>
              ✅ Admin registered successfully!
            </div>
          )}

          <div className="flex flex-col gap-4">
            {[["name","Full Name","text"],["email","Email Address","email"]].map(([k,l,t]) => (
              <div key={k}>
                <label className="input-label" style={{ color: theme.muted }}>{l}</label>
                <input
                  type={t}
                  value={data[k]}
                  onChange={e=>setData({...data,[k]:e.target.value})}
                  className="input-field"
                  style={{ background: theme.surface, border: `1px solid ${theme.border}`, color: theme.text }}
                  onFocus={e=>e.target.style.borderColor=theme.accent}
                  onBlur={e=>e.target.style.borderColor=theme.border}
                />
              </div>
            ))}
            <div>
              <label className="input-label" style={{ color: theme.muted }}>Role</label>
              <select
                value={data.role}
                onChange={e=>setData({...data,role:e.target.value})}
                className="input-field"
                style={{ background: theme.surface, border: `1px solid ${theme.border}`, color: theme.text }}
              >
                <option value="admin">Admin</option>
                <option value="superadmin">Super Admin</option>
              </select>
            </div>
            <button onClick={handleSave} className="btn btn-primary mt-1 py-3 text-base" style={{ background: G }}>Confirm & Save</button>
            <button
              onClick={()=>{setUnlocked(false);setPassInput("");}}
              className="btn"
              style={{ background: `${theme.red}15`, color: theme.red, border: `1px solid ${theme.red}28`, padding: 10, fontSize: 13, fontWeight: 600 }}
            >
              🔒 Lock Page
            </button>
          </div>
        </div>
      )}
    </div>
  );
}