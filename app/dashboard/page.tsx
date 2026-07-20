"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FoodSearch from "@/components/FoodSearch";
import PhotoScanner from "@/components/PhotoScanner";
import { fetchMeals, saveMeal, deleteMeal } from "@/lib/api-client";
import { getGreeting, getCalorieStatus, getStatusMessage } from "@/lib/calculations";

type Meal = { id?: string; food_name: string; kcal: number; protein: number; carbs: number; fat: number; meal_type: string };

const NUM = "'Space Grotesk', sans-serif";

export default function Dashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [activeMeal, setActiveMeal] = useState("breakfast");
  const [today, setToday] = useState("");
  const [motivation, setMotivation] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const mealsArray = Array.isArray(meals) ? meals : [];
  const eaten = mealsArray.reduce((s, m) => s + (m.kcal || 0), 0);
  const protein = Math.round(mealsArray.reduce((s, m) => s + (m.protein || 0), 0));
  const carbs = Math.round(mealsArray.reduce((s, m) => s + (m.carbs || 0), 0));
  const fat = Math.round(mealsArray.reduce((s, m) => s + (m.fat || 0), 0));
  const goal = profile?.dailyCalorieGoal || 1500;
  const remaining = Math.max(0, goal - eaten);
  const progress = Math.min(100, Math.round((eaten / goal) * 100));
  const statusType = getCalorieStatus(eaten, goal);
  const statusMsg = getStatusMessage(statusType, eaten, goal);
  const ringOffset = 308 - (308 * progress) / 100;

  // macro targets (fallbacks match the design spec)
  const pGoal = profile?.proteinGoal || 90;
  const cGoal = profile?.carbsGoal || 210;
  const fGoal = profile?.fatGoal || 60;

  const dk = darkMode;
  const bg = dk ? "#0a1310" : "#f4f7f2";
  const card = dk ? "#162a20" : "#ffffff";
  const deep = dk ? "#0e1e16" : "#eef2ec";
  const line = dk ? "rgba(255,255,255,0.05)" : "rgba(15,31,20,0.08)";
  const txt = dk ? "#ffffff" : "#0f1f14";
  const body = dk ? "#c9d8ce" : "#3d5240";
  const mut = dk ? "#8a9a92" : "#5c6b60";
  const faint = dk ? "#5f7269" : "#8a9589";
  const acc = dk ? "#b5f23d" : "#1a5c38";
  const accBg = dk ? "rgba(181,242,61,0.12)" : "rgba(26,92,56,0.1)";
  const accLine = dk ? "rgba(181,242,61,0.2)" : "rgba(26,92,56,0.3)";
  const heroBg = dk ? "linear-gradient(150deg,#173026,#0e1e16)" : "linear-gradient(150deg,#ffffff,#eef7ee)";
  const navBg = dk ? "rgba(10,19,16,0.92)" : "rgba(255,255,255,0.93)";

  useEffect(() => {
    fetch("/api/profile", { credentials: "include" })
      .then(r => r.json())
      .then(data => { if (data?.name) setProfile(data); else router.push("/login"); })
      .catch(() => router.push("/login"));

    const now = new Date();
    setToday(now.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "long" }));

    fetchMeals().then(data => {
      let arr: Meal[] = [];
      if (Array.isArray(data)) arr = data;
      else if (Array.isArray(data?.meals)) arr = data.meals;
      else if (Array.isArray(data?.data)) arr = data.data;
      setMeals(arr);
    }).catch(() => setMeals([]));
  }, []);

  useEffect(() => {
    if (eaten > 0) {
      fetch(`/api/motivation?eaten=${eaten}&goal=${goal}`).then(r => r.json()).then(d => setMotivation(d?.message || "")).catch(() => {});
    }
  }, [eaten, goal]);

  const addFood = async (food: any) => {
    const newMeal = { ...food, meal_type: activeMeal };
    const result = await saveMeal(newMeal);
    const id = result?.data?.id || result?.id;
    setMeals(prev => [...(Array.isArray(prev) ? prev : []), { ...newMeal, id }]);
  };

  const removeMeal = async (id?: string, idx?: number) => {
    if (id) await deleteMeal(id);
    setMeals(prev => (Array.isArray(prev) ? prev : []).filter((m, i) => m.id ? m.id !== id : i !== idx));
  };

  const macroRows = [
    { label: "PROTEIN", val: protein, target: pGoal, color: "#5e9bff" },
    { label: "CARBS", val: carbs, target: cGoal, color: "#f5c542" },
    { label: "FAT", val: fat, target: fGoal, color: "#ff8a5e" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: bg, color: txt, paddingBottom: "96px", transition: "background 0.3s", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* HEADER */}
      <div style={{ maxWidth: "480px", margin: "0 auto", padding: "20px 20px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <div>
            <div style={{ fontSize: "11px", fontWeight: 800, color: faint, letterSpacing: "0.18em" }}>TRIMTRACK</div>
            <div style={{ fontSize: "20px", fontWeight: 800, marginTop: "2px" }}>{getGreeting(profile?.name || "there")}</div>
            <div style={{ fontSize: "12px", color: faint, marginTop: "2px" }}>{today}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button onClick={() => setDarkMode(m => !m)}
              style={{ padding: "6px 12px", borderRadius: "99px", background: accBg, border: `1px solid ${accLine}`, cursor: "pointer", fontSize: "12px", fontWeight: 800, color: acc, minHeight: "34px" }}>
              {darkMode ? "Day" : "Night"}
            </button>
            <a href="/profile" style={{ width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg,#1a5c38,#0f3d25)", display: "flex", alignItems: "center", justifyContent: "center", color: "#b5f23d", fontWeight: 800, textDecoration: "none", fontSize: "15px" }}>
              {profile?.name?.[0]?.toUpperCase() || "U"}
            </a>
          </div>
        </div>

        {/* HERO RING CARD */}
        <div style={{ background: heroBg, borderRadius: "28px", padding: "17px 20px", border: `1px solid ${line}`, boxShadow: dk ? "0 16px 40px -14px rgba(0,0,0,0.7)" : "0 16px 40px -18px rgba(15,31,20,0.18)", marginBottom: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div style={{ position: "relative", width: "112px", height: "112px", flexShrink: 0 }}>
              <svg width="112" height="112" viewBox="0 0 122 122">
                <circle cx="61" cy="61" r="49" fill="none" stroke={dk ? "rgba(181,242,61,0.09)" : "rgba(26,92,56,0.12)"} strokeWidth="10" />
                <circle cx="61" cy="61" r="49" fill="none" stroke={acc} strokeWidth="10" strokeLinecap="round" strokeDasharray="308" strokeDashoffset={ringOffset} transform="rotate(-90 61 61)" style={{ transition: "stroke-dashoffset 0.9s ease" }} />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontFamily: NUM, fontSize: "31px", fontWeight: 800, lineHeight: 1 }}>{remaining}</div>
                <div style={{ fontSize: "9px", color: faint, letterSpacing: "0.08em", fontWeight: 700 }}>KCAL LEFT</div>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "10px", color: faint, fontWeight: 700, letterSpacing: "0.1em" }}>EATEN</div>
              <div style={{ fontSize: "19px", fontWeight: 800, marginBottom: "9px" }}>{eaten.toLocaleString()}<span style={{ fontSize: "12px", color: faint, fontWeight: 600 }}> / {goal.toLocaleString()}</span></div>
              <div style={{ display: "inline-flex", gap: "6px", background: accBg, padding: "5px 10px", borderRadius: "99px", fontSize: "11px", fontWeight: 700, color: acc }}>{progress}% · {statusMsg}</div>
              {motivation && <div style={{ fontSize: "11px", color: mut, marginTop: "9px", lineHeight: 1.4 }}>{motivation}</div>}
            </div>
          </div>
        </div>

        {/* MACROS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "9px", marginBottom: "10px" }}>
          {macroRows.map(m => (
            <div key={m.label} style={{ background: card, border: `1px solid ${line}`, borderRadius: "16px", padding: "10px 12px" }}>
              <div style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.08em", color: faint }}>{m.label}</div>
              <div style={{ fontFamily: NUM, fontSize: "17px", fontWeight: 800, margin: "5px 0 7px" }}>{m.val}<span style={{ fontSize: "10px", color: faint }}> g</span></div>
              <div style={{ height: "4px", background: dk ? "rgba(255,255,255,0.07)" : "rgba(15,31,20,0.08)", borderRadius: "9px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${Math.min(100, Math.round((m.val / m.target) * 100))}%`, background: m.color, transition: "width 0.7s ease" }} />
              </div>
            </div>
          ))}
        </div>

        {/* SCAN CTA */}
        <button onClick={() => setShowScanner(true)}
          style={{ display: "flex", alignItems: "center", gap: "12px", width: "100%", background: "#b5f23d", border: "none", borderRadius: "18px", padding: "11px 16px", marginBottom: "10px", cursor: "pointer", boxShadow: "0 8px 22px -8px rgba(181,242,61,0.55)", textAlign: "left" as const }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#0a1310", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "17px", flexShrink: 0 }}>📸</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "13px", fontWeight: 800, color: "#0a1310" }}>Scan food with AI</div>
            <div style={{ fontSize: "11px", color: "#2d4a35", fontWeight: 600 }}>Point your camera — we do the rest</div>
          </div>
          <div style={{ fontSize: "16px", color: "#0a1310", fontWeight: 800 }}>→</div>
        </button>

        {/* MEAL TABS */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "10px", overflowX: "auto" as const, paddingBottom: "4px" }}>
          {["breakfast", "lunch", "dinner", "snack"].map(m => (
            <button key={m} onClick={() => setActiveMeal(m)}
              style={{ padding: "8px 15px", borderRadius: "99px", border: activeMeal === m ? "1px solid #b5f23d" : `1px solid ${dk ? "rgba(255,255,255,0.14)" : "rgba(15,31,20,0.16)"}`, background: activeMeal === m ? "#b5f23d" : "transparent", color: activeMeal === m ? "#0a1310" : mut, fontWeight: activeMeal === m ? 800 : 600, fontSize: "12px", cursor: "pointer", textTransform: "capitalize" as const, whiteSpace: "nowrap" as const, flexShrink: 0, minHeight: "36px" }}>
              {m}
            </button>
          ))}
        </div>

        {/* FOOD SEARCH */}
        <div style={{ background: card, borderRadius: "20px", padding: "16px", marginBottom: "14px", border: `1px solid ${line}` }}>
          <FoodSearch activeMeal={activeMeal} onAdd={addFood} />
        </div>

        {/* MEALS LIST */}
        {mealsArray.length > 0 && (
          <div style={{ marginBottom: "14px" }}>
            <div style={{ fontSize: "11px", color: faint, fontWeight: 800, letterSpacing: "0.12em", margin: "0 2px 7px" }}>TODAY'S MEALS</div>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: "7px" }}>
              {mealsArray.map((meal, i) => (
                <div key={i} style={{ background: card, borderRadius: "15px", padding: "9px 14px", display: "flex", alignItems: "center", gap: "12px", border: `1px solid ${line}` }}>
                  <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: acc, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "13px", fontWeight: 600 }}>{meal.food_name}</div>
                    <div style={{ fontSize: "10px", color: faint, textTransform: "capitalize" as const }}>{meal.meal_type}</div>
                  </div>
                  <div style={{ fontFamily: NUM, fontSize: "14px", fontWeight: 700, color: acc }}>{meal.kcal}</div>
                  <button onClick={() => removeMeal(meal.id, i)} style={{ background: "transparent", border: "none", color: faint, cursor: "pointer", padding: "4px 6px", fontSize: "16px", minHeight: "auto" }}>×</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM NAV */}
      <nav style={{ position: "fixed" as const, bottom: 0, left: 0, right: 0, height: "72px", background: navBg, backdropFilter: "blur(20px)", borderTop: `1px solid ${line}`, display: "flex", justifyContent: "space-around", alignItems: "center", padding: "0 8px" }}>
        <a href="/dashboard" style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", gap: "3px", textDecoration: "none", color: acc, fontWeight: 800, fontSize: "11px", padding: "6px 10px" }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: acc }} />Home
        </a>
        <a href="/community" style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", gap: "3px", textDecoration: "none", color: faint, fontWeight: 600, fontSize: "11px", padding: "6px 10px" }}>Community</a>
        <a href="/statements" style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", gap: "3px", textDecoration: "none", color: faint, fontWeight: 600, fontSize: "11px", padding: "6px 10px" }}>Statement</a>
        <button onClick={() => setShowScanner(true)} style={{ width: "52px", height: "52px", borderRadius: "50%", background: "#b5f23d", border: "none", color: "#0a1310", fontSize: "26px", fontWeight: 700, marginTop: "-26px", boxShadow: "0 8px 20px -4px rgba(181,242,61,0.5)", cursor: "pointer" }}>+</button>
        <a href="/profile" style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", gap: "3px", textDecoration: "none", color: faint, fontWeight: 600, fontSize: "11px", padding: "6px 10px" }}>Profile</a>
      </nav>

      {showScanner && (
        <PhotoScanner mealType={activeMeal} onAdd={(food: any) => { addFood(food); setShowScanner(false); }} />
      )}
    </div>
  );
}
