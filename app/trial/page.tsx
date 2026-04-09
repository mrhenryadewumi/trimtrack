"use client";
import { useState, useEffect } from "react";

export default function TrialPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    let sid = localStorage.getItem("sessionId");
    if (!sid) { sid = crypto.randomUUID(); localStorage.setItem("sessionId", sid); }
    setSessionId(sid);
    const profile = localStorage.getItem("trimtrack_profile");
    if (profile) {
      try { const p = JSON.parse(profile); if (p.name) setName(p.name); } catch {}
    }
  }, []);

  const handleSubmit = async () => {
    setError("");
    if (!email || !email.includes("@")) { setError("Please enter a valid email address."); return; }
    if (!password || password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/trial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, sessionId, password }),
      });
      const data = await res.json();
      if (data.ok) { setSent(true); }
      else { setError(data.error || "Something went wrong. Please try again."); }
    } catch { setError("Network error. Please try again."); }
    finally { setLoading(false); }
  };

  if (sent) return (
    <div style={{ minHeight: "100vh", background: "#f6fbf8", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ textAlign: "center", maxWidth: "400px" }}>
        <div style={{ width: "72px", height: "72px", background: "#1a5c38", borderRadius: "18px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: "32px" }}>✉</div>
        <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#0f1f14", marginBottom: "12px" }}>Check your email</h1>
        <p style={{ color: "#555", lineHeight: "1.7", marginBottom: "8px" }}>
          We sent a confirmation link to <strong style={{ color: "#1a5c38" }}>{email}</strong>
        </p>
        <p style={{ color: "#888", fontSize: "14px" }}>Click the link to activate your 30-day free trial. Check your spam folder if you do not see it.</p>
        <a href="/login" style={{ display: "inline-block", marginTop: "24px", color: "#1a5c38", fontWeight: "600", textDecoration: "none" }}>Go to login</a>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f6fbf8", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ maxWidth: "420px", width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <a href="/" style={{ textDecoration: "none" }}>
            <span style={{ fontWeight: 800, fontSize: "22px", color: "#1a5c38" }}>TrimTrack</span>
          </a>
        </div>
        <div style={{ background: "white", borderRadius: "20px", padding: "32px", border: "1px solid #e5e7eb" }}>
          <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#0f1f14", marginBottom: "8px" }}>Start your free trial</h2>
          <p style={{ color: "#666", fontSize: "14px", marginBottom: "24px", lineHeight: "1.6" }}>30 days full access. No credit card needed.</p>

          <div style={{ marginBottom: "14px" }}>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "#333", display: "block", marginBottom: "6px" }}>Your name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Henry"
              style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1.5px solid #e5e7eb", fontSize: "15px", outline: "none", boxSizing: "border-box" }} />
          </div>

          <div style={{ marginBottom: "14px" }}>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "#333", display: "block", marginBottom: "6px" }}>Email address</label>
            <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError(""); }} placeholder="you@email.com"
              style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: error && !password ? "1.5px solid #dc2626" : "1.5px solid #e5e7eb", fontSize: "15px", outline: "none", boxSizing: "border-box" }} />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "#333", display: "block", marginBottom: "6px" }}>Create password</label>
            <input type="password" value={password} onChange={e => { setPassword(e.target.value); setError(""); }} placeholder="At least 8 characters"
              style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1.5px solid #e5e7eb", fontSize: "15px", outline: "none", boxSizing: "border-box" }} />
          </div>

          {error && <p style={{ color: "#dc2626", fontSize: "13px", marginBottom: "16px" }}>{error}</p>}

          <button onClick={handleSubmit} disabled={loading}
            style={{ width: "100%", padding: "15px", background: loading ? "#2d8a56" : "#1a5c38", color: "#b5f23d", border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer", marginBottom: "16px" }}>
            {loading ? "Creating account..." : "Create account"}
          </button>

          <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: "16px" }}>
            {["Unlimited AI food scanning", "Morning and evening reminders", "30 days completely free", "No credit card required"].map(f => (
              <div key={f} style={{ fontSize: "13px", color: "#555", padding: "3px 0", display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ color: "#1a5c38", fontWeight: "700" }}>+</span> {f}
              </div>
            ))}
          </div>
        </div>
        <p style={{ textAlign: "center", color: "#888", fontSize: "12px", marginTop: "16px" }}>
          Already have an account?{" "}
          <a href="/login" style={{ color: "#1a5c38", fontWeight: "600", textDecoration: "none" }}>Log in</a>
        </p>
        <p style={{ textAlign: "center", color: "#888", fontSize: "12px", marginTop: "8px" }}>
          After 30 days, continue for just £2.99/month or £19.99/year.
        </p>
      </div>
    </div>
  );
}