"use client";
import { useState } from "react";
import Link from "next/link";

const features = [
  { icon: "ðŸ“Š", title: "Real-time calorie tracking", desc: "Log meals with a tap. Watch your daily ring fill - green means good, yellow means careful, red means stop." },
  { icon: "ðŸ½ï¸", title: "Meals built around your food", desc: "Tell us your food culture. TrimTrack builds your plan around food you actually enjoy - not salads you will never eat." },
  { icon: "ðŸ””", title: "Daily reminders that actually help", desc: "Get a morning message with your meal plan and an evening check-in. You do not have to remember - we do." },
  { icon: "âš–ï¸", title: "Weight progress tracker", desc: "Log your weight daily. Watch your progress chart trend downward week by week toward your goal." },
  { icon: "ðŸƒ", title: "Exercise recommendations", desc: "Daily exercises matched to your fitness level - from gentle walks to HIIT - with calories burned counted toward your day." },
  { icon: "ðŸš«", title: "Daily foods to avoid", desc: "Every day you get a short list of what to skip and why. Know exactly what is working against your goal." },
];

const testimonials = [
  { name: "Adaeze O.", location: "London, UK", text: "I tried every diet app and they all recommended food I had never eaten. TrimTrack gave me a plan built around Nigerian food. Lost 4kg in my first month without giving up jollof rice.", initials: "AO" },
  { name: "Kwame A.", location: "Toronto, Canada", text: "The morning reminder changed everything. I used to forget to track until the evening. Now my plan arrives at 7am and I just follow it. Simple.", initials: "KA" },
  { name: "Maryam B.", location: "Manchester, UK", text: "The red calorie alert is genius. I would always overeat at dinner without realising. Now I can see exactly how much room I have left. Down 6kg in 6 weeks.", initials: "MB" },
];

const steps = [
  { n: "1", title: "Tell us about yourself", desc: "Enter your weight, goal, country, food preferences, and activity level. Takes 3 minutes." },
  { n: "2", title: "Get your personalised plan", desc: "TrimTrack generates a full day-by-day meal plan using foods from your food culture - with calorie counts for every meal." },
  { n: "3", title: "Track, eat, and trim", desc: "Log meals as you go. Watch the ring fill. Get reminders. Hit your targets. Watch the numbers drop each week." },
];

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleWaitlist = async () => {
    if (!email) return;
    setLoading(true);
    try {
      await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", background: "#f6fbf8", minHeight: "100vh" }}>

      {/* NAV */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(246,251,248,0.95)", backdropFilter: "blur(8px)",
        borderBottom: "1px solid #d1fae5", padding: "0 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between", height: "60px"
      }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <span style={{ fontWeight: 800, fontSize: "20px", color: "#1a5c38" }}>TrimTrack</span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <a href="#features" style={{ color: "#444", textDecoration: "none", fontSize: "14px" }}>Features</a>
          <a href="#how" style={{ color: "#444", textDecoration: "none", fontSize: "14px" }}>How it works</a>
          <Link href="/trial" style={{
            background: "#1a5c38", color: "#b5f23d", padding: "8px 18px",
            borderRadius: "8px", textDecoration: "none", fontSize: "14px", fontWeight: "700"
          }}>Start free</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ padding: "80px 24px 60px", maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "center" }}>
          <div>
            <div style={{
              display: "inline-block", background: "#dcfce7", color: "#1a5c38",
              padding: "6px 14px", borderRadius: "100px", fontSize: "13px",
              fontWeight: "600", marginBottom: "20px"
            }}>
              The calorie tracker that understands your food
            </div>
            <h1 style={{ fontSize: "48px", fontWeight: "800", color: "#0f1f14", lineHeight: "1.15", marginBottom: "20px" }}>
              Lose weight eating<br />food you love.
            </h1>
            <p style={{ fontSize: "18px", color: "#555", lineHeight: "1.7", marginBottom: "32px" }}>
              TrimTrack gives you personalised daily meal plans, real-time calorie tracking, and gentle reminders - so you never have to guess what to eat again.
            </p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link href="/trial" style={{
                background: "#1a5c38", color: "#b5f23d", padding: "16px 28px",
                borderRadius: "12px", textDecoration: "none", fontWeight: "700",
                fontSize: "16px", display: "inline-block"
              }}>
                Build my free plan â†’
              </Link>
              <a href="#how" style={{
                background: "white", color: "#1a5c38", padding: "16px 28px",
                borderRadius: "12px", textDecoration: "none", fontWeight: "600",
                fontSize: "16px", border: "2px solid #1a5c38", display: "inline-block"
              }}>
                See how it works
              </a>
            </div>
            <p style={{ color: "#888", fontSize: "13px", marginTop: "16px" }}>
              Free 30-day trial. No credit card required.
            </p>
          </div>

          {/* HERO CARD */}
          <div style={{
            background: "#1a5c38", borderRadius: "24px", padding: "28px", color: "white"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
              <div style={{
                width: "44px", height: "44px", background: "#b5f23d",
                borderRadius: "12px", display: "flex", alignItems: "center",
                justifyContent: "center", fontWeight: "800", color: "#1a5c38", fontSize: "16px"
              }}>T</div>
              <div>
                <div style={{ fontWeight: "700", fontSize: "15px" }}>Good morning, Sarah</div>
                <div style={{ color: "#a8d5b5", fontSize: "13px" }}>Day 7 streak</div>
              </div>
            </div>
            <div style={{
              background: "rgba(255,255,255,0.1)", borderRadius: "16px",
              padding: "16px", marginBottom: "16px"
            }}>
              <div style={{ color: "#a8d5b5", fontSize: "12px", marginBottom: "4px" }}>Remaining today</div>
              <div style={{ fontSize: "36px", fontWeight: "800", color: "#b5f23d" }}>260</div>
              <div style={{ color: "#a8d5b5", fontSize: "13px" }}>kcal left - 1,240 eaten of 1,500</div>
            </div>
            {[
              { meal: "Breakfast - Akara + Pap", kcal: "380 kcal" },
              { meal: "Lunch - Brown Rice + Egusi", kcal: "480 kcal" },
              { meal: "Snack - Roasted Plantain", kcal: "380 kcal" },
            ].map(m => (
              <div key={m.meal} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.1)"
              }}>
                <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.85)" }}>{m.meal}</span>
                <span style={{ fontSize: "13px", color: "#b5f23d", fontWeight: "600" }}>{m.kcal}</span>
              </div>
            ))}
            <div style={{
              background: "rgba(181,242,61,0.15)", borderRadius: "10px",
              padding: "10px 14px", marginTop: "14px", fontSize: "13px", color: "#b5f23d"
            }}>
              Almost at your limit - keep dinner light!
            </div>
          </div>
        </div>

        {/* SOCIAL PROOF BAR */}
        <div style={{
          display: "flex", alignItems: "center", gap: "16px",
          marginTop: "48px", padding: "20px 24px",
          background: "white", borderRadius: "16px", border: "1px solid #e5e7eb"
        }}>
          <div style={{ display: "flex" }}>
            {["AO","KA","MB","TA"].map((i, idx) => (
              <div key={i} style={{
                width: "36px", height: "36px", borderRadius: "50%",
                background: idx % 2 === 0 ? "#1a5c38" : "#b5f23d",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "12px", fontWeight: "700",
                color: idx % 2 === 0 ? "#b5f23d" : "#1a5c38",
                marginLeft: idx === 0 ? 0 : "-8px", border: "2px solid white"
              }}>{i}</div>
            ))}
          </div>
          <div>
            <div style={{ fontWeight: "700", color: "#0f1f14", fontSize: "15px" }}>847 people already tracking</div>
            <div style={{ color: "#888", fontSize: "13px" }}>Join them - free for 30 days</div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: "4px" }}>
            {"â˜…â˜…â˜…â˜…â˜…".split("").map((s, i) => (
              <span key={i} style={{ color: "#f59e0b", fontSize: "18px" }}>{s}</span>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: "80px 24px", background: "white" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <h2 style={{ fontSize: "36px", fontWeight: "800", color: "#0f1f14", marginBottom: "12px" }}>
              Everything you need to hit your goal
            </h2>
            <p style={{ color: "#666", fontSize: "17px", maxWidth: "520px", margin: "0 auto" }}>
              Smart tracking, personalised meal planning, and timely nudges - all in one app.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
            {features.map(f => (
              <div key={f.title} style={{
                background: "#f6fbf8", borderRadius: "16px", padding: "24px",
                border: "1px solid #e5e7eb"
              }}>
                <div style={{ fontSize: "28px", marginBottom: "12px" }}>{f.icon}</div>
                <h3 style={{ fontWeight: "700", color: "#0f1f14", marginBottom: "8px", fontSize: "16px" }}>{f.title}</h3>
                <p style={{ color: "#666", fontSize: "14px", lineHeight: "1.6", margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={{ padding: "80px 24px", background: "#f6fbf8" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <h2 style={{ fontSize: "36px", fontWeight: "800", color: "#0f1f14", marginBottom: "12px" }}>
              Set up in 3 minutes. Results in 7 days.
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {steps.map(s => (
              <div key={s.n} style={{
                display: "flex", gap: "20px", alignItems: "flex-start",
                background: "white", borderRadius: "16px", padding: "24px",
                border: "1px solid #e5e7eb"
              }}>
                <div style={{
                  width: "44px", height: "44px", background: "#1a5c38",
                  borderRadius: "12px", display: "flex", alignItems: "center",
                  justifyContent: "center", color: "#b5f23d", fontWeight: "800",
                  fontSize: "18px", flexShrink: 0
                }}>{s.n}</div>
                <div>
                  <h3 style={{ fontWeight: "700", color: "#0f1f14", marginBottom: "6px", fontSize: "17px" }}>{s.title}</h3>
                  <p style={{ color: "#666", fontSize: "15px", lineHeight: "1.6", margin: 0 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: "80px 24px", background: "white" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "36px", fontWeight: "800", color: "#0f1f14", textAlign: "center", marginBottom: "48px" }}>
            People using TrimTrack are already winning
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
            {testimonials.map(t => (
              <div key={t.name} style={{
                background: "#f6fbf8", borderRadius: "16px", padding: "24px",
                border: "1px solid #e5e7eb"
              }}>
                <div style={{ display: "flex", gap: "4px", marginBottom: "16px" }}>
                  {"â˜…â˜…â˜…â˜…â˜…".split("").map((s, i) => (
                    <span key={i} style={{ color: "#f59e0b", fontSize: "16px" }}>{s}</span>
                  ))}
                </div>
                <p style={{ color: "#333", fontSize: "15px", lineHeight: "1.7", marginBottom: "20px" }}>"{t.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{
                    width: "40px", height: "40px", borderRadius: "50%",
                    background: "#1a5c38", display: "flex", alignItems: "center",
                    justifyContent: "center", color: "#b5f23d", fontWeight: "700", fontSize: "13px"
                  }}>{t.initials}</div>
                  <div>
                    <div style={{ fontWeight: "700", color: "#0f1f14", fontSize: "14px" }}>{t.name}</div>
                    <div style={{ color: "#888", fontSize: "13px" }}>{t.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: "80px 24px", background: "#1a5c38" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "40px", fontWeight: "800", color: "white", marginBottom: "16px" }}>
            Start your free trial today
          </h2>
          <p style={{ color: "#a8d5b5", fontSize: "17px", marginBottom: "36px" }}>
            30 days free. No credit card. Cancel anytime.
          </p>
          <Link href="/trial" style={{
            background: "#b5f23d", color: "#1a5c38", padding: "18px 36px",
            borderRadius: "14px", textDecoration: "none", fontWeight: "800",
            fontSize: "18px", display: "inline-block", marginBottom: "16px"
          }}>
            Build my free plan â†’
          </Link>
          <p style={{ color: "#a8d5b5", fontSize: "13px" }}>
            After 30 days, continue for just Â£2.99/month
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        background: "#0f1f14", padding: "24px", textAlign: "center"
      }}>
        <p style={{ color: "#666", fontSize: "13px", margin: 0 }}>
          Â© 2026 TrimTrack. All rights reserved. Â· trimtrack.fit Â· <a href='/privacy' style={{color:'#888',textDecoration:'none'}}>Privacy</a> Â· <a href='/terms' style={{color:'#888',textDecoration:'none'}}>Terms</a>
        </p>
      </footer>
    </div>
  );
}