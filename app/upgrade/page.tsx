"use client";
import { useState } from "react";

export default function UpgradePage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleUpgrade = async (plan: "monthly" | "annual") => {
    setLoading(plan);
    try {
      const sessionId = localStorage.getItem("sessionId") || "";
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, sessionId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f6fbf8", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ maxWidth: "480px", width: "100%" }}>

        {/* HEADER */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <a href="/" style={{ textDecoration: "none" }}>
            <span style={{ fontWeight: 800, fontSize: "22px", color: "#1a5c38" }}>TrimTrack</span>
          </a>
          <div style={{ marginTop: "24px", width: "64px", height: "64px", background: "#fef3c7", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", margin: "24px auto 16px" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#0f1f14", marginBottom: "8px" }}>Your free trial has ended</h1>
          <p style={{ color: "#888", fontSize: "15px", lineHeight: "1.6" }}>
            You have been tracking your calories for 30 days. Continue your journey with a TrimTrack premium plan.
          </p>
        </div>

        {/* PLANS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>

          {/* ANNUAL - recommended */}
          <div style={{ background: "#1a5c38", borderRadius: "20px", padding: "24px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: "12px", right: "12px", background: "#b5f23d", color: "#1a5c38", fontSize: "11px", fontWeight: 800, padding: "4px 10px", borderRadius: "99px" }}>BEST VALUE</div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", marginBottom: "4px" }}>Annual plan</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "4px" }}>
              <span style={{ fontSize: "36px", fontWeight: 900, color: "#b5f23d" }}>GBP 19.99</span>
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>/year</span>
            </div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", marginBottom: "20px" }}>Just GBP 1.67/month - save 44%</div>
            <button onClick={() => handleUpgrade("annual")} disabled={loading === "annual"}
              style={{ width: "100%", padding: "14px", background: "#b5f23d", color: "#1a5c38", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: 800, cursor: loading === "annual" ? "not-allowed" : "pointer" }}>
              {loading === "annual" ? "Loading..." : "Get annual plan"}
            </button>
          </div>

          {/* MONTHLY */}
          <div style={{ background: "white", borderRadius: "20px", padding: "24px", border: "1px solid #e5e7eb" }}>
            <div style={{ color: "#888", fontSize: "13px", marginBottom: "4px" }}>Monthly plan</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "4px" }}>
              <span style={{ fontSize: "36px", fontWeight: 900, color: "#0f1f14" }}>GBP 2.99</span>
              <span style={{ color: "#888", fontSize: "14px" }}>/month</span>
            </div>
            <div style={{ color: "#aaa", fontSize: "13px", marginBottom: "20px" }}>Cancel anytime</div>
            <button onClick={() => handleUpgrade("monthly")} disabled={loading === "monthly"}
              style={{ width: "100%", padding: "14px", background: "#1a5c38", color: "#b5f23d", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: 700, cursor: loading === "monthly" ? "not-allowed" : "pointer" }}>
              {loading === "monthly" ? "Loading..." : "Get monthly plan"}
            </button>
          </div>
        </div>

        {/* FEATURES */}
        <div style={{ background: "white", borderRadius: "16px", padding: "20px", border: "1px solid #f0f0f0", marginBottom: "20px" }}>
          <div style={{ fontWeight: 700, color: "#0f1f14", marginBottom: "12px", fontSize: "14px" }}>Everything included:</div>
          {[
            "Unlimited AI food scanning",
            "African food database - 500+ foods",
            "Daily meal plans for your culture",
            "Morning and evening reminders",
            "Barcode scanner",
            "Food statement history",
            "Weight progress tracking",
            "Exercise recommendations",
          ].map(f => (
            <div key={f} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "6px 0", fontSize: "14px", color: "#555" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              {f}
            </div>
          ))}
        </div>

        <p style={{ textAlign: "center", color: "#aaa", fontSize: "12px" }}>
          Secure payment via Stripe. Cancel anytime. No hidden fees.
        </p>
      </div>
    </div>
  );
}