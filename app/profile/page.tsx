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