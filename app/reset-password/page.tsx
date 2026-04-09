"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function ResetForm() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const handleReset = async () => {
    setError("");
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, password }),
      });
      const data = await res.json();
      if (data.ok) {
        setDone(true);
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (done) return (
    <div style={{ minHeight: "100vh", background: "#f6fbf8", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <h2 style={{ color: "#1a5c38", fontSize: "22px", fontWeight: "800" }}>Password updated!</h2>
        <p style={{ color: "#666" }}>Redirecting you to login...</p>
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
          <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#0f1f14", marginBottom: "8px" }}>Set new password</h2>
          <p style={{ color: "#666", fontSize: "14px", marginBottom: "28px" }}>Choose a strong password for your TrimTrack account.</p>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "#333", display: "block", marginBottom: "6px" }}>New password</label>
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(""); }}
              placeholder="At least 8 characters"
              style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1.5px solid #e5e7eb", fontSize: "15px", outline: "none", boxSizing: "border-box" }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "#333", display: "block", marginBottom: "6px" }}>Confirm password</label>
            <input
              type="password"
              value={confirm}
              onChange={e => { setConfirm(e.target.value); setError(""); }}
              onKeyDown={e => e.key === "Enter" && handleReset()}
              placeholder="Repeat your password"
              style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1.5px solid #e5e7eb", fontSize: "15px", outline: "none", boxSizing: "border-box" }}
            />
            {error && <p style={{ color: "#dc2626", fontSize: "13px", marginTop: "6px" }}>{error}</p>}
          </div>

          <button
            onClick={handleReset}
            disabled={loading}
            style={{ width: "100%", padding: "15px", background: loading ? "#2d8a56" : "#1a5c38", color: "#b5f23d", border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? "Updating..." : "Update password"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return <Suspense><ResetForm /></Suspense>;
}