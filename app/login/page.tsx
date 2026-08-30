"use client";
import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import AuthShell, { C, inputStyle, labelStyle, btnStyle } from "@/components/AuthShell";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [unconfirmed, setUnconfirmed] = useState<string | null>(null);
  const [resendState, setResendState] = useState<"idle" | "sending" | "sent" | "fail">("idle");
  const router = useRouter();

  const handleLogin = async () => {
    setError("");
    setUnconfirmed(null);
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.ok) {
        if (data.sessionId) {
          localStorage.setItem("sessionId", data.sessionId);
          localStorage.setItem("trimtrack_session_id", data.sessionId);
        }
        if (data.name) {
          localStorage.setItem("trimtrack_profile", JSON.stringify({ name: data.name, plan: data.plan }));
        }
        router.push("/dashboard");
      } else if (data.error === "unconfirmed") {
        setUnconfirmed(data.email || email);
      } else {
        setError(data.error || "Login failed. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!unconfirmed) return;
    setResendState("sending");
    try {
      const res = await fetch("/api/trial/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: unconfirmed }),
      });
      const data = await res.json();
      if (data.ok) setResendState("sent");
      else setResendState("fail");
    } catch {
      setResendState("fail");
    }
  };

  if (unconfirmed) {
    return (
      <AuthShell>
        <div style={{ background: C.card, borderRadius: 20, padding: 32, border: `1px solid ${C.line}`, textAlign: "center" }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: C.ink, marginBottom: 8 }}>Confirm your email</h2>
          <p style={{ color: C.body, fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
            We have an account for <strong style={{ color: C.acc }}>{unconfirmed}</strong>, but the confirmation link has not been clicked yet.
          </p>
          {resendState === "sent" ? (
            <p style={{ color: C.acc, fontSize: 14 }}>Sent. Check your inbox and spam folder.</p>
          ) : (
            <button onClick={handleResend} disabled={resendState === "sending"} style={btnStyle(resendState === "sending")}>
              {resendState === "sending" ? "Sending..." : "Resend confirmation"}
            </button>
          )}
          {resendState === "fail" && (
            <p style={{ color: C.danger, fontSize: 13, marginTop: 12 }}>Could not send it just now. Try again in a minute.</p>
          )}
          <button
            onClick={() => setUnconfirmed(null)}
            style={{ background: "none", border: "none", color: C.mut, marginTop: 20, cursor: "pointer", fontWeight: 600 }}
          >
            Back to login
          </button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <div style={{ background: C.card, borderRadius: 20, padding: 32, border: `1px solid ${C.line}` }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: C.ink, marginBottom: 8 }}>Welcome back</h2>
        <p style={{ color: C.mut, fontSize: 14, marginBottom: 28 }}>Log in to continue tracking your calories.</p>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Email address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="you@email.com"
            style={inputStyle}
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label style={labelStyle}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="Your password"
            style={inputStyle}
          />
        </div>
        <div style={{ textAlign: "right", marginBottom: 20 }}>
          <a href="/forgot-password" style={{ fontSize: 13, color: C.acc, textDecoration: "none" }}>
            Forgot password?
          </a>
        </div>
        {error && <p style={{ color: C.danger, fontSize: 13, marginBottom: 16 }}>{error}</p>}
        <button onClick={handleLogin} disabled={loading} style={{ ...btnStyle(loading), marginBottom: 16 }}>
          {loading ? "Logging in..." : "Log in"}
        </button>
        <p style={{ textAlign: "center", color: C.mut, fontSize: 13 }}>
          No account yet?{" "}
          <a href="/trial" style={{ color: C.acc, fontWeight: 600, textDecoration: "none" }}>
            Start free trial
          </a>
        </p>
      </div>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
