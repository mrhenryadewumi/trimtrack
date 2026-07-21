"use client";
import { useState, useEffect } from "react";

const PUB = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";

function urlB64ToUint8Array(b64: string) {
  const pad = "=".repeat((4 - (b64.length % 4)) % 4);
  const s = (b64 + pad).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(s);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

export default function PushButton() {
  const [state, setState] = useState<"idle" | "loading" | "on" | "denied">("idle");

  useEffect(() => {
    if (typeof Notification !== "undefined" && Notification.permission === "granted") setState("on");
    if (typeof Notification !== "undefined" && Notification.permission === "denied") setState("denied");
  }, []);

  async function enable() {
    setState("loading");
    try {
      const perm = await Notification.requestPermission();
      if (perm !== "granted") { setState("denied"); return; }
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlB64ToUint8Array(PUB),
      });
      await fetch("/api/push/subscribe", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription: sub }),
      });
      await fetch("/api/push/send", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Reminders on", body: "We will nudge you to log your meals." }),
      });
      setState("on");
    } catch (e) { setState("idle"); }
  }

  const label = state === "on" ? "Reminders enabled" : state === "loading" ? "Enabling..." : state === "denied" ? "Blocked - enable in browser settings" : "Enable push reminders";

  return (
    <button onClick={enable} disabled={state === "on" || state === "loading" || state === "denied"}
      style={{ width: "100%", padding: "14px", borderRadius: "99px", border: "none",
        background: state === "on" ? "#233020" : "#b5f23d", color: state === "on" ? "#b5f23d" : "#0a1310",
        fontSize: "14px", fontWeight: 800, cursor: state === "on" ? "default" : "pointer",
        fontFamily: "Plus Jakarta Sans, sans-serif" }}>
      {label}
    </button>
  );
}
