"use client";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    if (!email) { setError("Please enter your email address."); return; }
    setLoading(true);
    try {
      await fetch("/api/auth/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSent(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) return (
    <div style={{ minHeight: "100vh", background: "#f6fbf8", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ textAlign: "center", maxWidth: "400px" }}>
        <div style={{ width: "72px", height: "72px", background: "#1a5c38", borderRadius: "18px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: "32px" }}>✉</div>
        <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#0f1f14", marginBottom: "12px" }}>Check your email</h1>
        <p style={{ color: "#555", lineHeight: "1.7" }}>
          If an account exists for <strong>{email}</strong>, we sent a password reset link. Check your inbox and spam folder.
        </p>
        <a href="/login" style={{ display: "inline-block", marginTop: "24px", color: "#1a5c38", fontWeight: "600", textDecoration: "none" }}>Back to login</a>
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
          <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#0f1f14", marginBottom: "8px" }}>Reset your password</h2>
          <p style={{ color: "#666", fontSize: "14px", marginBottom: "28px" }}>Enter your email and we will send you a reset link.</p>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "#333", display: "block", marginBottom: "6px" }}>Email address</label>
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(""); }}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              placeholder="you@email.com"
              style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1.5px solid #e5e7eb", fontSize: "15px", outline: "none", boxSizing: "border-box" }}
            />
            {error && <p style={{ color: "#dc2626", fontSize: "13px", marginTop: "6px" }}>{error}</p>}
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{ width: "100%", padding: "15px", background: loading ? "#2d8a56" : "#1a5c38", color: "#b5f23d", border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer", marginBottom: "16px" }}
          >
            {loading ? "Sending..." : "Send reset link"}
          </button>
          <p style={{ textAlign: "center", color: "#888", fontSize: "13px" }}>
            <a href="/login" style={{ color: "#1a5c38", fontWeight: "600", textDecoration: "none" }}>Back to login</a>
          </p>
        </div>
      </div>
    </div>
  );
}