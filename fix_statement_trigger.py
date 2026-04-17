with open(r'C:\Users\mrhen\trimtrack\app\api\meals\route.ts', 'r', encoding='utf-8') as f:
    d = f.read()

old = "    if (error) throw error;\n    return NextResponse.json({ ok: true, data });"

new = """    if (error) throw error;

    // Build/update today's statement after every meal save
    const today = new Date().toISOString().split("T")[0];
    const { data: todayMeals } = await supabase
      .from("meal_entries")
      .select("*")
      .eq("session_id", sessionId)
      .eq("date", today);

    if (todayMeals && todayMeals.length > 0) {
      const { data: prof } = await supabase.from("profiles").select("daily_calorie_goal").eq("session_id", sessionId).maybeSingle();
      const goalKcal = prof?.daily_calorie_goal || 1500;
      const totalKcal = todayMeals.reduce((s: number, m: any) => s + (m.kcal || 0), 0);
      const totalProtein = Math.round(todayMeals.reduce((s: number, m: any) => s + (m.protein || 0), 0));
      const totalCarbs = Math.round(todayMeals.reduce((s: number, m: any) => s + (m.carbs || 0), 0));
      const totalFat = Math.round(todayMeals.reduce((s: number, m: any) => s + (m.fat || 0), 0));
      let status = "under";
      if (totalKcal > goalKcal * 1.1) status = "over";
      else if (totalKcal >= goalKcal * 0.9) status = "on_track";
      await supabase.from("food_statements").upsert({
        session_id: sessionId,
        date: today,
        timezone: "UTC",
        total_kcal: totalKcal,
        total_protein: totalProtein,
        total_carbs: totalCarbs,
        total_fat: totalFat,
        goal_kcal: goalKcal,
        meals_count: todayMeals.length,
        status,
        summary: `${today}: ${totalKcal} kcal eaten. ${todayMeals.length} meals. Status: ${status}.`,
      }, { onConflict: "session_id,date" });
    }

    return NextResponse.json({ ok: true, data });"""

if old in d:
    d = d.replace(old, new)
    print("Meals route updated - auto-saves statement")
else:
    print("Pattern not found")

with open(r'C:\Users\mrhen\trimtrack\app\api\meals\route.ts', 'w', encoding='utf-8') as f:
    f.write(d)