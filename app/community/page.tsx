"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSessionId } from "@/lib/api-client";

const KINDS = [
  { key: "journey", label: "Journeys", badge: "Journey", color: "#b5f23d", bg: "rgba(181,242,61,0.12)" },
  { key: "idea", label: "Ideas", badge: "💡 Idea", color: "#5e9bff", bg: "rgba(94,155,255,0.14)" },
  { key: "recipe", label: "Recipes", badge: "🍲 Recipe", color: "#f5c542", bg: "rgba(245,197,66,0.14)" },
  { key: "question", label: "Q&A", badge: "❓ Question", color: "#ff8a5e", bg: "rgba(255,138,94,0.14)" },
];
const AVATAR_BGS = ["#3a4a2b", "#2b4a3a", "#4a3a2b", "#2b3a4a", "#42304a"];
const initials = (n: string) => (n || "M").split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
const avatarBg = (n: string) => AVATAR_BGS[(n || "M").split("").reduce((s, c) => s + c.charCodeAt(0), 0) % AVATAR_BGS.length];
const timeAgo = (iso: string) => {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

export default function CommunityPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [tab, setTab] = useState("journey");
  const [loading, setLoading] = useState(true);
  const [composerOpen, setComposerOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [draftKind, setDraftKind] = useState("journey");
  const [posting, setPosting] = useState(false);
  const [openThread, setOpenThread] = useState<string | null>(null);
  const [replies, setReplies] = useState<Record<string, any[]>>({});
  const [replyDraft, setReplyDraft] = useState("");

  const sid = typeof window !== "undefined" ? getSessionId() : "";

  const loadFeed = async () => {
    const res = await fetch(`/api/community?session_id=${sid}`, { credentials: "include" });
    if (res.status === 401) { router.push("/login"); return; }
    const data = await res.json();
    setPosts(data.posts || []);
  };

  useEffect(() => {
    fetch("/api/profile", { credentials: "include" })
      .then(r => r.json())
      .then(data => { if (data?.name) setProfile(data); else router.push("/login"); })
      .catch(() => router.push("/login"));
    loadFeed().finally(() => setLoading(false));
  }, []);

  const toggleCheer = async (p: any) => {
    setPosts(ps => ps.map(x => x.id === p.id ? { ...x, cheered: !x.cheered, cheer_count: x.cheer_count + (x.cheered ? -1 : 1) } : x));
    await fetch("/api/community/cheer", {
      method: "POST", credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sid, post_id: p.id }),
    });
  };

  const openReplies = async (p: any) => {
    if (openThread === p.id) { setOpenThread(null); return; }
    setOpenThread(p.id);
    const res = await fetch(`/api/community/replies?post_id=${p.id}`, { credentials: "include" });
    const data = await res.json();
    setReplies(r => ({ ...r, [p.id]: data.replies || [] }));
  };

  const sendReply = async (p: any) => {
    const text = replyDraft.trim();
    if (!text) return;
    setReplyDraft("");
    const res = await fetch("/api/community/replies", {
      method: "POST", credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sid, post_id: p.id, body: text }),
    });
    const data = await res.json();
    if (data.ok) {
      setReplies(r => ({ ...r, [p.id]: [...(r[p.id] || []), data.reply] }));
      setPosts(ps => ps.map(x => x.id === p.id ? { ...x, reply_count: x.reply_count + 1 } : x));
    }
  };

  const publish = async () => {
    const text = draft.trim();
    if (!text) return;
    setPosting(true);
    const res = await fetch("/api/community", {
      method: "POST", credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sid, kind: draftKind, body: text }),
    });
    const data = await res.json();
    setPosting(false);
    if (data.ok) {
      setDraft(""); setComposerOpen(false); setTab(draftKind);
      loadFeed();
    }
  };

  const kindMeta = (k: string) => KINDS.find(x => x.key === k) || KINDS[0];
  const filtered = posts.filter(p => p.kind === tab);

  return (
    <div style={{ minHeight: "100vh", background: "#0a1310", color: "#fff", paddingBottom: "96px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div style={{ maxWidth: "540px", margin: "0 auto", padding: "20px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
          <div>
            <div style={{ fontSize: "21px", fontWeight: 800 }}>Community</div>
            <div style={{ fontSize: "12px", color: "#5f7269" }}>Share your journey. Cheer others on.</div>
          </div>
          <a href="/profile" style={{ width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg,#1a5c38,#0f3d25)", display: "flex", alignItems: "center", justifyContent: "center", color: "#b5f23d", fontWeight: 800, fontSize: "15px", textDecoration: "none" }}>
            {profile?.name?.[0]?.toUpperCase() || "U"}
          </a>
        </div>

        <div style={{ display: "flex", gap: "8px", marginBottom: "14px", overflowX: "auto" as const, paddingBottom: "4px" }}>
          {KINDS.map(k => (
            <button key={k.key} onClick={() => setTab(k.key)}
              style={{ padding: "8px 15px", borderRadius: "99px", border: tab === k.key ? "1px solid #b5f23d" : "1px solid rgba(255,255,255,0.14)", background: tab === k.key ? "#b5f23d" : "transparent", color: tab === k.key ? "#0a1310" : "#8a9a92", fontWeight: tab === k.key ? 800 : 600, fontSize: "12px", cursor: "pointer", whiteSpace: "nowrap" as const, flexShrink: 0, minHeight: "36px" }}>
              {k.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#5f7269" }}>Loading the circle…</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 20px", background: "#162a20", borderRadius: "22px", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>🌱</div>
            <div style={{ fontWeight: 700, marginBottom: "6px" }}>No {kindMeta(tab).label.toLowerCase()} yet</div>
            <div style={{ color: "#8a9a92", fontSize: "13px", marginBottom: "18px" }}>Be the first — your story might be exactly what someone needs today.</div>
            <button onClick={() => { setDraftKind(tab); setComposerOpen(true); }} style={{ background: "#b5f23d", color: "#0a1310", padding: "12px 24px", borderRadius: "99px", border: "none", fontWeight: 800, fontSize: "13px", cursor: "pointer" }}>Write the first post</button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" as const, gap: "10px" }}>
            {filtered.map(p => (
              <div key={p.id} style={{ background: p.mine ? "rgba(181,242,61,0.06)" : "#162a20", border: p.mine ? "1px solid rgba(181,242,61,0.2)" : "1px solid rgba(255,255,255,0.05)", borderRadius: "20px", padding: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                  <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: p.mine ? "linear-gradient(135deg,#1a5c38,#0f3d25)" : avatarBg(p.author_name), display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "13px", color: p.mine ? "#b5f23d" : "#fff", flexShrink: 0 }}>{initials(p.author_name)}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "13px", fontWeight: 700 }}>
                      {p.author_name}
                      {p.mine && <span style={{ fontSize: "10px", background: "rgba(181,242,61,0.12)", color: "#b5f23d", padding: "2px 7px", borderRadius: "99px", marginLeft: "6px" }}>You</span>}
                      <span style={{ fontSize: "10px", background: kindMeta(p.kind).bg, color: kindMeta(p.kind).color, padding: "2px 7px", borderRadius: "99px", marginLeft: "6px" }}>{kindMeta(p.kind).badge}</span>
                    </div>
                    <div style={{ fontSize: "11px", color: "#5f7269" }}>{timeAgo(p.created_at)}</div>
                  </div>
                  {p.mine && (
                    <button onClick={async () => { await fetch("/api/community", { method: "DELETE", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ session_id: sid, id: p.id }) }); setPosts(ps => ps.filter(x => x.id !== p.id)); }}
                      style={{ background: "transparent", border: "none", color: "#5f7269", fontSize: "15px", cursor: "pointer", minHeight: "auto", padding: "4px 6px" }}>×</button>
                  )}
                </div>
                <div style={{ fontSize: "13px", lineHeight: 1.55, color: "#c9d8ce", marginBottom: "12px", whiteSpace: "pre-wrap" as const }}>{p.body}</div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <button onClick={() => toggleCheer(p)}
                    style={{ display: "flex", alignItems: "center", gap: "6px", background: p.cheered ? "rgba(181,242,61,0.3)" : "rgba(181,242,61,0.12)", borderRadius: "99px", padding: "7px 13px", fontSize: "12px", fontWeight: 700, color: "#b5f23d", border: "none", cursor: "pointer", minHeight: "36px" }}>
                    👏 {p.cheer_count}
                  </button>
                  <button onClick={() => openReplies(p)}
                    style={{ display: "flex", alignItems: "center", gap: "6px", border: "1px solid rgba(255,255,255,0.12)", background: "transparent", borderRadius: "99px", padding: "7px 13px", fontSize: "12px", fontWeight: 600, color: "#8a9a92", cursor: "pointer", minHeight: "36px" }}>
                    💬 {p.reply_count}
                  </button>
                </div>

                {openThread === p.id && (
                  <div style={{ marginTop: "12px", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "12px" }}>
                    <div style={{ display: "flex", flexDirection: "column" as const, gap: "8px", marginBottom: "10px" }}>
                      {(replies[p.id] || []).map((r: any) => (
                        <div key={r.id} style={{ display: "flex", gap: "9px" }}>
                          <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: avatarBg(r.author_name), display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "10px", flexShrink: 0 }}>{initials(r.author_name)}</div>
                          <div style={{ flex: 1, background: "#0e1e16", borderRadius: "4px 14px 14px 14px", padding: "9px 12px" }}>
                            <div style={{ fontSize: "11px", fontWeight: 700, marginBottom: "2px" }}>{r.author_name} <span style={{ color: "#5f7269", fontWeight: 500, fontSize: "10px" }}>· {timeAgo(r.created_at)}</span></div>
                            <div style={{ fontSize: "12.5px", lineHeight: 1.5, color: "#c9d8ce" }}>{r.body}</div>
                          </div>
                        </div>
                      ))}
                      {(replies[p.id] || []).length === 0 && <div style={{ fontSize: "12px", color: "#5f7269", padding: "4px 2px" }}>No replies yet — start the conversation.</div>}
                    </div>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <input value={replyDraft} onChange={e => setReplyDraft(e.target.value)} onKeyDown={e => { if (e.key === "Enter") sendReply(p); }} placeholder={`Reply to ${p.author_name.split(" ")[0]}…`}
                        style={{ flex: 1, background: "#0e1e16", border: "1px solid rgba(255,255,255,0.1)", outline: "none", borderRadius: "99px", padding: "10px 15px", fontSize: "13px", color: "#fff", fontFamily: "'Plus Jakarta Sans', sans-serif" }} />
                      <button onClick={() => sendReply(p)} style={{ width: "38px", height: "38px", borderRadius: "50%", background: "#b5f23d", border: "none", color: "#0a1310", fontWeight: 800, fontSize: "15px", cursor: "pointer", flexShrink: 0, minHeight: "38px" }}>↑</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ position: "fixed" as const, bottom: "88px", right: "16px", zIndex: 40 }}>
        <button onClick={() => { setDraftKind(tab); setComposerOpen(true); }}
          style={{ background: "#b5f23d", color: "#0a1310", borderRadius: "99px", padding: "13px 19px", fontSize: "13px", fontWeight: 800, border: "none", cursor: "pointer", boxShadow: "0 10px 24px -6px rgba(181,242,61,0.5)" }}>
          ✍️ Share
        </button>
      </div>

      {composerOpen && (
        <div onClick={() => setComposerOpen(false)} style={{ position: "fixed" as const, inset: 0, background: "rgba(4,8,6,0.72)", backdropFilter: "blur(4px)", zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: "480px", background: "#132218", border: "1px solid rgba(181,242,61,0.18)", borderRadius: "24px", padding: "20px" }}>
            <div style={{ fontSize: "16px", fontWeight: 800, marginBottom: "4px" }}>Share with your circle ✍️</div>
            <div style={{ fontSize: "12px", color: "#8a9a92", marginBottom: "14px" }}>Milestones, lessons, recipes, questions — someone needs to hear it.</div>
            <div style={{ display: "flex", gap: "7px", marginBottom: "12px", flexWrap: "wrap" as const }}>
              {KINDS.map(k => (
                <button key={k.key} onClick={() => setDraftKind(k.key)}
                  style={{ padding: "7px 13px", borderRadius: "99px", border: draftKind === k.key ? "1px solid #b5f23d" : "1px solid rgba(255,255,255,0.14)", background: draftKind === k.key ? "#b5f23d" : "transparent", color: draftKind === k.key ? "#0a1310" : "#8a9a92", fontWeight: draftKind === k.key ? 800 : 600, fontSize: "12px", cursor: "pointer", minHeight: "36px" }}>
                  {k.label}
                </button>
              ))}
            </div>
            <textarea value={draft} onChange={e => setDraft(e.target.value)} rows={5} placeholder="What's working? What's been hard?"
              style={{ width: "100%", boxSizing: "border-box" as const, background: "#0e1e16", border: "1px solid rgba(255,255,255,0.08)", outline: "none", borderRadius: "14px", padding: "13px 15px", fontSize: "13px", lineHeight: 1.5, color: "#fff", fontFamily: "'Plus Jakarta Sans', sans-serif", resize: "none" as const, marginBottom: "14px" }} />
            <div style={{ display: "flex", gap: "9px" }}>
              <button onClick={() => setComposerOpen(false)} style={{ flex: 1, border: "1px solid rgba(255,255,255,0.14)", background: "transparent", borderRadius: "99px", padding: "12px", fontSize: "13px", fontWeight: 700, color: "#8a9a92", cursor: "pointer" }}>Cancel</button>
              <button onClick={publish} disabled={posting} style={{ flex: 1, background: "#b5f23d", color: "#0a1310", borderRadius: "99px", padding: "12px", fontSize: "13px", fontWeight: 800, border: "none", cursor: posting ? "not-allowed" : "pointer", opacity: posting ? 0.7 : 1 }}>{posting ? "Posting…" : "Post"}</button>
            </div>
          </div>
        </div>
      )}

      <nav style={{ position: "fixed" as const, bottom: 0, left: 0, right: 0, height: "72px", background: "rgba(10,19,16,0.92)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-around", alignItems: "center", padding: "0 8px", zIndex: 50 }}>
        <a href="/dashboard" style={{ color: "#5f7269", fontWeight: 600, fontSize: "11px", textDecoration: "none", padding: "6px 10px" }}>Home</a>
        <a href="/community" style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", gap: "3px", color: "#b5f23d", fontWeight: 800, fontSize: "11px", textDecoration: "none", padding: "6px 10px" }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#b5f23d" }} />Community
        </a>
        <a href="/dashboard" style={{ width: "52px", height: "52px", borderRadius: "50%", background: "#b5f23d", color: "#0a1310", fontSize: "26px", fontWeight: 700, marginTop: "-26px", boxShadow: "0 8px 20px -4px rgba(181,242,61,0.5)", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>+</a>
        <a href="/statements" style={{ color: "#5f7269", fontWeight: 600, fontSize: "11px", textDecoration: "none", padding: "6px 10px" }}>Statement</a>
        <a href="/profile" style={{ color: "#5f7269", fontWeight: 600, fontSize: "11px", textDecoration: "none", padding: "6px 10px" }}>Profile</a>
      </nav>
    </div>
  );
}