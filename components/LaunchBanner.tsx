"use client";
import { usePathname } from "next/navigation";

export default function LaunchBanner() {
  const path = usePathname();
  if (path !== "/") return null;

  return (
    <div
      style={{
        background: "#b5f23d",
        color: "#0a1310",
        textAlign: "center",
        padding: "11px 16px",
        fontSize: 14,
        fontWeight: 700,
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      }}
    >
      The web app is live.{" "}
      <a href="/trial" style={{ color: "#0a1310", textDecoration: "underline" }}>
        Free while we test — create an account
      </a>
      {" · "}
      <a href="/login" style={{ color: "#0a1310", textDecoration: "underline" }}>
        Log in
      </a>
    </div>
  );
}
