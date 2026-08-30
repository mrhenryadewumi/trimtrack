"use client";
import { useState, useEffect } from "react";
import AuthShell, { C, inputStyle, labelStyle, btnStyle } from "@/components/AuthShell";

export default function TrialPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let sid = localStorage.getItem("sessionId");
    if (!sid) {
      sid = crypto.randomUUID();
      localStorage.setItem("sessionId", sid);
    }
    const profile = localStorage.getItem("trimtrack_profile");
    if (profile) {
      try {
        const p = JSON.parse(profile);
        if (p.name) setName(p.name);
      } catch {}
    }
  }, []);

  const handleSubmit = async () => {
    setError("");
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/trial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, password }),
      });
      const data = await res.json();
      if (data.ok) setSent(true);
      else setError(data.error || "Something went wrong. Please try again.");
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
          <h1 style={{ fontSize: 24, fontWeight: 800, color: C.ink, marginBottom: 12 }}>
            Check your email
          </h1>
          <p style={{ color: C.body, lineHeight: 1.7, marginBottom: 8 }}>
            We sent a confirmation link to <strong style={{ color: C.acc }}>{email}</strong>
          </p>
          <p style={{ color: C.mut, fontSize: 14 }}>
            Click the link to activate your 30-day free trial. Check spam if you do not see it.
          </p>
          <a href="/login" style={{ display: "inline-block", marginTop: 24, color: C.acc, fontWeight: 600, textDecoration: "none" }}>
            Go to login
          </a>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <div style={{ background: C.card, borderRadius: 20, padding: 32, border: `1px solid ${C.line}` }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: C.ink, marginBottom: 8 }}>
          Start your free trial
        </h2>
        <p style={{ color: C.mut, fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
          30 days full access. No credit card needed.
        </p>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Your name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Henry"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Email address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            placeholder="you@email.com"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Create password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="At least 8 characters"
            style={inputStyle}
          />
        </div>

        {error && <p style={{ color: C.danger, fontSize: 13, marginBottom: 16 }}>{error}</p>}

        <button onClick={handleSubmit} disabled={loading} style={{ ...btnStyle(loading), marginBottom: 16 }}>
          {loading ? "Creating account..." : "Create account"}
        </button>

        <div style={{ borderTop: `1px solid ${C.line}`, paddingTop: 16 }}>
          {["Unlimited AI food scanning", "Morning and evening reminders", "30 days completely free", "No credit card required"].map((f) => (
            <div key={f} style={{ fontSize: 13, color: C.body, padding: "3px 0", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: C.acc, fontWeight: 700 }}>+</span> {f}
            </div>
          ))}
        </div>
      </div>
      <p style={{ textAlign: "center", color: C.mut, fontSize: 12, marginTop: 16 }}>
        Already have an account?{" "}
        <a href="/login" style={{ color: C.acc, fontWeight: 600, textDecoration: "none" }}>
          Log in
        </a>
      </p>
      <p style={{ textAlign: "center", color: C.faint, fontSize: 12, marginTop: 8 }}>
        After 30 days, continue for £4.99 a month, or £3.19 a month billed yearly.
      </p>
    </AuthShell>
  );
}
