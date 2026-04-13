"use client";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleLogin = async () => {
    setError("");
    if (!email || !password) { setError("Please enter your email and password."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.ok) {
        if (data.sessionId) localStorage.setItem("sessionId", data.sessionId);
        router.push("/dashboard");
      } else {
        setError(data.error || "Login failed. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f6fbf8", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ maxWidth: "420px", width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <a href="/" style={{ textDecoration: "none" }}>
            <span style={{ fontWeight: 800, fontSize: "22px", color: "#1a5c38" }}>TrimTrack</span>
          </a>
        </div>
        <div style={{ background: "white", borderRadius: "20px", padding: "32px", border: "1px solid #e5e7eb" }}>
          <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#0f1f14", marginBottom: "8px" }}>Welcome back</h2>
          <p style={{ color: "#666", fontSize: "14px", marginBottom: "28px" }}>Log in to continue tracking your calories.</p>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "#333", display: "block", marginBottom: "6px" }}>Email address</label>
            <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError(""); }}
              onKeyDown={e => e.key === "Enter" && handleLogin()} placeholder="you@email.com"
              style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1.5px solid #e5e7eb", fontSize: "15px", outline: "none", boxSizing: "border-box" }} />
          </div>
          <div style={{ marginBottom: "8px" }}>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "#333", display: "block", marginBottom: "6px" }}>Password</label>
            <input type="password" value={password} onChange={e => { setPassword(e.target.value); setError(""); }}
              onKeyDown={e => e.key === "Enter" && handleLogin()} placeholder="Your password"
              style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1.5px solid #e5e7eb", fontSize: "15px", outline: "none", boxSizing: "border-box" }} />
          </div>
          <div style={{ textAlign: "right", marginBottom: "20px" }}>
            <a href="/forgot-password" style={{ fontSize: "13px", color: "#1a5c38", textDecoration: "none" }}>Forgot password?</a>
          </div>
          {error && <p style={{ color: "#dc2626", fontSize: "13px", marginBottom: "16px" }}>{error}</p>}
          <button onClick={handleLogin} disabled={loading}
            style={{ width: "100%", padding: "15px", background: loading ? "#2d8a56" : "#1a5c38", color: "#b5f23d", border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer", marginBottom: "16px" }}>
            {loading ? "Logging in..." : "Log in"}
          </button>
          <p style={{ textAlign: "center", color: "#888", fontSize: "13px" }}>
            No account yet?{" "}
            <a href="/trial" style={{ color: "#1a5c38", fontWeight: "600", textDecoration: "none" }}>Start free trial</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>;
}