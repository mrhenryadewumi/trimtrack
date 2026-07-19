"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const COUNTRIES = [
  "Nigeria", "Ghana", "Kenya", "South Africa", "Ethiopia", "Tanzania", "Uganda",
  "Rwanda", "Cameroon", "Ivory Coast", "Senegal", "Mali", "Burkina Faso", "Niger",
  "Chad", "Sudan", "Somalia", "Mozambique", "Madagascar", "Zimbabwe", "Zambia",
  "Malawi", "Botswana", "Namibia", "Angola", "Democratic Republic of Congo",
  "Republic of Congo", "Gabon", "Equatorial Guinea", "Benin", "Togo", "Sierra Leone",
  "Liberia", "Guinea", "Guinea-Bissau", "Gambia", "Cape Verde", "Mauritania",
  "Morocco", "Algeria", "Tunisia", "Libya", "Egypt", "Eritrea", "Djibouti",
  "Comoros", "Seychelles", "Mauritius", "Sao Tome and Principe", "Lesotho", "Eswatini",
  "UK", "USA", "Canada", "Australia", "Germany", "France", "Italy", "Spain",
  "Netherlands", "Belgium", "Sweden", "Norway", "Denmark", "Finland", "Switzerland",
  "Austria", "Portugal", "Ireland", "New Zealand", "Brazil", "Jamaica", "Trinidad",
  "Barbados", "Guyana", "UAE", "Saudi Arabia", "Qatar", "Kuwait", "Bahrain",
  "India", "China", "Japan", "South Korea", "Singapore", "Malaysia", "Other"
];
const ACTIVITIES = [
  { value: "sedentary", label: "Mostly sitting" },
  { value: "light", label: "Light walking" },
  { value: "moderate", label: "Gym 2-3x per week" },
  { value: "active", label: "Very active" },
];

const NUM = "'Space Grotesk', sans-serif";
const BG = "#0a1310", CARD = "#162a20", DEEP = "#0e1e16";
const LINE = "rgba(255,255,255,0.05)", LINE3 = "rgba(255,255,255,0.13)";
const INK = "#ffffff", MUT = "#8a9a92", FAINT = "#5f7269", ACC = "#b5f23d";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/profile", { credentials: "include" })
      .then(r => r.json())
      .then(data => {
        if (data && data.name) setProfile(data);
        else router.push("/login");
      })
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, []);

  const update = (key: string, val: any) => setProfile((p: any) => ({ ...p, [key]: val }));

  const handleSave = async () => {
    setSaving(true); setError("");
    try {
      const res = await fetch("/api/profile", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (data.ok) {
        localStorage.setItem("trimtrack_profile", JSON.stringify(profile));
        setSaved(true); setTimeout(() => setSaved(false), 2000);
      } else { setError("Failed to save. Please try again."); }
    } catch { setError("Network error."); }
    finally { setSaving(false); }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    localStorage.clear();
    window.location.href = "/login";
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: ACC, fontWeight: 600 }}>Loading...</div>
    </div>
  );

  if (!profile) return null;

  const inp = { width: "100%", padding: "12px 14px", borderRadius: "12px", border: `1.5px solid ${LINE3}`, fontSize: "15px", outline: "none", boxSizing: "border-box" as const, color: INK, background: DEEP };
  const card = { background: CARD, borderRadius: "22px", padding: "22px", border: `1px solid ${LINE}`, marginBottom: "12px" };
  const lbl = { fontSize: "10px", fontWeight: 700 as const, color: FAINT, display: "block", marginBottom: "7px", textTransform: "uppercase" as const, letterSpacing: "0.1em" };
  const pill = (active: boolean) => ({ padding: "11px 14px", borderRadius: "12px", border: active ? "1.5px solid #b5f23d" : `1.5px solid ${LINE3}`, background: active ? "#b5f23d" : "transparent", color: active ? "#0a1310" : MUT, fontWeight: active ? 800 : 600, fontSize: "13px", cursor: "pointer", minHeight: "44px" });

  return (
    <div style={{ minHeight: "100vh", background: BG, color: INK, paddingBottom: "96px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div style={{ maxWidth: "540px", margin: "0 auto", padding: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "18px" }}>
          <a href="/dashboard" style={{ width: "36px", height: "36px", borderRadius: "12px", background: CARD, display: "flex", alignItems: "center", justifyContent: "center", color: MUT, fontSize: "16px", textDecoration: "none" }}>←</a>
          <div style={{ fontSize: "17px", fontWeight: 800 }}>Your profile</div>
          <div style={{ marginLeft: "auto", width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg,#1a5c38,#0f3d25)", display: "flex", alignItems: "center", justifyContent: "center", color: "#b5f23d", fontWeight: 800, fontSize: "15px" }}>
            {profile?.name?.[0]?.toUpperCase() || "U"}
          </div>
        </div>
        <p style={{ color: FAINT, fontSize: "13px", margin: "0 2px 18px" }}>Keep your details accurate for the best results.</p>

        <div style={card}>
          <h2 style={{ fontSize: "11px", fontWeight: 800, color: FAINT, letterSpacing: "0.12em", margin: "0 0 16px" }}>PERSONAL DETAILS</h2>
          <div style={{ marginBottom: "16px" }}>
            <label style={lbl}>Name</label>
            <input type="text" value={profile.name || ""} onChange={e => update("name", e.target.value)} style={inp} />
          </div>
          <div style={{ marginBottom: "16px" }}>
            <label style={lbl}>Age</label>
            <input type="number" value={profile.age || ""} onChange={e => update("age", parseInt(e.target.value))} min={16} max={80} style={inp} />
          </div>
          <div style={{ marginBottom: "16px" }}>
            <label style={lbl}>Gender</label>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" as const }}>
              {["female","male","other"].map(g => (
                <button key={g} onClick={() => update("gender", g)} style={{ ...pill(profile.gender === g), flex: 1, textTransform: "capitalize" as const }}>{g}</button>
              ))}
            </div>
          </div>
          <div>
            <label style={lbl}>Country</label>
            <select value={profile.country || ""} onChange={e => update("country", e.target.value)} style={{ ...inp, cursor: "pointer" }}>
              <option value="">Select country</option>
              {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div style={card}>
          <h2 style={{ fontSize: "11px", fontWeight: 800, color: FAINT, letterSpacing: "0.12em", margin: "0 0 16px" }}>BODY MEASUREMENTS</h2>
          {[
            { label: "Current weight (kg)", key: "startWeight", min: 40, max: 250 },
            { label: "Goal weight (kg)", key: "goalWeight", min: 40, max: 250 },
            { label: "Height (cm)", key: "height", min: 100, max: 220 },
          ].map(field => (
            <div key={field.key} style={{ marginBottom: "16px" }}>
              <label style={lbl}>{field.label}</label>
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <input type="range" min={field.min} max={field.max} value={profile[field.key] || field.min}
                  onChange={e => update(field.key, parseInt(e.target.value))}
                  style={{ flex: 1, accentColor: "#b5f23d" }} />
                <span style={{ fontFamily: NUM, fontSize: "22px", fontWeight: 700, color: ACC, width: "58px", textAlign: "right" as const }}>{profile[field.key] || field.min}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={card}>
          <h2 style={{ fontSize: "11px", fontWeight: 800, color: FAINT, letterSpacing: "0.12em", margin: "0 0 16px" }}>LIFESTYLE</h2>
          <div style={{ marginBottom: "16px" }}>
            <label style={lbl}>Activity level</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {ACTIVITIES.map(a => (
                <button key={a.value} onClick={() => update("activity", a.value)} style={{ ...pill(profile.activity === a.value), textAlign: "left" as const }}>{a.label}</button>
              ))}
            </div>
          </div>
          <div>
            <label style={lbl}>Daily reminders</label>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" as const }}>
              <button onClick={() => update("reminders", true)} style={pill(!!profile.reminders)}>Yes - morning + evening</button>
              <button onClick={() => update("reminders", false)} style={pill(!profile.reminders)}>No thanks</button>
            </div>
          </div>
        </div>

        {error && <p style={{ color: "#ff8a8a", fontSize: "13px", marginBottom: "16px" }}>{error}</p>}

        <button onClick={handleSave} disabled={saving} style={{ width: "100%", padding: "16px", background: saved ? "#8dc42a" : "#b5f23d", color: "#0a1310", border: "none", borderRadius: "99px", fontSize: "15px", fontWeight: 800, cursor: saving ? "not-allowed" : "pointer", marginBottom: "12px", boxShadow: "0 10px 26px -8px rgba(181,242,61,0.45)", opacity: saving ? 0.7 : 1, transition: "background 0.2s" }}>
          {saved ? "Saved!" : saving ? "Saving..." : "Save changes"}
        </button>

        <div style={{ textAlign: "center", paddingTop: "14px", borderTop: `1px solid ${LINE}` }}>
          <button onClick={handleLogout} style={{ color: MUT, background: "none", border: `1px solid ${LINE3}`, borderRadius: "99px", padding: "10px 22px", fontSize: "13px", cursor: "pointer", fontWeight: 600 }}>Log out</button>
        </div>
      </div>

      <nav style={{ position: "fixed" as const, bottom: 0, left: 0, right: 0, height: "72px", background: "rgba(10,19,16,0.92)", backdropFilter: "blur(20px)", borderTop: `1px solid ${LINE}`, display: "flex", justifyContent: "space-around", alignItems: "center", padding: "0 8px" }}>
        <a href="/dashboard" style={{ color: FAINT, fontWeight: 600, fontSize: "11px", textDecoration: "none", padding: "6px 10px" }}>Home</a>
        <a href="/statements" style={{ color: FAINT, fontWeight: 600, fontSize: "11px", textDecoration: "none", padding: "6px 10px" }}>Statement</a>
        <a href="/dashboard" style={{ width: "52px", height: "52px", borderRadius: "50%", background: "#b5f23d", color: "#0a1310", fontSize: "26px", fontWeight: 700, marginTop: "-26px", boxShadow: "0 8px 20px -4px rgba(181,242,61,0.5)", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>+</a>
        <a href="/profile" style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", gap: "3px", color: ACC, fontWeight: 800, fontSize: "11px", textDecoration: "none", padding: "6px 10px" }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: ACC }} />Profile
        </a>
      </nav>
    </div>
  );
}
File 2:

notepad C:\dev\trimtrack\app\statements\page.tsx
Keep everything from the top of the file down through const exportStatement = () => { ... }; unchanged, and replace only the return ( ... ); block (everything from return ( to the final ); before the closing }) with:

  return (
    <div style={{ minHeight: "100vh", background: "#0a1310", color: "#fff", paddingBottom: "96px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div style={{ maxWidth: "580px", margin: "0 auto", padding: "20px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
          <a href="/dashboard" style={{ width: "36px", height: "36px", borderRadius: "12px", background: "#162a20", display: "flex", alignItems: "center", justifyContent: "center", color: "#8a9a92", fontSize: "16px", textDecoration: "none" }}>←</a>
          <h1 style={{ fontSize: "17px", fontWeight: 800, margin: 0 }}>Food Statement</h1>
        </div>
        <p style={{ color: "#5f7269", fontSize: "13px", margin: "0 2px 18px" }}>Your complete nutrition history. Like a bank statement for food.</p>

        <div style={{ background: "linear-gradient(135deg, #1a5c38 0%, #0f3d25 100%)", borderRadius: "22px", padding: "22px", marginBottom: "12px", border: "1px solid rgba(181,242,61,0.15)" }}>
          <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>Account holder</div>
          <div style={{ fontSize: "19px", fontWeight: 800, color: "white", marginBottom: "2px" }}>{profile?.name || "Loading..."}</div>
          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)", marginBottom: "16px" }}>{profile?.email || ""}</div>
          <div style={{ display: "flex", gap: "24px" }}>
            <div>
              <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)", marginBottom: "2px" }}>Daily goal</div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "17px", fontWeight: 700, color: "#b5f23d" }}>{(profile?.dailyCalorieGoal || 1500).toLocaleString()} kcal</div>
            </div>
            <div>
              <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)", marginBottom: "2px" }}>Plan</div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "17px", fontWeight: 700, color: "#b5f23d", textTransform: "capitalize" }}>{profile?.plan || "Trial"}</div>
            </div>
          </div>
        </div>

        <div style={{ background: "#162a20", borderRadius: "22px", padding: "22px", marginBottom: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ fontWeight: 800, fontSize: "11px", color: "#5f7269", letterSpacing: "0.12em", marginBottom: "16px" }}>GENERATE STATEMENT</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
            <div>
              <label style={{ fontSize: "10px", fontWeight: 700, color: "#5f7269", display: "block", marginBottom: "6px", letterSpacing: "0.08em" }}>FROM</label>
              <input type="date" value={from} onChange={e => setFrom(e.target.value)}
                style={{ width: "100%", padding: "10px 12px", borderRadius: "12px", border: "1.5px solid rgba(255,255,255,0.13)", fontSize: "14px", outline: "none", boxSizing: "border-box" as const, background: "#0e1e16", color: "#fff", colorScheme: "dark" as const }} />
            </div>
            <div>
              <label style={{ fontSize: "10px", fontWeight: 700, color: "#5f7269", display: "block", marginBottom: "6px", letterSpacing: "0.08em" }}>TO</label>
              <input type="date" value={to} onChange={e => setTo(e.target.value)}
                style={{ width: "100%", padding: "10px 12px", borderRadius: "12px", border: "1.5px solid rgba(255,255,255,0.13)", fontSize: "14px", outline: "none", boxSizing: "border-box" as const, background: "#0e1e16", color: "#fff", colorScheme: "dark" as const }} />
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" as const }}>
            {[
              { label: "This month", fn: () => { const n = new Date(); setFrom(new Date(n.getFullYear(), n.getMonth(), 1).toISOString().split("T")[0]); setTo(n.toISOString().split("T")[0]); }},
              { label: "Last 7 days", fn: () => { const n = new Date(); const w = new Date(n); w.setDate(w.getDate()-7); setFrom(w.toISOString().split("T")[0]); setTo(n.toISOString().split("T")[0]); }},
              { label: "Last 30 days", fn: () => { const n = new Date(); const m = new Date(n); m.setDate(m.getDate()-30); setFrom(m.toISOString().split("T")[0]); setTo(n.toISOString().split("T")[0]); }},
            ].map(q => (
              <button key={q.label} onClick={q.fn} style={{ padding: "8px 14px", borderRadius: "99px", border: "1px solid rgba(255,255,255,0.14)", background: "transparent", color: "#8a9a92", fontSize: "12px", fontWeight: 600, cursor: "pointer", minHeight: "36px" }}>{q.label}</button>
            ))}
          </div>
          <button onClick={generateStatement} disabled={loading}
            style={{ width: "100%", padding: "14px", background: "#b5f23d", color: "#0a1310", border: "none", borderRadius: "99px", fontSize: "14px", fontWeight: 800, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, boxShadow: "0 10px 26px -8px rgba(181,242,61,0.45)" }}>
            {loading ? "Generating..." : "Generate Statement"}
          </button>
        </div>

        {generated && (
          statements.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 20px", background: "#162a20", borderRadius: "22px", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>📋</div>
              <div style={{ fontWeight: 700, marginBottom: "6px" }}>No records for this period</div>
              <div style={{ color: "#8a9a92", fontSize: "13px", marginBottom: "16px" }}>Log meals on the dashboard to build your food statement.</div>
              <a href="/dashboard" style={{ display: "inline-block", background: "#b5f23d", color: "#0a1310", padding: "12px 24px", borderRadius: "99px", textDecoration: "none", fontWeight: 800, fontSize: "13px" }}>Log a meal</a>
            </div>
          ) : (
            <>
              <div style={{ background: "#162a20", borderRadius: "22px", padding: "22px", marginBottom: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                  <div style={{ fontWeight: 800, fontSize: "11px", color: "#5f7269", letterSpacing: "0.12em" }}>SUMMARY</div>
                  <div style={{ fontSize: "11px", color: "#5f7269" }}>{from} to {to}</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "9px", marginBottom: "12px" }}>
                  {[
                    { label: "Days tracked", val: statements.length, color: "#fff" },
                    { label: "Avg kcal/day", val: `${avgKcal.toLocaleString()}`, color: "#5e9bff" },
                    { label: "On track days", val: onTrackDays, color: "#b5f23d" },
                    { label: "Over goal days", val: overDays, color: "#ff8a5e" },
                  ].map(c => (
                    <div key={c.label} style={{ background: "#0e1e16", borderRadius: "14px", padding: "14px" }}>
                      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "22px", fontWeight: 700, color: c.color }}>{c.val}</div>
                      <div style={{ fontSize: "11px", color: "#5f7269", marginTop: "2px" }}>{c.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ background: deficit >= 0 ? "rgba(181,242,61,0.1)" : "rgba(255,138,94,0.1)", border: deficit >= 0 ? "1px solid rgba(181,242,61,0.2)" : "1px solid rgba(255,138,94,0.2)", borderRadius: "14px", padding: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "13px", color: "#c9d8ce", fontWeight: 600 }}>Net calorie {deficit >= 0 ? "deficit" : "surplus"}</div>
                    <div style={{ fontSize: "11px", color: "#5f7269", marginTop: "2px" }}>Total goal minus total eaten</div>
                  </div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "24px", fontWeight: 700, color: deficit >= 0 ? "#b5f23d" : "#ff8a5e" }}>
                    {deficit >= 0 ? "-" : "+"}{Math.abs(deficit).toLocaleString()}
                  </div>
                </div>
              </div>

              <div style={{ background: "#162a20", borderRadius: "22px", border: "1px solid rgba(255,255,255,0.05)", overflow: "hidden", marginBottom: "12px" }}>
                <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 800, fontSize: "11px", color: "#5f7269", letterSpacing: "0.12em" }}>DAILY TRANSACTIONS</span>
                  <span style={{ fontSize: "11px", color: "#5f7269" }}>{statements.length} records</span>
                </div>
                {statements.map((s, i) => (
                  <div key={s.id || i} style={{ padding: "13px 20px", borderBottom: i < statements.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: s.status === "over" ? "#ff8a5e" : s.status === "under" ? "#5e9bff" : "#b5f23d", flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: "13px" }}>{formatDate(s.date)}</div>
                      <div style={{ fontSize: "11px", color: "#5f7269", marginTop: "2px" }}>
                        {s.meals_count} meals - {s.total_protein}g P / {s.total_carbs}g C / {s.total_fat}g F
                      </div>
                    </div>
                    <div style={{ textAlign: "right" as const, flexShrink: 0 }}>
                      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "15px", color: s.status === "over" ? "#ff8a5e" : s.status === "under" ? "#5e9bff" : "#b5f23d" }}>{(s.total_kcal || 0).toLocaleString()}</div>
                      <div style={{ fontSize: "10px", color: "#5f7269" }}>of {(s.goal_kcal || 1500).toLocaleString()} · {statusLabel(s.status)}</div>
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={exportStatement} style={{ width: "100%", padding: "14px", background: "transparent", color: "#b5f23d", border: "1.5px solid rgba(181,242,61,0.4)", borderRadius: "99px", fontSize: "14px", fontWeight: 800, cursor: "pointer" }}>
                Download Statement (.txt)
              </button>
            </>
          )
        )}
      </div>

      <nav style={{ position: "fixed" as const, bottom: 0, left: 0, right: 0, height: "72px", background: "rgba(10,19,16,0.92)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-around", alignItems: "center", padding: "0 8px" }}>
        <a href="/dashboard" style={{ color: "#5f7269", fontWeight: 600, fontSize: "11px", textDecoration: "none", padding: "6px 10px" }}>Home</a>
        <a href="/statements" style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", gap: "3px", color: "#b5f23d", fontWeight: 800, fontSize: "11px", textDecoration: "none", padding: "6px 10px" }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#b5f23d" }} />Statement
        </a>
        <a href="/dashboard" style={{ width: "52px", height: "52px", borderRadius: "50%", background: "#b5f23d", color: "#0a1310", fontSize: "26px", fontWeight: 700, marginTop: "-26px", boxShadow: "0 8px 20px -4px rgba(181,242,61,0.5)", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>+</a>
        <a href="/profile" style={{ color: "#5f7269", fontWeight: 600, fontSize: "11px", textDecoration: "none", padding: "6px 10px" }}>Profile</a>
      </nav>
    </div>
  );