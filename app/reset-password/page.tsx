"use client";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AuthShell, { C, inputStyle, labelStyle, btnStyle } from "@/components/AuthShell";

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
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
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

  if (done) {
    return (
      <AuthShell>
        <div style={{ textAlign: "center" }}>
          <h2 style={{ color: C.acc, fontSize: 22, fontWeight: 800 }}>Password updated</h2>
          <p style={{ color: C.body }}>Redirecting you to login…</p>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <div style={{ background: C.card, borderRadius: 20, padding: 32, border: `1px solid ${C.line}` }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: C.ink, marginBottom: 8 }}>Set new password</h2>
        <p style={{ color: C.mut, fontSize: 14, marginBottom: 28 }}>Choose a strong password for your TrimTrack account.</p>

        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>New password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            placeholder="At least 8 characters"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Confirm password</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => {
              setConfirm(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleReset()}
            placeholder="Repeat your password"
            style={inputStyle}
          />
          {error && <p style={{ color: C.danger, fontSize: 13, marginTop: 6 }}>{error}</p>}
        </div>

        <button onClick={handleReset} disabled={loading} style={btnStyle(loading)}>
          {loading ? "Updating..." : "Update password"}
        </button>
      </div>
    </AuthShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetForm />
    </Suspense>
  );
}
