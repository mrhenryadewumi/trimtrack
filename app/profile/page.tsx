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
    <div style={{ minHeight: "100vh", background: "#f6fbf8", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "#1a5c38", fontWeight: 600 }}>Loading...</div>
    </div>
  );

  if (!profile) return null;

  const inp = { width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1.5px solid #e5e7eb", fontSize: "15px", outline: "none", boxSizing: "border-box" as const, color: "#0f1f14", background: "white" };
  const card = { background: "white", borderRadius: "20px", padding: "24px", border: "1px solid #e5e7eb", marginBottom: "16px" };
  const lbl = { fontSize: "12px", fontWeight: "600" as const, color: "#888", display: "block", marginBottom: "6px", textTransform: "uppercase" as const, letterSpacing: "0.05em" };

  return (
    <div style={{ minHeight: "100vh", background: "#f6fbf8" }}>
      <nav style={{ background: "rgba(246,251,248,0.97)", borderBottom: "1px solid #e8f5ee", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "56px", position: "sticky", top: 0, zIndex: 50 }}>
        <a href="/dashboard" style={{ textDecoration: "none", fontWeight: 800, fontSize: "18px", color: "#1a5c38" }}>TrimTrack</a>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <a href="/dashboard" style={{ fontSize: "14px", color: "#1a5c38", textDecoration: "none", fontWeight: 600 }}>Dashboard</a>
          <button onClick={handleLogout} style={{ fontSize: "13px", color: "#dc2626", background: "none", border: "1px solid #fecaca", borderRadius: "20px", padding: "5px 14px", cursor: "pointer", fontWeight: 600 }}>Log out</button>
        </div>
      </nav>

      <div style={{ maxWidth: "540px", margin: "0 auto", padding: "20px 12px" }}>
        <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#0f1f14", marginBottom: "6px" }}>Your profile</h1>
        <p style={{ color: "#888", fontSize: "14px", marginBottom: "28px" }}>Keep your details accurate for the best results.</p>

        <div style={card}>
          <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#0f1f14", marginBottom: "18px" }}>Personal details</h2>
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
                <button key={g} onClick={() => update("gender", g)} style={{ padding: "10px 12px", borderRadius: "10px", flex: "1", border: "1.5px solid", borderColor: profile.gender === g ? "#1a5c38" : "#e5e7eb", background: profile.gender === g ? "#1a5c38" : "white", color: profile.gender === g ? "#b5f23d" : "#555", fontWeight: 600, fontSize: "14px", cursor: "pointer", textTransform: "capitalize" as const }}>{g}</button>
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
          <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#0f1f14", marginBottom: "18px" }}>Body measurements</h2>
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
                  style={{ flex: 1, accentColor: "#1a5c38" }} />
                <span style={{ fontSize: "22px", fontWeight: 800, color: "#0f1f14", width: "55px", textAlign: "right" as const }}>{profile[field.key] || field.min}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={card}>
          <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#0f1f14", marginBottom: "18px" }}>Lifestyle</h2>
          <div style={{ marginBottom: "16px" }}>
            <label style={lbl}>Activity level</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {ACTIVITIES.map(a => (
                <button key={a.value} onClick={() => update("activity", a.value)} style={{ padding: "12px", borderRadius: "10px", border: "1.5px solid", borderColor: profile.activity === a.value ? "#1a5c38" : "#e5e7eb", background: profile.activity === a.value ? "#1a5c38" : "white", color: profile.activity === a.value ? "#b5f23d" : "#555", fontWeight: 600, fontSize: "13px", cursor: "pointer", textAlign: "left" as const }}>{a.label}</button>
              ))}
            </div>
          </div>
          <div>
            <label style={lbl}>Daily reminders</label>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" as const }}>
              <button onClick={() => update("reminders", true)} style={{ padding: "10px 16px", borderRadius: "10px", border: "1.5px solid", borderColor: profile.reminders ? "#1a5c38" : "#e5e7eb", background: profile.reminders ? "#1a5c38" : "white", color: profile.reminders ? "#b5f23d" : "#555", fontWeight: 600, fontSize: "13px", cursor: "pointer" }}>Yes - morning + evening</button>
              <button onClick={() => update("reminders", false)} style={{ padding: "10px 16px", borderRadius: "10px", border: "1.5px solid", borderColor: !profile.reminders ? "#1a5c38" : "#e5e7eb", background: !profile.reminders ? "#1a5c38" : "white", color: !profile.reminders ? "#b5f23d" : "#555", fontWeight: 600, fontSize: "13px", cursor: "pointer" }}>No thanks</button>
            </div>
          </div>
        </div>

        {error && <p style={{ color: "#dc2626", fontSize: "13px", marginBottom: "16px" }}>{error}</p>}

        <button onClick={handleSave} disabled={saving} style={{ width: "100%", padding: "16px", background: saved ? "#22c55e" : saving ? "#2d8a56" : "#1a5c38", color: "#b5f23d", border: "none", borderRadius: "14px", fontSize: "16px", fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", marginBottom: "12px", transition: "background 0.2s" }}>
          {saved ? "Saved!" : saving ? "Saving..." : "Save changes"}
        </button>

        <div style={{ textAlign: "center", paddingTop: "16px", borderTop: "1px solid #f0f0f0" }}>
          <button onClick={handleLogout} style={{ color: "#dc2626", background: "none", border: "none", fontSize: "14px", cursor: "pointer", fontWeight: 600 }}>Log out</button>
        </div>
      </div>
    </div>
  );
}