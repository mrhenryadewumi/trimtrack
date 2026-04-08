"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TrialPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const router = useRouter();

  useEffect(() => {
    const sid = localStorage.getItem("sessionId") || "";
    setSessionId(sid);
    
    const profile = localStorage.getItem("trimtrack_profile");
    if (profile) {
      const p = JSON.parse(profile);
      if (p.name) setName(p.name);
    }
  }, []);

  const handleSubmit = async () => {
    if (!email || !sessionId) return;
    setLoading(true);
    try {
      const res = await fetch("/api/trial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, sessionId }),
      });
      const data = await res.json();
      if (data.ok) setSent(true);
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
          width: "80px", height: "80px", background: "#1a5c38",
          borderRadius: "20px", display: "flex", alignItems: "center",
          justifyContent: "center", margin: "0 auto 24px", fontSize: "36px"
        }}>✉️</div>
        <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#0f1f14", marginBottom: "12px" }}>
          Check your email
        </h1>
        <p style={{ color: "#666", lineHeight: "1.6", marginBottom: "24px" }}>
          We sent a confirmation link to <strong>{email}</strong>.
          Click it to start your 30-day free trial.
        </p>
        <p style={{ color: "#888", fontSize: "13px" }}>
          No card needed. Cancel anytime after your trial.
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
        <div style={{
          background: "#1a5c38", borderRadius: "20px", padding: "28px",
          textAlign: "center", marginBottom: "28px"
        }}>
          <h1 style={{ color: "#b5f23d", fontSize: "28px", fontWeight: "800", margin: "0 0 8px" }}>
            TrimTrack
          </h1>
          <p style={{ color: "#a8d5b5", margin: 0, fontSize: "15px" }}>
            30-day free trial - no card needed
          </p>
        </div>

        <div style={{
          background: "white", borderRadius: "20px", padding: "28px",
          border: "1px solid #e5e7eb"
        }}>
          <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#0f1f14", marginBottom: "6px" }}>
            Start your free trial
          </h2>
          <p style={{ color: "#666", fontSize: "14px", marginBottom: "24px", lineHeight: "1.5" }}>
            Get 30 days of unlimited AI food scanning, reminders, and everything TrimTrack offers. Free.
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
                border: "1.5px solid #e5e7eb", fontSize: "15px", outline: "none",
                boxSizing: "border-box"
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
              onChange={e => setEmail(e.target.value)}
              placeholder="you@email.com"
              style={{
                width: "100%", padding: "12px 14px", borderRadius: "10px",
                border: "1.5px solid #e5e7eb", fontSize: "15px", outline: "none",
                boxSizing: "border-box"
              }}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || !email}
            style={{
              width: "100%", padding: "16px", background: loading || !email ? "#ccc" : "#1a5c38",
              color: "#b5f23d", border: "none", borderRadius: "12px",
              fontSize: "16px", fontWeight: "700", cursor: loading || !email ? "not-allowed" : "pointer",
              marginBottom: "16px"
            }}
          >
            {loading ? "Sending..." : "Send confirmation email"}
          </button>

          <div style={{ textAlign: "center" }}>
            {["Unlimited AI food scanning", "Morning and evening reminders", "30 days completely free", "No credit card required"].map(f => (
              <div key={f} style={{ fontSize: "13px", color: "#555", padding: "3px 0" }}>
                ✓ {f}
              </div>
            ))}
          </div>
        </div>

        <p style={{ textAlign: "center", color: "#888", fontSize: "12px", marginTop: "16px" }}>
          After 30 days, continue for £2.99/month or £19.99/year. Cancel anytime.
        </p>
      </div>
    </div>
  );
}