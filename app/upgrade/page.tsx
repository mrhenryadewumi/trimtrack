"use client";
import AuthShell, { C, btnStyle } from "@/components/AuthShell";

export default function UpgradePage() {
  return (
    <AuthShell>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: C.ink, marginBottom: 12 }}>
          It is free while we test
        </h1>
        <p style={{ color: C.body, fontSize: 15, lineHeight: 1.6, marginBottom: 28 }}>
          No card. Use TrimTrack and tell us what to fix.
          If it ever becomes a paid product, we will say so first.
        </p>
        <a href="/dashboard" style={{ ...btnStyle(false), display: "inline-block", textDecoration: "none" }}>
          Open your diary
        </a>
      </div>
    </AuthShell>
  );
}
