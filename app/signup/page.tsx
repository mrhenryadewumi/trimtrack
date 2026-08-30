"use client";
import { useEffect } from "react";

export default function SignupRedirect() {
  useEffect(() => {
    window.location.replace("/trial");
  }, []);
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0a1310",
        color: "#b5f23d",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      }}
    >
      <a href="/trial" style={{ color: "#b5f23d", fontWeight: 700 }}>
        Create a free account
      </a>
    </main>
  );
}
