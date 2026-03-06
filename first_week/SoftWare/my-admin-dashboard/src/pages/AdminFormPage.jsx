import { useState } from "react";
import { T, G } from "../theme";

const ADMIN_PASSWORD = "genidy";

export function AdminFormPage({ onBack }) {
  const [unlocked, setUnlocked]   = useState(false);
  const [passInput, setPassInput] = useState("");
  const [passErr, setPassErr]     = useState(false);
  const [showPass, setShowPass]   = useState(false);
  const [data, setData]           = useState({ name:"", email:"", role:"admin" });
  const [ok, setOk]               = useState(false);

  const inp = { background:T.surface, border:`1px solid ${T.border}`, color:T.text, padding:"11px 14px", borderRadius:8, fontSize:14, outline:"none", width:"100%", boxSizing:"border-box" };

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
    <div style={{ padding:28, flex:1, display:"flex", flexDirection:"column" }}>
      <button onClick={onBack} style={{ background:T.card, color:T.muted, border:`1px solid ${T.border}`, padding:"7px 14px", borderRadius:7, cursor:"pointer", fontSize:12, marginBottom:22, alignSelf:"flex-start" }}>← Back</button>

      {/* PASSWORD GATE */}
      {!unlocked ? (
        <div style={{ maxWidth:400, margin:"40px auto 0", background:T.card, border:`1px solid ${T.border}`, borderRadius:16, padding:36, textAlign:"center" }}>
          <div style={{ fontSize:40, marginBottom:16 }}>🔐</div>
          <h2 style={{ color:T.white, margin:"0 0 6px", fontSize:20, fontWeight:800 }}>Admin Access Required</h2>
          <p style={{ color:T.muted, fontSize:13, margin:"0 0 26px" }}>Enter the admin password to continue</p>

          {passErr && (
            <div style={{ background:T.red+"18", color:T.red, border:`1px solid ${T.red}35`, borderRadius:8, padding:"10px 14px", marginBottom:16, fontSize:13, fontWeight:600 }}>
              ✗ Incorrect password. Try again.
            </div>
          )}

          <div style={{ position:"relative", marginBottom:16 }}>
            <input type={showPass?"text":"password"} placeholder="Enter password…" value={passInput}
              onChange={e=>setPassInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleUnlock()}
              style={{ ...inp, paddingRight:44, borderColor:passErr?T.red:T.border, letterSpacing:passInput&&!showPass?4:1 }}
              onFocus={e=>e.target.style.borderColor=passErr?T.red:T.accent}
              onBlur={e=>e.target.style.borderColor=passErr?T.red:T.border}
              autoFocus />
            <button onClick={()=>setShowPass(v=>!v)}
              style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:T.muted, cursor:"pointer", fontSize:16, padding:0 }}>
              {showPass?"🙈":"👁"}
            </button>
          </div>

          <button onClick={handleUnlock} style={{ width:"100%", background:G, color:"#fff", border:"none", padding:13, borderRadius:8, cursor:"pointer", fontWeight:700, fontSize:14 }}>
            🔓 Unlock
          </button>
        </div>
      ) : (
        /* REGISTER FORM */
        <div style={{ maxWidth:500, margin:"0 auto", background:T.card, border:`1px solid ${T.accent}30`, borderRadius:16, padding:34 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, marginBottom:6 }}>
            <span style={{ fontSize:18 }}>✅</span>
            <h2 style={{ color:T.white, margin:0, fontSize:20, fontWeight:800 }}>Register New Admin</h2>
          </div>
          <div style={{ height:3, background:G, width:50, margin:"0 auto 26px", borderRadius:2 }} />

          {ok && (
            <div style={{ background:T.green+"18", color:T.green, border:`1px solid ${T.green}35`, borderRadius:8, padding:12, marginBottom:18, textAlign:"center", fontWeight:600, fontSize:13 }}>
              ✅ Admin registered successfully!
            </div>
          )}

          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {[["name","Full Name","text"],["email","Email Address","email"]].map(([k,l,t]) => (
              <div key={k}>
                <label style={{ display:"block", color:T.muted, fontSize:11, fontWeight:600, marginBottom:6, textTransform:"uppercase", letterSpacing:1 }}>{l}</label>
                <input type={t} value={data[k]} onChange={e=>setData({...data,[k]:e.target.value})} style={inp}
                  onFocus={e=>e.target.style.borderColor=T.accent} onBlur={e=>e.target.style.borderColor=T.border} />
              </div>
            ))}
            <div>
              <label style={{ display:"block", color:T.muted, fontSize:11, fontWeight:600, marginBottom:6, textTransform:"uppercase", letterSpacing:1 }}>Role</label>
              <select value={data.role} onChange={e=>setData({...data,role:e.target.value})} style={inp}>
                <option value="admin">Admin</option>
                <option value="superadmin">Super Admin</option>
              </select>
            </div>
            <button onClick={handleSave} style={{ marginTop:6, background:G, color:"#fff", border:"none", padding:13, borderRadius:8, cursor:"pointer", fontWeight:700, fontSize:14 }}>
              Confirm & Save
            </button>
            <button onClick={()=>{setUnlocked(false);setPassInput("");}}
              style={{ background:T.red+"15", color:T.red, border:`1px solid ${T.red}28`, padding:10, borderRadius:8, cursor:"pointer", fontWeight:600, fontSize:13 }}>
              🔒 Lock Page
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
