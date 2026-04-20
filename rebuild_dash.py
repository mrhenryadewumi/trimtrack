content = '''"use client";
import { useState, useEffect } from "react";
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
  const ringOffset = 283 - (283 * progress) / 100;

  const dk = darkMode;
  const bg = dk ? "#0a1310" : "#f6fbf8";
  const card = dk ? "#162a20" : "#ffffff";
  const cardBorder = dk ? "rgba(255,255,255,0.04)" : "#e8f5ee";
  const txt = dk ? "#ffffff" : "#0f1f14";
  const sub = dk ? "#7a8a82" : "#6b7280";
  const navBg = dk ? "rgba(10,19,16,0.95)" : "rgba(246,251,248,0.97)";

  const statusColors: Record<string, string> = { empty: "#888", good: "#22c55e", warn: "#eab308", critical: "#f97316", over: "#ef4444" };
  const statusColor = statusColors[statusType] || "#888";

  useEffect(() => {
    fetch("/api/profile", { credentials: "include" })
      .then(r => r.json())
      .then(data => { if (data?.name) setProfile(data); else router.push("/login"); })
      .catch(() => router.push("/login"));

    const now = new Date();
    setToday(now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" }));

    const updateTime = () => setCurrentTime(new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: true }));
    updateTime();
    const clock = setInterval(updateTime, 60000);

    fetchMeals().then(data => {
      let arr: Meal[] = [];
      if (Array.isArray(data)) arr = data;
      else if (Array.isArray(data?.meals)) arr = data.meals;
      else if (Array.isArray(data?.data)) arr = data.data;
      setMeals(arr);
    }).catch(() => setMeals([]));

    return () => clearInterval(clock);
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

  return (
    <div style={{ minHeight: "100vh", background: bg, color: txt, paddingBottom: "80px", transition: "background 0.3s" }}>

      {/* HEADER */}
      <div style={{ padding: "20px 20px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: "11px", fontWeight: 700, color: sub, letterSpacing: "0.15em", marginBottom: "2px" }}>TRIMTRACK</div>
          <div style={{ fontSize: "13px", color: sub }}>{today}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button onClick={() => setDarkMode(!darkMode)}
            style={{ padding: "6px 12px", borderRadius: "99px", background: card, border: `1px solid ${cardBorder}`, cursor: "pointer", fontSize: "12px", fontWeight: 700, color: dk ? "#b5f23d" : "#1a5c38" }}>
            {dk ? "Day" : "Night"}
          </button>
          <a href="/profile" style={{ width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg, #1a5c38, #0f3d25)", display: "flex", alignItems: "center", justifyContent: "center", color: "#b5f23d", fontWeight: 800, textDecoration: "none", fontSize: "15px" }}>
            {profile?.name?.[0]?.toUpperCase() || "U"}
          </a>
        </div>
      </div>

      <div style={{ padding: "0 16px" }}>

        {/* GREETING */}
        <div style={{ marginBottom: "16px", padding: "0 4px" }}>
          <div style={{ fontSize: "22px", fontWeight: 800, color: txt }}>{getGreeting(profile?.name || "there")}</div>
          <div style={{ fontSize: "13px", color: sub, marginTop: "2px" }}>{currentTime}</div>
        </div>

        {/* CALORIE CARD */}
        <div style={{ background: dk ? "linear-gradient(135deg, #162a20 0%, #0e1e16 100%)" : "linear-gradient(135deg, #ffffff 0%, #f0faf4 100%)", borderRadius: "28px", padding: "24px", marginBottom: "16px", border: `1px solid ${cardBorder}`, boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
            <div>
              <div style={{ fontSize: "11px", color: sub, fontWeight: 700, letterSpacing: "0.12em", marginBottom: "4px" }}>CALORIES TODAY</div>
              <div style={{ fontSize: "12px", color: statusColor, fontWeight: 600 }}>{statusMsg}</div>
            </div>
            <div style={{ background: "rgba(181,242,61,0.15)", padding: "6px 12px", borderRadius: "99px", fontSize: "11px", color: "#b5f23d", fontWeight: 700 }}>{progress}%</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div style={{ position: "relative", width: "120px", height: "120px", flexShrink: 0 }}>
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="45" fill="none" stroke="rgba(181,242,61,0.1)" strokeWidth="10" />
                <circle cx="60" cy="60" r="45" fill="none" stroke="#b5f23d" strokeWidth="10" strokeLinecap="round" strokeDasharray="283" strokeDashoffset={ringOffset} transform="rotate(-90 60 60)" style={{ transition: "stroke-dashoffset 0.8s ease" }} />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontSize: "28px", fontWeight: 900, color: txt, lineHeight: 1 }}>{eaten}</div>
                <div style={{ fontSize: "10px", color: sub, marginTop: "2px" }}>/ {goal} kcal</div>
              </div>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
              <div>
                <div style={{ fontSize: "11px", color: sub, fontWeight: 600 }}>REMAINING</div>
                <div style={{ fontSize: "20px", fontWeight: 800, color: "#b5f23d" }}>{remaining} kcal</div>
              </div>
              <div style={{ height: "1px", background: cardBorder }} />
              <div>
                <div style={{ fontSize: "11px", color: sub, fontWeight: 600 }}>GOAL</div>
                <div style={{ fontSize: "16px", fontWeight: 700, color: txt }}>{goal.toLocaleString()} kcal</div>
              </div>
            </div>
          </div>
        </div>

        {/* MACROS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "10px", marginBottom: "16px" }}>
          {[
            { label: "PROTEIN", val: protein, color: "#3b82f6" },
            { label: "CARBS", val: carbs, color: "#eab308" },
            { label: "FAT", val: fat, color: "#f97316" },
          ].map(m => (
            <div key={m.label} style={{ background: card, borderRadius: "16px", padding: "14px", border: `1px solid ${cardBorder}` }}>
              <div style={{ fontSize: "10px", color: sub, fontWeight: 600, letterSpacing: "0.1em" }}>{m.label}</div>
              <div style={{ fontSize: "20px", fontWeight: 800, color: m.color, marginTop: "4px" }}>{m.val}<span style={{ fontSize: "11px", color: sub, marginLeft: "2px" }}>g</span></div>
            </div>
          ))}
        </div>

        {motivation && (
          <div style={{ background: card, borderRadius: "16px", padding: "14px 16px", marginBottom: "16px", border: `1px solid ${cardBorder}`, fontSize: "13px", color: sub, fontStyle: "italic" }}>
            {motivation}
          </div>
        )}

        {/* MEAL TABS */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "12px", overflowX: "auto" as const, paddingBottom: "4px" }}>
          {["breakfast", "lunch", "dinner", "snack"].map(m => (
            <button key={m} onClick={() => setActiveMeal(m)}
              style={{ padding: "10px 18px", borderRadius: "99px", border: "none", background: activeMeal === m ? "#b5f23d" : card, color: activeMeal === m ? "#0a1310" : sub, fontWeight: 700, fontSize: "13px", cursor: "pointer", textTransform: "capitalize" as const, whiteSpace: "nowrap" as const, flexShrink: 0 }}>
              {m}
            </button>
          ))}
        </div>

        {/* FOOD SEARCH */}
        <div style={{ background: card, borderRadius: "20px", padding: "16px", marginBottom: "16px", border: `1px solid ${cardBorder}` }}>
          <FoodSearch activeMeal={activeMeal} onAdd={addFood} />
        </div>

        {/* AI SCAN */}
        <button onClick={() => setShowScanner(true)}
          style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, #1a5c38, #0f3d25)", color: "#b5f23d", border: "1px solid rgba(181,242,61,0.2)", borderRadius: "16px", fontSize: "14px", fontWeight: 700, cursor: "pointer", marginBottom: "20px" }}>
          Scan food with AI
        </button>

        {/* MEALS LIST */}
        {mealsArray.length > 0 && (
          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontSize: "11px", color: sub, fontWeight: 700, letterSpacing: "0.12em", marginBottom: "10px", padding: "0 4px" }}>TODAY\'S MEALS</div>
            {mealsArray.map((meal, i) => (
              <div key={i} style={{ background: card, borderRadius: "16px", padding: "14px 16px", marginBottom: "8px", display: "flex", alignItems: "center", gap: "12px", border: `1px solid ${cardBorder}` }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: txt }}>{meal.food_name}</div>
                  <div style={{ fontSize: "11px", color: sub, marginTop: "2px", textTransform: "capitalize" as const }}>{meal.meal_type}</div>
                </div>
                <div style={{ fontSize: "16px", fontWeight: 800, color: "#b5f23d" }}>{meal.kcal}</div>
                <button onClick={() => removeMeal(meal.id, i)} style={{ background: "transparent", border: "none", color: sub, cursor: "pointer", padding: "4px", fontSize: "18px" }}>x</button>
              </div>
            ))}
          </div>
        )}

        {/* NAV LINKS */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
          <a href="/statements" style={{ flex: 1, padding: "12px", background: card, border: `1px solid ${cardBorder}`, borderRadius: "12px", textAlign: "center" as const, textDecoration: "none", color: sub, fontSize: "13px", fontWeight: 600 }}>Food Statement</a>
          <a href="/profile" style={{ flex: 1, padding: "12px", background: card, border: `1px solid ${cardBorder}`, borderRadius: "12px", textAlign: "center" as const, textDecoration: "none", color: sub, fontSize: "13px", fontWeight: 600 }}>Profile</a>
        </div>
      </div>

      {/* BOTTOM NAV */}
      <nav style={{ position: "fixed" as const, bottom: 0, left: 0, right: 0, background: navBg, backdropFilter: "blur(20px)", borderTop: `1px solid ${cardBorder}`, padding: "10px 16px", display: "flex", justifyContent: "space-around", alignItems: "center" }}>
        {[
          { label: "Home", href: "/dashboard", active: true },
          { label: "Statement", href: "/statements" },
          { label: "Profile", href: "/profile" },
        ].map(n => (
          <a key={n.label} href={n.href} style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", gap: "2px", textDecoration: "none", color: n.active ? "#b5f23d" : sub, fontWeight: n.active ? 700 : 500, fontSize: "12px" }}>
            {n.label}
          </a>
        ))}
      </nav>

      {showScanner && (
        <PhotoScanner mealType={activeMeal} onAdd={(food: any) => { addFood(food); setShowScanner(false); }} />
      )}
    </div>
  );
}
'''

bad = [c for c in content if ord(c) > 127]
print(f"Bad chars: {len(bad)}")

with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print(f"Written: {len(content.splitlines())} lines")