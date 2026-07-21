"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function StatementsPage() {
  const router = useRouter();
  const [statements, setStatements] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetch("/api/profile", { credentials: "include" })
      .then(r => r.json())
      .then(data => { if (data?.name) setProfile(data); else router.push("/login"); })
      .catch(() => router.push("/login"));

    const now = new Date();
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    setFrom(firstOfMonth.toISOString().split("T")[0]);
    setTo(now.toISOString().split("T")[0]);
  }, []);

  const generateStatement = async () => {
    if (!from || !to) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/statements?from=${from}&to=${to}&limit=100`, { credentials: "include" });
      const data = await res.json();
      if (res.status === 401) { router.push("/login"); return; }
      setStatements(data.statements || []);
      setGenerated(true);

      if ((data.statements || []).length === 0) {
        await buildStatementsFromMeals(from, to);
      }
    } finally {
      setLoading(false);
    }
  };

  const buildStatementsFromMeals = async (fromDate: string, toDate: string) => {
    try {
      const res = await fetch(`/api/statements/build?from=${fromDate}&to=${toDate}`, { credentials: "include" });
      if (res.ok) {
        const res2 = await fetch(`/api/statements?from=${fromDate}&to=${toDate}&limit=100`, { credentials: "include" });
        const data = await res2.json();
        setStatements(data.statements || []);
      }
    } catch(e) { console.error(e); }
  };

  const totalKcal = statements.reduce((s, r) => s + (r.total_kcal || 0), 0);
  const avgKcal = statements.length > 0 ? Math.round(totalKcal / statements.length) : 0;
  const onTrackDays = statements.filter(r => r.status !== "over").length;
  const overDays = statements.filter(r => r.status === "over").length;
  const deficit = statements.reduce((s, r) => s + (r.goal_kcal || 1500), 0) - totalKcal;

  const statusLabel = (s: string) => s === "on_track" ? "On track" : s === "under" ? "Under goal" : "Over goal";
  const statusDot = (s: string) => s === "over" ? "#ff8a5e" : s === "under" ? "#5e9bff" : "#b5f23d";
  const formatDate = (d: string) => new Date(d + "T12:00:00").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });

  const exportStatement = () => {
    const lines = [
      "TRIMTRACK FOOD STATEMENT",
      "=".repeat(50),
      `Account holder: ${profile?.name || "User"}`,
      `Email: ${profile?.email || ""}`,
      `Period: ${from} to ${to}`,
      `Generated: ${new Date().toLocaleDateString("en-GB")}`,
      "=".repeat(50),
      "",
      "SUMMARY",
      "-".repeat(50),
      `Total days tracked: ${statements.length}`,
      `Average daily intake: ${avgKcal} kcal`,
      `Total calories eaten: ${totalKcal.toLocaleString()} kcal`,
      `Net calorie ${deficit >= 0 ? "deficit" : "surplus"}: ${Math.abs(deficit).toLocaleString()} kcal`,
      `Days on track: ${onTrackDays}`,
      `Days over goal: ${overDays}`,
      "",
      "DAILY TRANSACTIONS",
      "-".repeat(50),
      ...statements.map(s => `${formatDate(s.date).padEnd(30)} ${String(s.total_kcal).padStart(5)} kcal  [${statusLabel(s.status)}]  ${s.meals_count} meals`),
      "",
      "=".repeat(50),
      "End of statement - TrimTrack | trimtrack.fit",
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `trimtrack-statement-${from}-to-${to}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a1310", color: "#fff", paddingBottom: "96px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div style={{ maxWidth: "580px", margin: "0 auto", padding: "20px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
          <a href="/dashboard" style={{ width: "36px", height: "36px", borderRadius: "12px", background: "#162a20", display: "flex", alignItems: "center", justifyContent: "center", color: "#8a9a92", fontSize: "16px", textDecoration: "none" }}>←</a>
          <h1 style={{ fontSize: "17px", fontWeight: 800, margin: 0 }}>Food Statement</h1>
        </div>
        <p style={{ color: "#5f7269", fontSize: "13px", margin: "0 2px 18px" }}>Your complete nutrition history. Like a bank statement for food.</p>

        <div style={{ background: "linear-gradient(135deg, #1a5c38 0%, #0f3d25 100%)", borderRadius: "22px", padding: "22px", marginBottom: "12px", border: "1px solid rgba(181,242,61,0.15)" }}>
          <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>Account holder</div>
          <div style={{ fontSize: "19px", fontWeight: 800, color: "white", marginBottom: "2px" }}>{profile?.name || "Loading..."}</div>
          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)", marginBottom: "16px" }}>{profile?.email || ""}</div>
          <div style={{ display: "flex", gap: "24px" }}>
            <div>
              <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)", marginBottom: "2px" }}>Daily goal</div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "17px", fontWeight: 700, color: "#b5f23d" }}>{(profile?.dailyCalorieGoal || 1500).toLocaleString()} kcal</div>
            </div>
            <div>
              <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)", marginBottom: "2px" }}>Plan</div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "17px", fontWeight: 700, color: "#b5f23d", textTransform: "capitalize" }}>{profile?.plan || "Trial"}</div>
            </div>
          </div>
        </div>

        <div style={{ background: "#162a20", borderRadius: "22px", padding: "22px", marginBottom: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ fontWeight: 800, fontSize: "11px", color: "#5f7269", letterSpacing: "0.12em", marginBottom: "16px" }}>GENERATE STATEMENT</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
            <div>
              <label style={{ fontSize: "10px", fontWeight: 700, color: "#5f7269", display: "block", marginBottom: "6px", letterSpacing: "0.08em" }}>FROM</label>
              <input type="date" value={from} onChange={e => setFrom(e.target.value)}
                style={{ width: "100%", padding: "10px 12px", borderRadius: "12px", border: "1.5px solid rgba(255,255,255,0.13)", fontSize: "14px", outline: "none", boxSizing: "border-box" as const, background: "#0e1e16", color: "#fff", colorScheme: "dark" as const }} />
            </div>
            <div>
              <label style={{ fontSize: "10px", fontWeight: 700, color: "#5f7269", display: "block", marginBottom: "6px", letterSpacing: "0.08em" }}>TO</label>
              <input type="date" value={to} onChange={e => setTo(e.target.value)}
                style={{ width: "100%", padding: "10px 12px", borderRadius: "12px", border: "1.5px solid rgba(255,255,255,0.13)", fontSize: "14px", outline: "none", boxSizing: "border-box" as const, background: "#0e1e16", color: "#fff", colorScheme: "dark" as const }} />
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" as const }}>
            {[
              { label: "This month", fn: () => { const n = new Date(); setFrom(new Date(n.getFullYear(), n.getMonth(), 1).toISOString().split("T")[0]); setTo(n.toISOString().split("T")[0]); }},
              { label: "Last 7 days", fn: () => { const n = new Date(); const w = new Date(n); w.setDate(w.getDate()-7); setFrom(w.toISOString().split("T")[0]); setTo(n.toISOString().split("T")[0]); }},
              { label: "Last 30 days", fn: () => { const n = new Date(); const m = new Date(n); m.setDate(m.getDate()-30); setFrom(m.toISOString().split("T")[0]); setTo(n.toISOString().split("T")[0]); }},
            ].map(q => (
              <button key={q.label} onClick={q.fn} style={{ padding: "8px 14px", borderRadius: "99px", border: "1px solid rgba(255,255,255,0.14)", background: "transparent", color: "#8a9a92", fontSize: "12px", fontWeight: 600, cursor: "pointer", minHeight: "36px" }}>{q.label}</button>
            ))}
          </div>
          <button onClick={generateStatement} disabled={loading}
            style={{ width: "100%", padding: "14px", background: "#b5f23d", color: "#0a1310", border: "none", borderRadius: "99px", fontSize: "14px", fontWeight: 800, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, boxShadow: "0 10px 26px -8px rgba(181,242,61,0.45)" }}>
            {loading ? "Generating..." : "Generate Statement"}
          </button>
        </div>

        {generated && (
          statements.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 20px", background: "#162a20", borderRadius: "22px", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>📋</div>
              <div style={{ fontWeight: 700, marginBottom: "6px" }}>No records for this period</div>
              <div style={{ color: "#8a9a92", fontSize: "13px", marginBottom: "16px" }}>Log meals on the dashboard to build your food statement.</div>
              <a href="/dashboard" style={{ display: "inline-block", background: "#b5f23d", color: "#0a1310", padding: "12px 24px", borderRadius: "99px", textDecoration: "none", fontWeight: 800, fontSize: "13px" }}>Log a meal</a>
            </div>
          ) : (
            <>
              <div style={{ background: "#162a20", borderRadius: "22px", padding: "22px", marginBottom: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                  <div style={{ fontWeight: 800, fontSize: "11px", color: "#5f7269", letterSpacing: "0.12em" }}>SUMMARY</div>
                  <div style={{ fontSize: "11px", color: "#5f7269" }}>{from} to {to}</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "9px", marginBottom: "12px" }}>
                  {[
                    { label: "Days tracked", val: statements.length, color: "#fff" },
                    { label: "Avg kcal/day", val: `${avgKcal.toLocaleString()}`, color: "#5e9bff" },
                    { label: "On track days", val: onTrackDays, color: "#b5f23d" },
                    { label: "Over goal days", val: overDays, color: "#ff8a5e" },
                  ].map(c => (
                    <div key={c.label} style={{ background: "#0e1e16", borderRadius: "14px", padding: "14px" }}>
                      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "22px", fontWeight: 700, color: c.color }}>{c.val}</div>
                      <div style={{ fontSize: "11px", color: "#5f7269", marginTop: "2px" }}>{c.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ background: deficit >= 0 ? "rgba(181,242,61,0.1)" : "rgba(255,138,94,0.1)", border: deficit >= 0 ? "1px solid rgba(181,242,61,0.2)" : "1px solid rgba(255,138,94,0.2)", borderRadius: "14px", padding: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "13px", color: "#c9d8ce", fontWeight: 600 }}>Net calorie {deficit >= 0 ? "deficit" : "surplus"}</div>
                    <div style={{ fontSize: "11px", color: "#5f7269", marginTop: "2px" }}>Total goal minus total eaten</div>
                  </div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "24px", fontWeight: 700, color: deficit >= 0 ? "#b5f23d" : "#ff8a5e" }}>
                    {deficit >= 0 ? "-" : "+"}{Math.abs(deficit).toLocaleString()}
                  </div>
                </div>
              </div>

              <div style={{ background: "#162a20", borderRadius: "22px", border: "1px solid rgba(255,255,255,0.05)", overflow: "hidden", marginBottom: "12px" }}>
                <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 800, fontSize: "11px", color: "#5f7269", letterSpacing: "0.12em" }}>DAILY TRANSACTIONS</span>
                  <span style={{ fontSize: "11px", color: "#5f7269" }}>{statements.length} records</span>
                </div>
                {statements.map((s, i) => (
                  <div key={s.id || i} style={{ padding: "13px 20px", borderBottom: i < statements.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: statusDot(s.status), flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: "13px" }}>{formatDate(s.date)}</div>
                      <div style={{ fontSize: "11px", color: "#5f7269", marginTop: "2px" }}>
                        {s.meals_count} meals - {s.total_protein}g P / {s.total_carbs}g C / {s.total_fat}g F
                      </div>
                    </div>
                    <div style={{ textAlign: "right" as const, flexShrink: 0 }}>
                      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "15px", color: statusDot(s.status) }}>{(s.total_kcal || 0).toLocaleString()}</div>
                      <div style={{ fontSize: "10px", color: "#5f7269" }}>of {(s.goal_kcal || 1500).toLocaleString()} · {statusLabel(s.status)}</div>
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={exportStatement} style={{ width: "100%", padding: "14px", background: "transparent", color: "#b5f23d", border: "1.5px solid rgba(181,242,61,0.4)", borderRadius: "99px", fontSize: "14px", fontWeight: 800, cursor: "pointer" }}>
                Download Statement (.txt)
              </button>
            </>
          )
        )}
      </div>

      <nav style={{ position: "fixed" as const, bottom: 0, left: 0, right: 0, height: "72px", background: "rgba(10,19,16,0.92)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-around", alignItems: "center", padding: "0 8px" }}>
        <a href="/dashboard" style={{ color: "#5f7269", fontWeight: 600, fontSize: "11px", textDecoration: "none", padding: "6px 10px" }}>Home</a>
        <a href="/statements" style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", gap: "3px", color: "#b5f23d", fontWeight: 800, fontSize: "11px", textDecoration: "none", padding: "6px 10px" }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#b5f23d" }} />Statement
        </a>
        <a href="/dashboard" style={{ width: "52px", height: "52px", borderRadius: "50%", background: "#b5f23d", color: "#0a1310", fontSize: "26px", fontWeight: 700, marginTop: "-26px", boxShadow: "0 8px 20px -4px rgba(181,242,61,0.5)", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>+</a>
        <a href="/profile" style={{ color: "#5f7269", fontWeight: 600, fontSize: "11px", textDecoration: "none", padding: "6px 10px" }}>Profile</a>
      </nav>
    </div>
  );
}