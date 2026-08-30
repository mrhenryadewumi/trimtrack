"use client";
import { useState } from "react";
import AuthShell, { C, btnStyle } from "@/components/AuthShell";

export default function UpgradePage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleUpgrade = async (plan: "monthly" | "annual") => {
    setLoading(plan);
    setError("");
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
        credentials: "include",
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <AuthShell>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: C.ink, marginBottom: 8 }}>
          Keep going after the trial
        </h1>
        <p style={{ color: C.body, fontSize: 15, lineHeight: 1.6 }}>
          Thirty days free, no card. After that it is £4.99 a month, or £3.19 a month billed yearly.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
        <div style={{ background: C.card, borderRadius: 20, padding: 24, position: "relative", border: `1px solid ${C.acc}` }}>
          <div
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              background: C.acc,
              color: C.bg,
              fontSize: 11,
              fontWeight: 800,
              padding: "4px 10px",
              borderRadius: 99,
            }}
          >
            BEST VALUE
          </div>
          <div style={{ color: C.mut, fontSize: 13, marginBottom: 4 }}>Yearly</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 }}>
            <span style={{ fontSize: 36, fontWeight: 900, color: C.acc }}>£3.19</span>
            <span style={{ color: C.mut, fontSize: 14 }}>/month</span>
          </div>
          <div style={{ color: C.mut, fontSize: 13, marginBottom: 20 }}>Billed £38.28 once a year. Cancel anytime.</div>
          <button onClick={() => handleUpgrade("annual")} disabled={loading === "annual"} style={btnStyle(loading === "annual")}>
            {loading === "annual" ? "Loading..." : "Get yearly plan"}
          </button>
        </div>

        <div style={{ background: C.card, borderRadius: 20, padding: 24, border: `1px solid ${C.line}` }}>
          <div style={{ color: C.mut, fontSize: 13, marginBottom: 4 }}>Monthly</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 }}>
            <span style={{ fontSize: 36, fontWeight: 900, color: C.ink }}>£4.99</span>
            <span style={{ color: C.mut, fontSize: 14 }}>/month</span>
          </div>
          <div style={{ color: C.faint, fontSize: 13, marginBottom: 20 }}>Cancel anytime</div>
          <button
            onClick={() => handleUpgrade("monthly")}
            disabled={loading === "monthly"}
            style={{
              ...btnStyle(loading === "monthly"),
              background: "transparent",
              color: C.acc,
              border: `1px solid ${C.acc}`,
            }}
          >
            {loading === "monthly" ? "Loading..." : "Get monthly plan"}
          </button>
        </div>
      </div>

      {error && <p style={{ color: C.danger, fontSize: 13, textAlign: "center", marginBottom: 16 }}>{error}</p>}

      <div style={{ background: C.card, borderRadius: 16, padding: 20, border: `1px solid ${C.line}`, marginBottom: 20 }}>
        <div style={{ fontWeight: 700, color: C.ink, marginBottom: 12, fontSize: 14 }}>Everything included:</div>
        {[
          "Unlimited AI food scanning",
          "West African food database",
          "Daily meal plans for your culture",
          "Morning and evening reminders",
          "Food statement history",
          "Weight progress tracking",
        ].map((f) => (
          <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", fontSize: 14, color: C.body }}>
            <span style={{ color: C.acc, fontWeight: 700 }}>✓</span> {f}
          </div>
        ))}
      </div>

      <p style={{ textAlign: "center", color: C.faint, fontSize: 12 }}>
        Secure payment via Stripe. Cancel anytime. No hidden fees.
      </p>
    </AuthShell>
  );
}
