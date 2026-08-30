"use client";

import type { CSSProperties, ReactNode } from "react";

const C = {
  bg: "#0a1310",
  card: "#162a20",
  ink: "#ffffff",
  body: "#c9d8ce",
  mut: "#8a9a92",
  faint: "#5f7269",
  acc: "#b5f23d",
  line: "rgba(255,255,255,0.08)",
  input: "#0e1e16",
  danger: "#ff8a5e",
};

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 10,
  border: `1.5px solid ${C.line}`,
  background: C.input,
  color: C.ink,
  fontSize: 15,
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: C.body,
  display: "block",
  marginBottom: 6,
};

const btnStyle = (loading: boolean): CSSProperties => ({
  width: "100%",
  padding: 15,
  background: loading ? "#8dc42a" : C.acc,
  color: C.bg,
  border: "none",
  borderRadius: 12,
  fontSize: 16,
  fontWeight: 800,
  cursor: loading ? "not-allowed" : "pointer",
});

export { C, inputStyle, labelStyle, btnStyle };

export default function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      }}
    >
      <div style={{ maxWidth: 420, width: "100%", boxSizing: "border-box" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <a href="/" style={{ textDecoration: "none" }}>
            <span style={{ fontWeight: 800, fontSize: 22, color: C.ink }}>TrimTrack</span>
          </a>
        </div>
        {children}
      </div>
    </div>
  );
}
