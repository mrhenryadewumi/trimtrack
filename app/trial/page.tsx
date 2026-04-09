"use client";
import { useState, useEffect } from "react";

export default function TrialPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let sid = localStorage.getItem("sessionId");
    if (!sid) {
      sid = crypto.randomUUID();
      localStorage.setItem("sessionId", sid);
    }
    setSessionId(sid);

    const profile = localStorage.getItem("trimtrack_profile");
    if (profile) {
      try {
        const p = JSON.parse(profile);
        if (p.name) setName(p.name);
      } catch {}
    }
    setReady(true);
  }, []);

  const handleSubmit = async () => {
    setError("");
    if (!email) { setError("Please enter your email address."); return; }
    if (!email.includes("@")) { setError("Please enter a valid email address."); return; }
    if (!sessionId) { setError("Session error. Please refresh the page."); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/trial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, sessionId }),
      });
      const data = await res.json();
      if (data.ok) {
        setSent(true);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) return (
    <div style={{
      minHeight: "100vh", background: "#f6fbf8",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "24px"
    }}>
      <div style={{ textAlign: "center", maxWidth: "400px" }}>
        <div style={{
          width: "72px", height: "72px", background: "#1a5c38",
          borderRadius: "18px", display: "flex", alignItems: "center",
          justifyContent: "center", margin: "0 auto 24px", fontSize: "32px"
        }}>✉</div>
        <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#0f1f14", marginBottom: "12px" }}>
          Check your email
        </h1>
        <p style={{ color: "#555", lineHeight: "1.7", marginBottom: "8px" }}>
          We sent a confirmation link to <strong style={{ color: "#1a5c38" }}>{email}</strong>
        </p>
        <p style={{ color: "#888", fontSize: "14px", lineHeight: "1.6" }}>
          Click the link in the email to activate your 30-day free trial. Check your spam folder if you do not see it within 2 minutes.
        </p>
      </div>
    </div>
  );

  return (
    <div style={{
      minHeight: "100vh", background: "#f6fbf8",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "24px"
    }}>
      <div style={{ maxWidth: "420px", width: "100%" }}>

        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <a href="/" style={{ textDecoration: "none" }}>
            <span style={{ fontWeight: 800, fontSize: "22px", color: "#1a5c38" }}>TrimTrack</span>
          </a>
        </div>

        <div style={{
          background: "white", borderRadius: "20px", padding: "32px",
          border: "1px solid #e5e7eb"
        }}>
          <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#0f1f14", marginBottom: "8px" }}>
            Start your free trial
          </h2>
          <p style={{ color: "#666", fontSize: "14px", marginBottom: "28px", lineHeight: "1.6" }}>
            30 days of full access. No credit card needed. Cancel anytime.
          </p>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "#333", display: "block", marginBottom: "6px" }}>
              Your name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Henry"
              style={{
                width: "100%", padding: "12px 14px", borderRadius: "10px",
                border: "1.5px solid #e5e7eb", fontSize: "15px",
                outline: "none", boxSizing: "border-box", color: "#0f1f14"
              }}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "#333", display: "block", marginBottom: "6px" }}>
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(""); }}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              placeholder="you@email.com"
              style={{
                width: "100%", padding: "12px 14px", borderRadius: "10px",
                border: error ? "1.5px solid #dc2626" : "1.5px solid #e5e7eb",
                fontSize: "15px", outline: "none", boxSizing: "border-box", color: "#0f1f14"
              }}
            />
            {error && (
              <p style={{ color: "#dc2626", fontSize: "13px", marginTop: "6px" }}>{error}</p>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || !ready}
            style={{
              width: "100%", padding: "15px",
              background: loading ? "#2d8a56" : "#1a5c38",
              color: "#b5f23d", border: "none", borderRadius: "12px",
              fontSize: "16px", fontWeight: "700",
              cursor: loading ? "not-allowed" : "pointer",
              marginBottom: "20px", transition: "background 0.15s"
            }}
          >
            {loading ? "Sending..." : "Send confirmation email"}
          </button>

          <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: "16px" }}>
            {[
              "Unlimited AI food scanning",
              "Morning and evening reminders",
              "Barcode scanner",
              "30 days completely free",
              "No credit card required",
            ].map(f => (
              <div key={f} style={{
                fontSize: "13px", color: "#555", padding: "4px 0",
                display: "flex", alignItems: "center", gap: "8px"
              }}>
                <span style={{ color: "#1a5c38", fontWeight: "700" }}>+</span> {f}
              </div>
            ))}
          </div>
        </div>

        <p style={{ textAlign: "center", color: "#888", fontSize: "12px", marginTop: "16px" }}>
          After 30 days, continue for just £2.99/month or £19.99/year.
        </p>
      </div>
    </div>
  );
}