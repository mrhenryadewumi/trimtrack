"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getSessionId } from "@/lib/api-client";

const STARTERS = [
  "What should I eat for dinner?",
  "How am I doing today?",
  "Swap ideas for fried plantain?",
  "Why am I not losing weight?",
];

export default function CoachPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [msgs, setMsgs] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [draft, setDraft] = useState("");
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sid = typeof window !== "undefined" ? getSessionId() : "";

  useEffect(() => {
    fetch("/api/profile", { credentials: "include" })
      .then(r => r.json())
      .then(data => { if (data?.name) setProfile(data); else router.push("/login"); })
      .catch(() => router.push("/login"));
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs, thinking]);

  const send = async (text?: string) => {
    const t = (text ?? draft).trim();
    if (!t || thinking) return;
    setDraft("");
    const next = [...msgs, { role: "user" as const, content: t }];
    setMsgs(next);
    setThinking(true);
    try {
      const res = await fetch("/api/coach", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sid, message: t, history: msgs }),
      });
      const data = await res.json();
      setMsgs(m => [...m, { role: "assistant", content: data.reply || data.error || "Sorry, I couldn't answer that right now." }]);
    } catch {
      setMsgs(m => [...m, { role: "assistant", content: "Network hiccup - try again in a moment." }]);
    } finally {
      setThinking(false);
    }
  };

  return (
    <div style={{ height: "100dvh", display: "flex", flexDirection: "column" as const, background: "#0a1310", color: "#fff", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div style={{ maxWidth: "540px", margin: "0 auto", width: "100%", display: "flex", flexDirection: "column" as const, height: "100%", boxSizing: "border-box" as const }}>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "16px 16px 12px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <a href="/dashboard" style={{ width: "36px", height: "36px", borderRadius: "12px", background: "#162a20", display: "flex", alignItems: "center", justifyContent: "center", color: "#8a9a92", fontSize: "16px", textDecoration: "none", flexShrink: 0 }}>←</a>
          <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "linear-gradient(135deg,#1a5c38,#0f3d25)", border: "1.5px solid rgba(181,242,61,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 }}>🥑</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "15px", fontWeight: 800 }}>Trim - your coach</div>
            <div style={{ fontSize: "11px", color: "#b5f23d", display: "flex", alignItems: "center", gap: "5px" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#b5f23d" }} />Knows your day. Ask anything.
            </div>
          </div>
        </div>

        <div ref={scrollRef} style={{ flex: 1, overflowY: "auto" as const, padding: "16px", display: "flex", flexDirection: "column" as const, gap: "10px" }}>
          <div style={{ alignSelf: "flex-start", maxWidth: "85%", background: "#162a20", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "4px 16px 16px 16px", padding: "12px 15px", fontSize: "13.5px", lineHeight: 1.55, color: "#dce8de" }}>
            {profile ? `Hi ${profile.name}! I can see your day so far - ask me what to eat, how you're doing, or anything food-related. 🥑` : "Loading your day…"}
          </div>
          {msgs.map((m, i) => (
            <div key={i} style={m.role === "user"
              ? { alignSelf: "flex-end", maxWidth: "85%", background: "#b5f23d", color: "#0a1310", borderRadius: "16px 4px 16px 16px", padding: "12px 15px", fontSize: "13.5px", lineHeight: 1.55, fontWeight: 600, whiteSpace: "pre-wrap" as const }
              : { alignSelf: "flex-start", maxWidth: "85%", background: "#162a20", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "4px 16px 16px 16px", padding: "12px 15px", fontSize: "13.5px", lineHeight: 1.55, color: "#dce8de", whiteSpace: "pre-wrap" as const }}>
              {m.content}
            </div>
          ))}
          {thinking && (
            <div style={{ alignSelf: "flex-start", background: "#162a20", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "4px 16px 16px 16px", padding: "14px 18px", display: "flex", gap: "5px", alignItems: "center" }}>
              {[0, 1, 2].map(i => (
                <span key={i} style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#5f7269", animation: `coachdot 1.2s ${i * 0.18}s infinite ease-in-out` }} />
              ))}
              <style>{`@keyframes coachdot { 0%,80%,100%{opacity:.25;transform:translateY(0)} 40%{opacity:1;transform:translateY(-3px)} }`}</style>
            </div>
          )}
          {msgs.length === 0 && !thinking && (
            <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "8px", marginTop: "6px" }}>
              {STARTERS.map(s => (
                <button key={s} onClick={() => send(s)} style={{ border: "1px solid rgba(181,242,61,0.3)", background: "rgba(181,242,61,0.08)", color: "#b5f23d", borderRadius: "99px", padding: "9px 14px", fontSize: "12px", fontWeight: 700, cursor: "pointer", minHeight: "38px" }}>{s}</button>
              ))}
            </div>
          )}
        </div>

        <div style={{ padding: "12px 16px calc(16px + env(safe-area-inset-bottom))", borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(10,19,16,0.95)", display: "flex", gap: "10px", alignItems: "center" }}>
          <input value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => { if (e.key === "Enter") send(); }} placeholder="Ask Trim anything…"
            style={{ flex: 1, background: "#162a20", border: "1px solid rgba(255,255,255,0.1)", outline: "none", borderRadius: "99px", padding: "13px 17px", fontSize: "13px", color: "#fff", fontFamily: "'Plus Jakarta Sans', sans-serif" }} />
          <button onClick={() => send()} disabled={thinking} style={{ width: "44px", height: "44px", borderRadius: "50%", background: "#b5f23d", border: "none", color: "#0a1310", fontWeight: 800, fontSize: "17px", cursor: thinking ? "not-allowed" : "pointer", flexShrink: 0, opacity: thinking ? 0.6 : 1 }}>↑</button>
        </div>
      </div>
    </div>
  );
}