"use client";
import Link from "next/link";

// Marketing page only - routes and the signup flow are untouched.
// Palette is the mobile app's, exactly.
const C = {
  bg: "#0a1310",
  card: "#162a20",
  deep: "#0e1e16",
  ink: "#ffffff",
  body: "#c9d8ce",
  mut: "#8a9a92",
  faint: "#5f7269",
  acc: "#b5f23d",
  accBg: "rgba(181,242,61,.12)",
  accLine: "rgba(181,242,61,.28)",
  line: "rgba(255,255,255,.05)",
  line2: "rgba(255,255,255,.09)",
  track: "rgba(255,255,255,.07)",
  protein: "#5e9bff",
  carbs: "#f5c542",
  fat: "#ff8a5e",
  heroGrad: "linear-gradient(150deg,#173026,#0e1e16)",
};

const UI = "'Plus Jakarta Sans',system-ui,sans-serif";
const NUM = "'Space Grotesk',ui-monospace,monospace";

function Ring() {
  const size = 168;
  const stroke = 13;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const pct = 1245 / 1500;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke={C.track} strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={C.acc}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - pct)}
          fill="none"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ fontFamily: NUM, fontWeight: 700, fontSize: 40, color: C.ink, lineHeight: 1 }}>255</div>
        <div style={{ fontFamily: UI, fontWeight: 600, fontSize: 13, color: C.mut, marginTop: 4 }}>kcal left</div>
      </div>
    </div>
  );
}

function MacroCard({ label, value, pct, colour }: { label: string; value: string; pct: number; colour: string }) {
  return (
    <div style={{ flex: 1, background: C.card, borderRadius: 14, padding: "10px 11px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <span style={{ width: 7, height: 7, borderRadius: 4, background: colour }} />
        <span style={{ fontFamily: UI, fontWeight: 600, fontSize: 11, color: C.mut }}>{label}</span>
      </div>
      <div style={{ fontFamily: NUM, fontWeight: 700, fontSize: 17, color: C.ink, marginTop: 6 }}>{value}</div>
      <div style={{ height: 4, borderRadius: 2, background: C.track, marginTop: 8, overflow: "hidden" }}>
        <div style={{ height: 4, width: `${pct}%`, background: colour, borderRadius: 2 }} />
      </div>
    </div>
  );
}

function PhoneMock() {
  return (
    <div
      style={{
        border: `8px solid #1a2620`,
        borderRadius: 52,
        background: C.bg,
        padding: 18,
        width: 320,
        maxWidth: "100%",
        boxShadow: "0 30px 80px rgba(0,0,0,.45)",
      }}
    >
      <div style={{ fontFamily: UI, fontWeight: 800, fontSize: 26, color: C.ink, marginBottom: 14 }}>Today</div>

      <div
        style={{
          background: C.heroGrad,
          border: `1px solid ${C.line2}`,
          borderRadius: 22,
          padding: "20px 16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Ring />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", marginTop: 16 }}>
          <div style={{ fontFamily: UI, fontWeight: 600, fontSize: 13, color: C.body }}>
            <span style={{ fontFamily: NUM, fontWeight: 700, color: C.ink }}>1,245</span>
            <span style={{ color: C.mut }}> / </span>
            <span style={{ fontFamily: NUM, fontWeight: 700, color: C.ink }}>1,500</span> eaten
          </div>
          <div style={{ background: C.accBg, border: `1px solid ${C.accLine}`, borderRadius: 99, padding: "5px 10px" }}>
            <span style={{ fontFamily: UI, fontWeight: 600, fontSize: 12, color: C.acc }}>
              <span style={{ fontFamily: NUM, fontWeight: 700 }}>83%</span> | on track
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <MacroCard label="Protein" value="64g" pct={57} colour={C.protein} />
        <MacroCard label="Carbs" value="158g" pct={79} colour={C.carbs} />
        <MacroCard label="Fat" value="39g" pct={70} colour={C.fat} />
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 9,
          background: C.acc,
          borderRadius: 14,
          padding: "13px 14px",
          marginTop: 10,
        }}
      >
        <span style={{ fontFamily: UI, fontWeight: 800, fontSize: 14, color: C.bg, flex: 1 }}>Ask Trim anything</span>
        <span style={{ fontFamily: UI, fontWeight: 800, fontSize: 16, color: C.bg }}>{String.fromCharCode(62)}</span>
      </div>

      <div style={{ fontFamily: UI, fontWeight: 800, fontSize: 10, letterSpacing: "0.12em", color: C.faint, margin: "16px 0 8px" }}>
        TODAY&apos;S MEALS
      </div>
      {[
        { name: "Akara & pap", slot: "Breakfast", kcal: "385" },
        { name: "Egusi & two wraps", slot: "Lunch", kcal: "640" },
      ].map((m) => (
        <div
          key={m.name}
          style={{
            display: "flex",
            alignItems: "center",
            background: C.card,
            borderRadius: 14,
            padding: "12px 14px",
            marginBottom: 8,
          }}
        >
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: UI, fontWeight: 700, fontSize: 14, color: C.ink }}>{m.name}</div>
            <div style={{ fontFamily: UI, fontWeight: 600, fontSize: 11, color: C.mut, marginTop: 2 }}>{m.slot}</div>
          </div>
          <div style={{ fontFamily: NUM, fontWeight: 700, fontSize: 15, color: C.ink }}>
            {m.kcal}
            <span style={{ fontFamily: UI, fontWeight: 600, fontSize: 10, color: C.mut }}> kcal</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function LogoMark() {
  return (
    <span
      style={{
        width: 26,
        height: 26,
        borderRadius: 99,
        border: `3px solid ${C.acc}`,
        display: "inline-block",
      }}
    />
  );
}

const STEPS = [
  { n: "01", title: "Point the camera", body: "One photo of the plate. It reads the dish, not a barcode, so it works on food that never came in a packet." },
  { n: "02", title: "Correct anything", body: "The estimate is a starting point. Tap any number and change it - your correction is what gets saved." },
  { n: "03", title: "See what is left", body: "The ring shows the calories still available today, and the macro bars show where they should come from." },
];

const FOODS = ["Jollof rice", "Egusi", "Akara", "Pounded yam", "Suya", "Moin moin", "Pepper soup"];

const SEARCH_RESULTS = [
  { name: "Egusi soup", detail: "1 bowl | 285 kcal" },
  { name: "Egusi with eba", detail: "1 plate | 640 kcal" },
  { name: "Egusi with pounded yam", detail: "1 plate | 680 kcal" },
  { name: "Egusi (melon seed) raw", detail: "100 g | 557 kcal" },
];

const CHAT = [
  { from: "user", text: "Why has the scale not moved this week?" },
  { from: "coach", text: "Your average is 1,610 a day against a 1,500 target - close, but not under. Tuesday and Thursday were the heavy ones, both dinners over 800." },
  { from: "user", text: "So cut dinner?" },
  { from: "coach", text: "Or move some of it to lunch. You logged nothing before 2pm on both days, which is usually what makes dinner large." },
];

const POSTS = [
  { who: "Chidi A.", day: "Day 12", text: "Weighed in this morning, same as last week. Annoying, but I logged every day so at least I know why - three takeaways.", cheers: 14 },
  { who: "Bola T.", day: "Day 31", text: "Made moin moin in a batch on Sunday and it carried me through four lunches. Logging took ten seconds each time.", cheers: 22 },
  { who: "Femi O.", day: "Day 6", text: "First week done. Nothing dramatic to report - mostly surprised by how much the evening snacking added up.", cheers: 9 },
];

export default function Home() {
  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: UI }}>
      <style>{`
        .wrap { max-width: 1120px; margin: 0 auto; padding: 0 24px; }
        .two { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: center; }
        .three { display: grid; grid-template-columns: repeat(3,1fr); gap: 18px; }
        .navlinks { display: flex; gap: 28px; align-items: center; }
        h1, h2, h3 { letter-spacing: -.03em; font-weight: 800; margin: 0; }
        p { line-height: 1.65; }
        a { text-decoration: none; }
        @media (max-width: 900px) {
          .two { grid-template-columns: 1fr; gap: 36px; }
          .three { grid-template-columns: 1fr; }
          .navlinks { display: none; }
          .phonecol { order: 2; display: flex; justify-content: center; }
        }
      `}</style>

      <nav style={{ borderBottom: `1px solid ${C.line}` }}>
        <div className="wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 76 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <LogoMark />
            <span style={{ fontWeight: 800, fontSize: 19, color: C.ink }}>TrimTrack</span>
          </div>
          <div className="navlinks">
            <a href="#how" style={{ color: C.body, fontSize: 15, fontWeight: 600 }}>How it works</a>
            <a href="#food" style={{ color: C.body, fontSize: 15, fontWeight: 600 }}>The food</a>
            <a href="#circle" style={{ color: C.body, fontSize: 15, fontWeight: 600 }}>Circle</a>
          </div>
          <a
            href="/trial"
            style={{ background: C.acc, color: C.bg, fontWeight: 700, fontSize: 15, padding: "11px 18px", borderRadius: 99 }}
          >
            Create a free account
          </a>
        </div>
      </nav>

      <section className="wrap" style={{ padding: "72px 24px 88px" }} id="early">
        <div className="two">
          <div>
            <span
              style={{
                display: "inline-block",
                background: C.accBg,
                border: `1px solid ${C.accLine}`,
                color: C.acc,
                fontWeight: 700,
                fontSize: 13,
                padding: "7px 13px",
                borderRadius: 99,
              }}
            >
              Free while we test
            </span>

            <h1 style={{ fontSize: 52, lineHeight: 1.05, color: C.ink, margin: "22px 0 18px" }}>
              Most calorie trackers were built for someone else&apos;s dinner.
            </h1>

            <p style={{ fontSize: 17, color: C.body, margin: "0 0 28px" }}>
              TrimTrack knows jollof, egusi, akara, pounded yam and suya - the way they are actually
              cooked and actually served. Photograph the plate and it reads the dish, not a barcode.
            </p>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link
                href="/trial"
                style={{
                  background: C.acc,
                  color: C.bg,
                  fontFamily: UI,
                  fontWeight: 700,
                  fontSize: 16,
                  borderRadius: 14,
                  padding: "15px 22px",
                }}
              >
                Create a free account
              </Link>
              <Link
                href="/login"
                style={{
                  border: `1px solid ${C.line2}`,
                  color: C.body,
                  fontFamily: UI,
                  fontWeight: 700,
                  fontSize: 16,
                  borderRadius: 14,
                  padding: "15px 22px",
                }}
              >
                Log in
              </Link>
            </div>

            <p style={{ fontSize: 14, color: C.mut, margin: "16px 0 0" }}>
              Same account on the web and on Android. No card. We will not charge you while we test.
            </p>
          </div>

          <div className="phonecol">
            <PhoneMock />
          </div>
        </div>
      </section>

      <section id="how" style={{ borderTop: `1px solid ${C.line}`, background: C.deep }}>
        <div className="wrap" style={{ padding: "72px 24px" }}>
          <h2 style={{ fontSize: 34, color: C.ink, marginBottom: 10 }}>Three taps, not a spreadsheet</h2>
          <p style={{ fontSize: 17, color: C.mut, margin: "0 0 34px", maxWidth: "60ch" }}>
            The whole loop takes about fifteen seconds, which is the only reason anyone keeps doing it.
          </p>
          <div className="three">
            {STEPS.map((s) => (
              <div key={s.n} style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 20, padding: 24 }}>
                <div style={{ fontFamily: NUM, fontWeight: 700, fontSize: 15, color: C.acc, marginBottom: 12 }}>{s.n}</div>
                <h3 style={{ fontSize: 19, color: C.ink, marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 15, color: C.body, margin: 0 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="food" className="wrap" style={{ padding: "80px 24px" }}>
        <div className="two">
          <div>
            <h2 style={{ fontSize: 34, color: C.ink, marginBottom: 14 }}>It knows what you actually eat</h2>
            <p style={{ fontSize: 17, color: C.body, margin: "0 0 24px" }}>
              Most databases were built from American supermarket shelves, so a plate of egusi and
              pounded yam comes back as &quot;stew&quot; and a guess. Ours starts from the dishes
              themselves - portions as they are served at home, not as a lab weighs them.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
              {FOODS.map((f) => (
                <span
                  key={f}
                  style={{
                    background: C.accBg,
                    border: `1px solid ${C.accLine}`,
                    color: C.acc,
                    fontWeight: 600,
                    fontSize: 14,
                    padding: "9px 14px",
                    borderRadius: 99,
                  }}
                >
                  {f}
                </span>
              ))}
              <span
                style={{
                  background: C.track,
                  border: `1px solid ${C.line2}`,
                  color: C.mut,
                  fontWeight: 600,
                  fontSize: 14,
                  padding: "9px 14px",
                  borderRadius: 99,
                }}
              >
                + everything else
              </span>
            </div>
          </div>

          <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 22, padding: 18 }}>
            <div
              style={{
                background: C.deep,
                border: `1px solid ${C.line2}`,
                borderRadius: 12,
                padding: "13px 15px",
                color: C.ink,
                fontSize: 15,
                fontWeight: 600,
                marginBottom: 12,
              }}
            >
              egusi<span style={{ color: C.acc }}>|</span>
            </div>
            {SEARCH_RESULTS.map((r) => (
              <div
                key={r.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 4px",
                  borderTop: `1px solid ${C.line}`,
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: C.ink }}>{r.name}</div>
                  <div style={{ fontFamily: NUM, fontSize: 12, color: C.mut, marginTop: 3 }}>{r.detail}</div>
                </div>
                <span
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 99,
                    background: C.accBg,
                    border: `1px solid ${C.accLine}`,
                    color: C.acc,
                    fontWeight: 800,
                    fontSize: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  +
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ borderTop: `1px solid ${C.line}`, background: C.deep }}>
        <div className="wrap two" style={{ padding: "80px 24px" }}>
          <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 22, padding: 18 }}>
            {CHAT.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.from === "user" ? "flex-end" : "flex-start", marginBottom: 10 }}>
                <div
                  style={{
                    maxWidth: "82%",
                    background: m.from === "user" ? C.acc : C.deep,
                    color: m.from === "user" ? C.bg : C.body,
                    border: m.from === "user" ? "none" : `1px solid ${C.line2}`,
                    borderRadius: 16,
                    padding: "11px 14px",
                    fontSize: 14.5,
                    lineHeight: 1.5,
                    fontWeight: m.from === "user" ? 700 : 400,
                  }}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <div>
            <h2 style={{ fontSize: 34, color: C.ink, marginBottom: 14 }}>A coach that has read your diary</h2>
            <p style={{ fontSize: 17, color: C.body, margin: "0 0 18px" }}>
              Ask it anything and it answers with your actual week in front of it - what you logged,
              when you logged it, and where the calories went. No generic advice about drinking more
              water.
            </p>
            <p style={{ fontSize: 15, color: C.mut, margin: 0 }}>
              It is a diary, not a doctor. It cannot diagnose, treat or prescribe, and it will say so.
              For anything medical, talk to a professional.
            </p>
          </div>
        </div>
      </section>

      <section id="circle" className="wrap" style={{ padding: "80px 24px", textAlign: "center" }}>
        <h2 style={{ fontSize: 34, color: C.ink, marginBottom: 12 }}>Real numbers. Real setbacks. No gym lighting.</h2>
        <p style={{ fontSize: 17, color: C.mut, margin: "0 auto 36px", maxWidth: "56ch" }}>
          A small feed of people doing the same thing, on the same food. You can cheer a post or reply
          to it. That is the whole feature.
        </p>
        <div className="three" style={{ textAlign: "left" }}>
          {POSTS.map((p) => (
            <div key={p.who} style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 20, padding: 22 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 99,
                    background: C.deep,
                    border: `1px solid ${C.line2}`,
                    color: C.body,
                    fontWeight: 700,
                    fontSize: 13,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {p.who.charAt(0)}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 700, color: C.ink }}>{p.who}</div>
                  <div style={{ fontFamily: NUM, fontSize: 12, color: C.mut }}>{p.day}</div>
                </div>
              </div>
              <p style={{ fontSize: 15, color: C.body, margin: "0 0 14px" }}>{p.text}</p>
              <div style={{ fontFamily: NUM, fontSize: 13, color: C.faint }}>
                <span style={{ color: C.acc }}>+</span> {p.cheers}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap" style={{ padding: "0 24px 88px" }}>
        <div
          style={{
            background: C.heroGrad,
            border: `1px solid ${C.line2}`,
            borderRadius: 28,
            padding: "64px 32px",
            textAlign: "center",
          }}
        >
          <h2 style={{ fontSize: 38, color: C.ink, marginBottom: 12 }}>Start tonight. It takes one plate.</h2>
          <p style={{ fontSize: 17, color: C.body, margin: "0 auto 28px", maxWidth: "52ch" }}>
            Free while we test. No card. Same account on the web and on Android.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/trial"
              style={{ background: C.acc, color: C.bg, fontWeight: 700, fontSize: 16, padding: "15px 26px", borderRadius: 14 }}
            >
              Create a free account
            </Link>
            <Link
              href="/login"
              style={{
                border: `1px solid ${C.line2}`,
                color: C.body,
                fontWeight: 700,
                fontSize: 16,
                padding: "15px 26px",
                borderRadius: 14,
              }}
            >
              Log in
            </Link>
          </div>
        </div>
      </section>

      <footer style={{ borderTop: `1px solid ${C.line}`, background: C.deep }}>
        <div className="wrap two" style={{ padding: "48px 24px", alignItems: "start" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <LogoMark />
              <span style={{ fontWeight: 800, fontSize: 18, color: C.ink }}>TrimTrack</span>
            </div>
            <p style={{ fontSize: 14, color: C.faint, margin: 0, maxWidth: "46ch" }}>
              TrimTrack is a food and weight diary. It is not a medical device and does not give
              medical advice. Talk to a doctor before making significant changes to how you eat.
            </p>
          </div>
          <div style={{ display: "flex", gap: 48, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: ".12em", color: C.faint, marginBottom: 12 }}>LEGAL</div>
              {[
                { href: "/privacy", label: "Privacy" },
                { href: "/terms", label: "Terms" },
              ].map((l) => (
                <div key={l.href} style={{ marginBottom: 9 }}>
                  <a href={l.href} style={{ color: C.body, fontSize: 15 }}>{l.label}</a>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: ".12em", color: C.faint, marginBottom: 12 }}>HELP</div>
              {[
                { href: "/support", label: "Support" },
                { href: "/account/delete", label: "Delete your account" },
                { href: "mailto:hello@trimtrack.fit", label: "hello@trimtrack.fit" },
              ].map((l) => (
                <div key={l.href} style={{ marginBottom: 9 }}>
                  <a href={l.href} style={{ color: C.body, fontSize: 15 }}>{l.label}</a>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="wrap" style={{ padding: "0 24px 40px" }}>
          <div style={{ borderTop: `1px solid ${C.line}`, paddingTop: 20, fontSize: 13, color: C.faint }}>
            Rainclean Solutions Limited, trading as Tapin Studio. Company number 16751715, registered
            in England and Wales.
          </div>
        </div>
      </footer>
    </div>
  );
}
