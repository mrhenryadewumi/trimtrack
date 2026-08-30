"use client";
import { useState } from "react";
import AuthShell, { C, inputStyle, labelStyle, btnStyle } from "@/components/AuthShell";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
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

  if (sent) {
    return (
      <AuthShell>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: C.ink, marginBottom: 12 }}>Check your email</h1>
          <p style={{ color: C.body, lineHeight: 1.7 }}>
            If an account exists for <strong>{email}</strong>, we sent a password reset link. Check your inbox and spam folder.
          </p>
          <a href="/login" style={{ display: "inline-block", marginTop: 24, color: C.acc, fontWeight: 600, textDecoration: "none" }}>
            Back to login
          </a>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <div style={{ background: C.card, borderRadius: 20, padding: 32, border: `1px solid ${C.line}` }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: C.ink, marginBottom: 8 }}>Reset your password</h2>
        <p style={{ color: C.mut, fontSize: 14, marginBottom: 28 }}>Enter your email and we will send you a reset link.</p>
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Email address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="you@email.com"
            style={inputStyle}
          />
          {error && <p style={{ color: C.danger, fontSize: 13, marginTop: 6 }}>{error}</p>}
        </div>
        <button onClick={handleSubmit} disabled={loading} style={{ ...btnStyle(loading), marginBottom: 16 }}>
          {loading ? "Sending..." : "Send reset link"}
        </button>
        <p style={{ textAlign: "center", color: C.mut, fontSize: 13 }}>
          <a href="/login" style={{ color: C.acc, fontWeight: 600, textDecoration: "none" }}>
            Back to login
          </a>
        </p>
      </div>
    </AuthShell>
  );
}
