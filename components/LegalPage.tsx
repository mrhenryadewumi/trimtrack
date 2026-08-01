import type { ReactNode } from "react";

// Shared shell for /privacy, /terms and /support. Matches the app: #0a1310
// ground, #c9d8ce body at 16/1.7, lime links, a 68-character measure.
const INK = "#ffffff";
const BODY = "#c9d8ce";
const MUTED = "#8a9a92";
const ACCENT = "#b5f23d";
const GROUND = "#0a1310";
const LINE = "rgba(255,255,255,0.13)";
const FONT = "'Plus Jakarta Sans', system-ui, sans-serif";

const LINKS: { href: string; label: string }[] = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/support", label: "Support" },
];

export function H2({ children }: { children: ReactNode }) {
  return (
    <h2
      style={{
        fontFamily: FONT,
        fontSize: "20px",
        fontWeight: 800,
        color: INK,
        margin: "48px 0 12px",
        lineHeight: 1.35,
      }}
    >
      {children}
    </h2>
  );
}

export function P({ children }: { children: ReactNode }) {
  return (
    <p
      style={{
        fontFamily: FONT,
        fontSize: "16px",
        lineHeight: 1.7,
        color: BODY,
        margin: "0 0 20px",
      }}
    >
      {children}
    </p>
  );
}

export function UL({ children }: { children: ReactNode }) {
  return (
    <ul
      style={{
        fontFamily: FONT,
        fontSize: "16px",
        lineHeight: 1.7,
        color: BODY,
        margin: "0 0 20px",
        paddingLeft: "22px",
      }}
    >
      {children}
    </ul>
  );
}

export function LI({ children }: { children: ReactNode }) {
  return <li style={{ margin: "0 0 8px" }}>{children}</li>;
}

export function A({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} style={{ color: ACCENT, textDecoration: "underline" }}>
      {children}
    </a>
  );
}

export function Strong({ children }: { children: ReactNode }) {
  return <strong style={{ color: INK, fontWeight: 700 }}>{children}</strong>;
}

export default function LegalPage({
  title,
  updated,
  current,
  children,
}: {
  title: string;
  updated?: string;
  /** Path of this page, so the footer can leave it out. */
  current: string;
  children: ReactNode;
}) {
  const others = LINKS.filter((l) => l.href !== current);

  return (
    <div style={{ background: GROUND, minHeight: "100vh" }}>
      <div
        style={{
          maxWidth: "68ch",
          margin: "0 auto",
          padding: "56px 24px 96px",
        }}
      >
        <a
          href="/"
          style={{
            fontFamily: FONT,
            fontSize: "17px",
            fontWeight: 800,
            color: ACCENT,
            textDecoration: "none",
          }}
        >
          TrimTrack
        </a>

        <h1
          style={{
            fontFamily: FONT,
            fontSize: "34px",
            fontWeight: 800,
            color: INK,
            margin: "40px 0 8px",
            lineHeight: 1.2,
          }}
        >
          {title}
        </h1>

        {updated && (
          <p
            style={{
              fontFamily: FONT,
              fontSize: "14px",
              color: MUTED,
              margin: "0 0 40px",
            }}
          >
            Last updated: {updated}
          </p>
        )}

        {children}

        <div
          style={{
            marginTop: "72px",
            paddingTop: "28px",
            borderTop: `1px solid ${LINE}`,
            fontFamily: FONT,
            fontSize: "15px",
            color: MUTED,
          }}
        >
          <a href="/" style={{ color: ACCENT, textDecoration: "none", fontWeight: 700 }}>
            Back to TrimTrack
          </a>
          <span style={{ margin: "0 10px", color: LINE }}>·</span>
          {others.map((l, i) => (
            <span key={l.href}>
              <a href={l.href} style={{ color: ACCENT, textDecoration: "none", fontWeight: 700 }}>
                {l.label}
              </a>
              {i < others.length - 1 && (
                <span style={{ margin: "0 10px", color: LINE }}>·</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
