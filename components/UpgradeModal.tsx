"use client";

interface UpgradeModalProps {
  onClose: () => void;
  sessionId: string;
}

export default function UpgradeModal({ onClose }: UpgradeModalProps) {
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
        <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#0f1f14", marginBottom: "8px" }}>
          It is free while we test
        </h2>
        <p style={{ fontSize: "15px", color: "#666", marginBottom: "24px", lineHeight: "1.5" }}>
          No card. Payments are switched off. Use TrimTrack and tell us what to fix.
        </p>
        <button onClick={onClose} style={{
          background: "#1a5c38", color: "#b5f23d", border: "none",
          borderRadius: "14px", padding: "14px 20px", fontSize: "16px",
          fontWeight: "700", cursor: "pointer"
        }}>
          Back to the diary
        </button>
      </div>
    </div>
  );
}
