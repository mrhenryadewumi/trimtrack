import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".next" || name === "design_handoff") continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, acc);
    else acc.push(p);
  }
  return acc;
}

function read(rel) {
  return readFileSync(join(ROOT, rel), "utf8");
}

function sourceFiles() {
  return walk(join(ROOT, "app")).concat(walk(join(ROOT, "components")), walk(join(ROOT, "lib")));
}

test("JSX does not put a string-object where a child should be (the Vercel crash)", () => {
  const hits = [];
  for (const file of sourceFiles()) {
    if (!/\.(tsx|jsx)$/.test(file)) continue;
    const text = readFileSync(file, "utf8");
    const lines = text.split("\n");
    lines.forEach((line, i) => {
      // Double-brace string objects as JSX children failed the production build.
      if (/>\s*\{\s*\{\s*["']/.test(line) || /\{\s*\{\s*["']\\?u00/.test(line)) {
        hits.push(`${file.replace(ROOT, "")}:${i + 1}:${line.trim()}`);
      }
    });
  }
  assert.deepEqual(hits, [], `invalid JSX object-children:\n${hits.join("\n")}`);
});

test("homepage and trial say free while we test, with no prices or waitlist", () => {
  const home = read("app/page.tsx");
  const trial = read("app/trial/page.tsx");
  for (const [label, src] of [
    ["homepage", home],
    ["trial", trial],
  ]) {
    assert.match(src, /Free while we test/, `${label} must say it is free while we test`);
  }
  assert.match(home, /Create a free account/);
  const banned = [
    /£4\.99/,
    /\$4\.99/,
    /£3\.19/,
    /Join the waitlist/i,
    /Tell me when it'?s out/i,
    /Thirty days free/i,
    /Free for 30 days/i,
    /30-day trial/i,
    /Get early access/i,
  ];
  const scanned = sourceFiles().filter((f) => /\.(tsx|ts|js|jsx)$/.test(f));
  const hits = [];
  for (const file of scanned) {
    const text = readFileSync(file, "utf8");
    for (const re of banned) {
      if (re.test(text)) hits.push(`${file.replace(ROOT, "")}  ${re}`);
    }
  }
  assert.deepEqual(hits, [], `leftover paid/waitlist copy:\n${hits.join("\n")}`);
});

test("payments stay off", () => {
  for (const rel of ["app/api/stripe/checkout/route.ts", "app/api/stripe/webhook/route.ts"]) {
    const src = read(rel);
    assert.match(src, /Payments are switched off/);
    assert.match(src, /status:\s*503/);
  }
});

test("signup on the phone wrapper lands on the free account page", () => {
  const cfg = read("next.config.js");
  assert.match(cfg, /source:\s*['"]\/signup['"]/);
  assert.match(cfg, /destination:\s*['"]\/trial['"]/);
});

test("scan uses the real OpenAI URL, a tester-sized cap, and only counts working scans", () => {
  const src = read("app/api/scan/route.ts");
  assert.match(src, /https:\/\/api\.openai\.com\/v1\/chat\/completions/);
  assert.doesNotMatch(src, /fetch\(["']https:\/\/openai\.com\/v1/);
  const cap = src.match(/DAILY_SCAN_LIMIT\s*=\s*(\d+)/);
  assert.ok(cap, "DAILY_SCAN_LIMIT is set");
  assert.ok(Number(cap[1]) >= 50, `scan cap should be at least 50 while we test, got ${cap[1]}`);
  const failIdx = src.indexOf("if (!result)");
  const countIdx = src.lastIndexOf("scan_count_today: usedToday + 1");
  assert.ok(failIdx > 0 && countIdx > failIdx, "a failed scan must not burn a credit");
});

test("calories come from tables, not from a guessed number", () => {
  const src = read("lib/nutrition-lookup.ts");
  assert.match(src, /estimate:\s*true/);
  assert.match(src, /will not invent calories/i);
  assert.match(src, /matchLocalFood/);
});

test("West African dishes testers will photograph are in the catalog with calories", () => {
  const src = read("lib/foods.ts");
  const foods = [];
  const re = /name:\s*'([^']+)'[\s\S]*?kcal:\s*(\d+)/g;
  let m;
  while ((m = re.exec(src))) {
    foods.push({ name: m[1], kcal: Number(m[2]) });
  }
  assert.ok(foods.length >= 40, `catalog too small (${foods.length})`);
  const blob = foods.map((f) => f.name.toLowerCase()).join("\n");
  for (const dish of ["akara", "jollof", "egusi", "moi moi", "suya", "pounded yam", "plantain"]) {
    assert.ok(blob.includes(dish), `catalog missing ${dish}`);
  }
  for (const f of foods) {
    assert.ok(Number.isFinite(f.kcal) && f.kcal >= 0, `${f.name} has a bad calorie value`);
  }
  const withCalories = foods.filter((f) => f.kcal > 0);
  assert.ok(withCalories.length >= 40, "catalog should have real dishes with calories");

  function norm(s) {
    return s
      .toLowerCase()
      .replace(/\(.*?\)/g, " ")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }
  function match(name) {
    const n = norm(name);
    let best = null;
    let bestLen = 0;
    for (const f of foods) {
      const nm = norm(f.name);
      if (!nm) continue;
      const exact = n === nm;
      const contains = nm.length >= 4 && (n.includes(nm) || nm.includes(n));
      if ((exact || contains) && nm.length > bestLen) {
        best = f;
        bestLen = nm.length;
      }
    }
    return best;
  }

  assert.match(match("akara").name, /akara/i);
  assert.match(match("puff puff").name, /puff puff/i);
  assert.notEqual(match("akara").name, match("puff puff").name);
  assert.match(match("egusi").name, /egusi/i);
  assert.match(match("jollof rice").name, /jollof/i);
  assert.match(match("suya").name, /suya/i);
  assert.equal(match("definitely not a real dish xyzzy"), null);
});

test("required files for a v1 tester session exist", () => {
  for (const rel of [
    "app/page.tsx",
    "app/trial/page.tsx",
    "app/login/page.tsx",
    "app/dashboard/page.tsx",
    "app/api/scan/route.ts",
    "public/manifest.json",
    "public/sw.js",
  ]) {
    assert.ok(read(rel).length > 20, `${rel} is empty`);
  }
});
