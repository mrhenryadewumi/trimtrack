"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import FoodSearch from "@/components/FoodSearch";
import PhotoScanner from "@/components/PhotoScanner";
import { fetchMeals, saveMeal, deleteMeal } from "@/lib/api-client";
import { getGreeting, getCalorieStatus, getStatusMessage } from "@/lib/calculations";

type Meal = { id?: string; food_name: string; kcal: number; protein: number; carbs: number; fat: number; meal_type: string };

export default function Dashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [activeMeal, setActiveMeal] = useState("breakfast");
  const [currentTime, setCurrentTime] = useState("");
  const [today, setToday] = useState("");
  const [motivation, setMotivation] = useState("");
  const [scansLeft, setScansLeft] = useState(6);
  const [showScanner, setShowScanner] = useState(false);

  const eaten = meals.reduce((s, m) => s + (m.kcal || 0), 0);
  const protein = Math.round(meals.reduce((s, m) => s + (m.protein || 0), 0));
  const carbs = Math.round(meals.reduce((s, m) => s + (m.carbs || 0), 0));
  const fat = Math.round(meals.reduce((s, m) => s + (m.fat || 0), 0));
  const goal = profile?.dailyCalorieGoal || 1500;
  const remaining = Math.max(0, goal - eaten);
  const progress = Math.min(100, Math.round((eaten / goal) * 100));
  const statusType = getCalorieStatus(eaten, goal);
  const statusMessage = getStatusMessage(statusType, eaten, goal);
  const status = { type: statusType, message: statusMessage };

  useEffect(() => {
    fetch("/api/profile", { credentials: "include" })
      .then(r => r.json())
      .then(data => {
        if (data?.name) setProfile(data);
        else router.push("/login");
      })
      .catch(() => router.push("/login"));

    const now = new Date();
    const opts: Intl.DateTimeFormatOptions = { weekday: "long", day: "numeric", month: "long", year: "numeric" };
    setToday(now.toLocaleDateString("en-GB", opts));

    const updateTime = () => {
      const t = new Date();
      setCurrentTime(t.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: true }));
    };
    updateTime();
    const clockInterval = setInterval(updateTime, 60000);

    fetchMeals().then(data => setMeals(data || []));

    return () => clearInterval(clockInterval);
  }, []);

  useEffect(() => {
    if (eaten > 0 && goal > 0) {
      fetch(`/api/motivation?eaten=${eaten}&goal=${goal}`).then(r => r.json()).then(d => setMotivation(d?.message || ""));
    }
  }, [eaten, goal]);

  const addFood = async (food: any) => {
    const newMeal = { ...food, meal_type: activeMeal };
    const result = await saveMeal(newMeal);
    const id = result?.data?.id || result?.id;
    setMeals(prev => [...prev, { ...newMeal, id }]);
  };

  const removeMeal = async (id?: string, idx?: number) => {
    if (id) await deleteMeal(id);
    setMeals(prev => prev.filter((m, i) => m.id ? m.id !== id : i !== idx));
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    localStorage.clear();
    router.push("/login");
  };

  const statusColors = { empty: "#888", good: "#22c55e", warn: "#eab308", critical: "#f97316", over: "#ef4444" };
  const statusColor = statusColors[status.type as keyof typeof statusColors];
  const ringOffset = 283 - (283 * progress) / 100;

  return (
    <div style={{ minHeight: "100vh", background: "#0a1310", color: "white", paddingBottom: "80px" }}>
      {/* TOP HEADER */}
      <div style={{ padding: "20px 20px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "#7a8a82", letterSpacing: "0.15em", marginBottom: "2px" }}>TRIMTRACK</div>
          <div style={{ fontSize: "13px", color: "#7a8a82" }}>{today}</div>
        </div>
        <a href="/profile" style={{ width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg, #1a5c38, #0f3d25)", display: "flex", alignItems: "center", justifyContent: "center", color: "#b5f23d", fontWeight: 800, textDecoration: "none", fontSize: "15px", boxShadow: "0 4px 12px rgba(26,92,56,0.4)" }}>
          {profile?.name?.[0]?.toUpperCase() || "U"}
        </a>
      </div>

      <div style={{ padding: "0 16px" }}>
        {/* GREETING */}
        <div style={{ marginBottom: "16px", padding: "0 4px" }}>
          <div style={{ fontSize: "22px", fontWeight: 800, color: "white" }}>{getGreeting(profile?.name || "there")}</div>
          <div style={{ fontSize: "13px", color: "#7a8a82", marginTop: "2px" }}>{currentTime}</div>
        </div>

        {/* MAIN CALORIE CARD */}
        <div style={{ background: "linear-gradient(135deg, #162a20 0%, #0e1e16 100%)", borderRadius: "28px", padding: "24px", marginBottom: "16px", border: "1px solid rgba(181,242,61,0.08)", boxShadow: "0 8px 24px rgba(0,0,0,0.3)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
            <div>
              <div style={{ fontSize: "11px", color: "#7a8a82", fontWeight: 700, letterSpacing: "0.12em", marginBottom: "4px" }}>CALORIES TODAY</div>
              <div style={{ fontSize: "12px", color: statusColor, fontWeight: 600 }}>{status.message}</div>
            </div>
            <div style={{ background: "rgba(181,242,61,0.1)", padding: "6px 12px", borderRadius: "99px", fontSize: "11px", color: "#b5f23d", fontWeight: 700 }}>{progress}%</div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div style={{ position: "relative", width: "120px", height: "120px", flexShrink: 0 }}>
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="45" fill="none" stroke="rgba(181,242,61,0.08)" strokeWidth="10" />
                <circle cx="60" cy="60" r="45" fill="none" stroke="#b5f23d" strokeWidth="10" strokeLinecap="round" strokeDasharray="283" strokeDashoffset={ringOffset} transform="rotate(-90 60 60)" style={{ transition: "stroke-dashoffset 0.8s ease" }} />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontSize: "28px", fontWeight: 900, color: "white", lineHeight: 1 }}>{eaten}</div>
                <div style={{ fontSize: "10px", color: "#7a8a82", marginTop: "2px", letterSpacing: "0.1em" }}>/ {goal} kcal</div>
              </div>
            </div>

            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
              <div>
                <div style={{ fontSize: "11px", color: "#7a8a82", fontWeight: 600 }}>REMAINING</div>
                <div style={{ fontSize: "20px", fontWeight: 800, color: "#b5f23d" }}>{remaining} kcal</div>
              </div>
              <div style={{ height: "1px", background: "rgba(255,255,255,0.06)" }} />
              <div>
                <div style={{ fontSize: "11px", color: "#7a8a82", fontWeight: 600 }}>GOAL</div>
                <div style={{ fontSize: "16px", fontWeight: 700, color: "white" }}>{goal.toLocaleString()} kcal</div>
              </div>
            </div>
          </div>
        </div>

        {/* MACROS GRID */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "10px", marginBottom: "16px" }}>
          {[
            { label: "PROTEIN", val: protein, color: "#3b82f6", icon: "P" },
            { label: "CARBS", val: carbs, color: "#eab308", icon: "C" },
            { label: "FAT", val: fat, color: "#f97316", icon: "F" },
          ].map(m => (
            <div key={m.label} style={{ background: "#162a20", borderRadius: "16px", padding: "14px", border: "1px solid rgba(255,255,255,0.04)" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: `${m.color}22`, display: "flex", alignItems: "center", justifyContent: "center", color: m.color, fontWeight: 800, fontSize: "12px", marginBottom: "8px" }}>{m.icon}</div>
              <div style={{ fontSize: "10px", color: "#7a8a82", fontWeight: 600, letterSpacing: "0.1em" }}>{m.label}</div>
              <div style={{ fontSize: "18px", fontWeight: 800, color: "white", marginTop: "2px" }}>{m.val}<span style={{ fontSize: "11px", color: "#7a8a82", marginLeft: "2px" }}>g</span></div>
            </div>
          ))}
        </div>

        {motivation && (
          <div style={{ background: "linear-gradient(135deg, rgba(181,242,61,0.08), rgba(181,242,61,0.02))", borderRadius: "16px", padding: "14px 16px", marginBottom: "16px", border: "1px solid rgba(181,242,61,0.1)", fontSize: "13px", color: "#c8d4cc", fontStyle: "italic" }}>
            {motivation}
          </div>
        )}

        {/* MEAL TABS */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "12px", overflowX: "auto", paddingBottom: "4px" }}>
          {["breakfast", "lunch", "dinner", "snack"].map(m => (
            <button key={m} onClick={() => setActiveMeal(m)}
              style={{ padding: "10px 18px", borderRadius: "99px", border: "none", background: activeMeal === m ? "#b5f23d" : "#162a20", color: activeMeal === m ? "#0a1310" : "#7a8a82", fontWeight: 700, fontSize: "13px", cursor: "pointer", textTransform: "capitalize" as const, whiteSpace: "nowrap" as const }}>
              {m}
            </button>
          ))}
        </div>

        {/* FOOD SEARCH */}
        <div style={{ background: "#162a20", borderRadius: "20px", padding: "16px", marginBottom: "16px", border: "1px solid rgba(255,255,255,0.04)" }}>
          <FoodSearch activeMeal={activeMeal} onAdd={addFood} />
        </div>

        {/* AI SCAN BUTTON */}
        <button onClick={() => setShowScanner(true)}
          style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, #1a5c38, #0f3d25)", color: "#b5f23d", border: "1px solid rgba(181,242,61,0.2)", borderRadius: "16px", fontSize: "14px", fontWeight: 700, cursor: "pointer", marginBottom: "20px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b5f23d" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
          Scan food with AI ({scansLeft} left today)
        </button>

        {/* TODAY'S MEALS LIST */}
        {meals.length > 0 && (
          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontSize: "11px", color: "#7a8a82", fontWeight: 700, letterSpacing: "0.12em", marginBottom: "10px", padding: "0 4px" }}>TODAY'S MEALS</div>
            {meals.map((meal, i) => (
              <div key={i} style={{ background: "#162a20", borderRadius: "16px", padding: "14px 16px", marginBottom: "8px", display: "flex", alignItems: "center", gap: "12px", border: "1px solid rgba(255,255,255,0.04)" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: "white" }}>{meal.food_name}</div>
                  <div style={{ fontSize: "11px", color: "#7a8a82", marginTop: "2px", textTransform: "capitalize" as const }}>{meal.meal_type} - {meal.protein}g P - {meal.carbs}g C - {meal.fat}g F</div>
                </div>
                <div style={{ fontSize: "16px", fontWeight: 800, color: "#b5f23d" }}>{meal.kcal}</div>
                <button onClick={() => removeMeal(meal.id, i)} style={{ background: "transparent", border: "none", color: "#7a8a82", cursor: "pointer", padding: "4px" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* BOTTOM NAV */}
      <nav style={{ position: "fixed" as const, bottom: 0, left: 0, right: 0, background: "rgba(10,19,16,0.95)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,255,255,0.04)", padding: "12px 16px calc(12px + env(safe-area-inset-bottom))", display: "flex", justifyContent: "space-around", alignItems: "center" }}>
        {[
          { icon: "M3 12l9-9 9 9M5 10v10h14V10", label: "Home", href: "/dashboard", active: true },
          { icon: "M21 8V7l-3 2-3-2v1l3 2 3-2zM3 12h18M3 8h18M3 16h18", label: "Statement", href: "/statements" },
          { icon: "M12 2v20M2 12h20", label: "Log", href: "#" },
          { icon: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z", label: "Plan", href: "#" },
          { icon: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 7a4 4 0 1 1 0 8 4 4 0 0 1 0-8z", label: "Profile", href: "/profile" },
        ].map(n => (
          <a key={n.label} href={n.href} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", textDecoration: "none", color: n.active ? "#b5f23d" : "#7a8a82" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={n.icon}/></svg>
            <span style={{ fontSize: "10px", fontWeight: 600 }}>{n.label}</span>
          </a>
        ))}
      </nav>

      {showScanner && (
        <PhotoScanner mealType={activeMeal} onAdd={(food: any) => { addFood(food); setShowScanner(false); }} />
      )}
    </div>
  );
}
