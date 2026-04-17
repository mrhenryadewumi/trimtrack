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

      // If no statements, try to generate from meal_entries directly
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

  const statusColor = (s: string) => s === "on_track" ? "#22c55e" : s === "under" ? "#3b82f6" : "#ef4444";
  const statusLabel = (s: string) => s === "on_track" ? "On track" : s === "under" ? "Under goal" : "Over goal";
  const statusBg = (s: string) => s === "on_track" ? "#f0fdf4" : s === "under" ? "#eff6ff" : "#fef2f2";
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
    <div style={{ minHeight: "100vh", background: "#f6fbf8" }}>
      <nav style={{ background: "rgba(246,251,248,0.97)", borderBottom: "1px solid #e8f5ee", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "56px", position: "sticky", top: 0, zIndex: 50 }}>
        <a href="/dashboard" style={{ textDecoration: "none", fontWeight: 800, fontSize: "18px", color: "#1a5c38" }}>TrimTrack</a>
        <a href="/dashboard" style={{ fontSize: "14px", color: "#1a5c38", textDecoration: "none", fontWeight: 600 }}>Dashboard</a>
      </nav>

      <div style={{ maxWidth: "580px", margin: "0 auto", padding: "32px 16px" }}>
        <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#0f1f14", marginBottom: "4px" }}>Food Statement</h1>
        <p style={{ color: "#888", fontSize: "14px", marginBottom: "24px" }}>Your complete nutrition history. Like a bank statement for food.</p>

        {/* ACCOUNT CARD */}
        <div style={{ background: "linear-gradient(135deg, #1a5c38 0%, #0f3d25 100%)", borderRadius: "20px", padding: "24px", marginBottom: "24px" }}>
          <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>Account holder</div>
          <div style={{ fontSize: "20px", fontWeight: 800, color: "white", marginBottom: "2px" }}>{profile?.name || "Loading..."}</div>
          <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", marginBottom: "16px" }}>{profile?.email || ""}</div>
          <div style={{ display: "flex", gap: "20px" }}>
            <div>
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", marginBottom: "2px" }}>Daily goal</div>
              <div style={{ fontSize: "16px", fontWeight: 700, color: "#b5f23d" }}>{(profile?.dailyCalorieGoal || 1500).toLocaleString()} kcal</div>
            </div>
            <div>
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", marginBottom: "2px" }}>Plan</div>
              <div style={{ fontSize: "16px", fontWeight: 700, color: "#b5f23d", textTransform: "capitalize" }}>{profile?.plan || "Trial"}</div>
            </div>
          </div>
        </div>

        {/* GENERATE FORM */}
        <div style={{ background: "white", borderRadius: "20px", padding: "24px", marginBottom: "20px", border: "1px solid #f0f0f0" }}>
          <div style={{ fontWeight: 700, color: "#0f1f14", fontSize: "15px", marginBottom: "16px" }}>Generate statement</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
            <div>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#888", display: "block", marginBottom: "6px" }}>FROM</label>
              <input type="date" value={from} onChange={e => setFrom(e.target.value)}
                style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1.5px solid #e5e7eb", fontSize: "14px", outline: "none", boxSizing: "border-box" as const }} />
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#888", display: "block", marginBottom: "6px" }}>TO</label>
              <input type="date" value={to} onChange={e => setTo(e.target.value)}
                style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1.5px solid #e5e7eb", fontSize: "14px", outline: "none", boxSizing: "border-box" as const }} />
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" as const }}>
            {[
              { label: "This month", fn: () => { const n = new Date(); setFrom(new Date(n.getFullYear(), n.getMonth(), 1).toISOString().split("T")[0]); setTo(n.toISOString().split("T")[0]); }},
              { label: "Last 7 days", fn: () => { const n = new Date(); const w = new Date(n); w.setDate(w.getDate()-7); setFrom(w.toISOString().split("T")[0]); setTo(n.toISOString().split("T")[0]); }},
              { label: "Last 30 days", fn: () => { const n = new Date(); const m = new Date(n); m.setDate(m.getDate()-30); setFrom(m.toISOString().split("T")[0]); setTo(n.toISOString().split("T")[0]); }},
            ].map(q => (
              <button key={q.label} onClick={q.fn} style={{ padding: "6px 12px", borderRadius: "8px", border: "1px solid #e5e7eb", background: "white", color: "#555", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>{q.label}</button>
            ))}
          </div>
          <button onClick={generateStatement} disabled={loading}
            style={{ width: "100%", padding: "14px", background: loading ? "#2d8a56" : "#1a5c38", color: "#b5f23d", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "Generating..." : "Generate Statement"}
          </button>
        </div>

        {/* RESULTS */}
        {generated && (
          statements.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 20px", background: "white", borderRadius: "20px", border: "1px solid #f0f0f0" }}>
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>📋</div>
              <div style={{ fontWeight: 700, color: "#0f1f14", marginBottom: "6px" }}>No records for this period</div>
              <div style={{ color: "#888", fontSize: "14px", marginBottom: "16px" }}>Log meals on the dashboard to build your food statement.</div>
              <a href="/dashboard" style={{ display: "inline-block", background: "#1a5c38", color: "#b5f23d", padding: "12px 24px", borderRadius: "12px", textDecoration: "none", fontWeight: 700, fontSize: "14px" }}>Log a meal</a>
            </div>
          ) : (
            <>
              {/* SUMMARY */}
              <div style={{ background: "white", borderRadius: "20px", padding: "24px", marginBottom: "16px", border: "1px solid #f0f0f0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <div style={{ fontWeight: 700, color: "#0f1f14", fontSize: "15px" }}>Summary</div>
                  <div style={{ fontSize: "12px", color: "#888" }}>{from} to {to}</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "10px", marginBottom: "16px" }}>
                  {[
                    { label: "Days tracked", val: statements.length, color: "#1a5c38" },
                    { label: "Avg kcal/day", val: `${avgKcal.toLocaleString()} kcal`, color: "#3b82f6" },
                    { label: "On track days", val: onTrackDays, color: "#22c55e" },
                    { label: "Over goal days", val: overDays, color: "#ef4444" },
                  ].map(c => (
                    <div key={c.label} style={{ background: "#f8f9fa", borderRadius: "12px", padding: "14px" }}>
                      <div style={{ fontSize: "22px", fontWeight: 800, color: c.color }}>{c.val}</div>
                      <div style={{ fontSize: "12px", color: "#888", marginTop: "2px" }}>{c.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ background: deficit >= 0 ? "#f0fdf4" : "#fef2f2", borderRadius: "12px", padding: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "13px", color: "#888" }}>Net calorie {deficit >= 0 ? "deficit" : "surplus"}</div>
                    <div style={{ fontSize: "11px", color: "#aaa", marginTop: "2px" }}>Total goal minus total eaten</div>
                  </div>
                  <div style={{ fontSize: "24px", fontWeight: 800, color: deficit >= 0 ? "#22c55e" : "#ef4444" }}>
                    {deficit >= 0 ? "-" : "+"}{Math.abs(deficit).toLocaleString()} kcal
                  </div>
                </div>
              </div>

              {/* TRANSACTIONS */}
              <div style={{ background: "white", borderRadius: "20px", border: "1px solid #f0f0f0", overflow: "hidden", marginBottom: "16px" }}>
                <div style={{ padding: "16px 20px", borderBottom: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 700, color: "#0f1f14", fontSize: "15px" }}>Daily transactions</span>
                  <span style={{ fontSize: "12px", color: "#888" }}>{statements.length} records</span>
                </div>
                {statements.map((s, i) => (
                  <div key={s.id || i} style={{ padding: "14px 20px", borderBottom: i < statements.length - 1 ? "1px solid #f8f8f8" : "none", display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: statusBg(s.status), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={statusColor(s.status)} strokeWidth="2.5">
                        {s.status === "over" ? <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></> : <polyline points="20 6 9 17 4 12"/>}
                      </svg>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: "14px", color: "#0f1f14" }}>{formatDate(s.date)}</div>
                      <div style={{ fontSize: "12px", color: "#aaa", marginTop: "2px" }}>
                        {s.meals_count} meals - {s.total_protein}g P / {s.total_carbs}g C / {s.total_fat}g F
                      </div>
                    </div>
                    <div style={{ textAlign: "right" as const, flexShrink: 0 }}>
                      <div style={{ fontWeight: 800, fontSize: "16px", color: statusColor(s.status) }}>{(s.total_kcal || 0).toLocaleString()}</div>
                      <div style={{ fontSize: "11px", color: "#aaa" }}>of {(s.goal_kcal || 1500).toLocaleString()} kcal</div>
                      <div style={{ fontSize: "11px", fontWeight: 600, color: statusColor(s.status), marginTop: "1px" }}>{statusLabel(s.status)}</div>
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={exportStatement} style={{ width: "100%", padding: "14px", background: "white", color: "#1a5c38", border: "2px solid #1a5c38", borderRadius: "12px", fontSize: "15px", fontWeight: 700, cursor: "pointer" }}>
                Download Statement (.txt)
              </button>
            </>
          )
        )}
      </div>
    </div>
  );
}