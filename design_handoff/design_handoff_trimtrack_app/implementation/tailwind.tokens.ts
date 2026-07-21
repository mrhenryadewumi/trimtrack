// Merge into your existing tailwind.config.ts `theme.extend`.
// Your green/lime scales already match the design — keep them. This adds the
// dark-surface scale, macro colors, numeral font, and theme-aware CSS vars.

// 1) extend (add alongside your current colors):
const extend = {
  fontFamily: {
    sans: ['Plus Jakarta Sans', 'sans-serif'],
    num: ['Space Grotesk', 'sans-serif'],        // all numerals/stats
  },
  colors: {
    // dark surfaces (design token names from the handoff README)
    surface: {
      DEFAULT: 'var(--tt-bg)',                    // #0a1310 dark / #f4f7f2 light
      card:    'var(--tt-card)',                  // #162a20 / #ffffff
      deep:    'var(--tt-deep)',                  // #0e1e16 / #eef2ec
      sheet:   'var(--tt-sheet)',                 // #132218 / #ffffff
    },
    ink: {
      DEFAULT: 'var(--tt-ink)',                   // #ffffff / #0f1f14
      body:    'var(--tt-txt2)',                  // #c9d8ce / #3d5240
      mut:     'var(--tt-mut)',                   // #8a9a92 / #5c6b60
      faint:   'var(--tt-faint)',                 // #5f7269 / #8a9589
    },
    accent: {
      DEFAULT: 'var(--tt-acc)',                   // lime #b5f23d dark / forest #1a5c38 light
      bg:      'var(--tt-acc-bg)',
      line:    'var(--tt-acc-line)',
    },
    macro: { protein: '#5e9bff', carbs: '#f5c542', fat: '#ff8a5e' },
  },
  borderColor: { hairline: 'var(--tt-line)' },
};

// 2) globals.css — the variable sets (html.dark is default):
export const cssVars = `
:root, html.dark {
  --tt-bg:#0a1310; --tt-card:#162a20; --tt-deep:#0e1e16; --tt-sheet:#132218;
  --tt-ink:#ffffff; --tt-txt2:#c9d8ce; --tt-mut:#8a9a92; --tt-faint:#5f7269;
  --tt-line:rgba(255,255,255,.05);
  --tt-acc:#b5f23d; --tt-acc-bg:rgba(181,242,61,.12); --tt-acc-line:rgba(181,242,61,.2);
}
html.light {
  --tt-bg:#f4f7f2; --tt-card:#ffffff; --tt-deep:#eef2ec; --tt-sheet:#ffffff;
  --tt-ink:#0f1f14; --tt-txt2:#3d5240; --tt-mut:#5c6b60; --tt-faint:#8a9589;
  --tt-line:rgba(15,31,20,.08);
  --tt-acc:#1a5c38; --tt-acc-bg:rgba(26,92,56,.1); --tt-acc-line:rgba(26,92,56,.3);
}
`;
// Filled lime buttons/FAB stay literal lime-400 + text-[#0a1310] in BOTH themes.
// Usage examples: bg-surface-card border border-hairline text-ink-mut font-num text-accent
export default extend;
