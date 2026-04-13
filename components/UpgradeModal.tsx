"use client";
import { useState } from "react";

const MONTHLY_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID || "";
const ANNUAL_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_ANNUAL_PRICE_ID || "";

interface UpgradeModalProps {
  onClose: () => void;
  sessionId: string;
}

export default function UpgradeModal({ onClose, sessionId }: UpgradeModalProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleUpgrade = async (priceId: string, plan: string) => {
    setLoading(plan);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, sessionId }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000, padding: "20px"
    }}>
      <div style={{
        background: "#fff", borderRadius: "24px", padding: "32px",
        maxWidth: "400px", width: "100%", textAlign: "center"
      }}>
        <div style={{
          width: "64px", height: "64px", background: "#1a5c38",
          borderRadius: "16px", display: "flex", alignItems: "center",
          justifyContent: "center", margin: "0 auto 16px"
        }}>
          <span style={{ fontSize: "28px" }}>📸</span>
        </div>

        <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#0f1f14", marginBottom: "8px" }}>
          You have used your 3 free scans today
        </h2>
        <p style={{ fontSize: "15px", color: "#666", marginBottom: "24px", lineHeight: "1.5" }}>
          Upgrade to Premium for unlimited AI food scanning, reminders, and full history.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
          <button
            onClick={() => handleUpgrade(process.env.NEXT_PUBLIC_STRIPE_ANNUAL_PRICE_ID!, "annual")}
            disabled={loading !== null}
            style={{
              background: "#1a5c38", color: "#b5f23d", border: "none",
              borderRadius: "14px", padding: "16px", fontSize: "16px",
              fontWeight: "700", cursor: "pointer", position: "relative"
            }}
          >
            {loading === "annual" ? "Loading..." : (
              <>
                <div>Annual - GBP19.99/year</div>
                <div style={{ fontSize: "13px", opacity: 0.85, fontWeight: "400", marginTop: "2px" }}>
                  Just GBP1.67/month - Best value
                </div>
                <div style={{
                  position: "absolute", top: "-10px", right: "12px",
                  background: "#b5f23d", color: "#1a5c38", fontSize: "11px",
                  fontWeight: "700", padding: "3px 10px", borderRadius: "100px"
                }}>SAVE 53%</div>
              </>
            )}
          </button>

          <button
            onClick={() => handleUpgrade(process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID!, "monthly")}
            disabled={loading !== null}
            style={{
              background: "#f6fbf8", color: "#1a5c38", border: "2px solid #1a5c38",
              borderRadius: "14px", padding: "16px", fontSize: "16px",
              fontWeight: "700", cursor: "pointer"
            }}
          >
            {loading === "monthly" ? "Loading..." : (
              <>
                <div>Monthly - GBP2.99/month</div>
                <div style={{ fontSize: "13px", color: "#666", fontWeight: "400", marginTop: "2px" }}>
                  Cancel anytime
                </div>
              </>
            )}
          </button>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <div style={{ fontSize: "13px", color: "#888", marginBottom: "8px" }}>What you get:</div>
          {["Unlimited AI food scanning", "Morning & evening reminders", "Barcode scanner", "Full meal history", "Nigerian + 3M+ foods"].map(f => (
            <div key={f} style={{ fontSize: "13px", color: "#333", padding: "4px 0", display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" }}>
              <span style={{ color: "#1a5c38", fontWeight: "700" }}>✓</span> {f}
            </div>
          ))}
        </div>

        <button onClick={onClose} style={{
          background: "none", border: "none", color: "#999",
          fontSize: "14px", cursor: "pointer", padding: "8px"
        }}>
          Maybe later - continue with 0 scans left today
        </button>
      </div>
    </div>
  );
}