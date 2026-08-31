#!/usr/bin/env node
/**
 * Hits the live site. Not part of the default `npm test` so a push
 * is not blocked by a Vercel deploy that is still rolling out.
 *
 *   npm run test:live
 */
const BASE = process.env.TRIMTRACK_URL || "https://www.trimtrack.fit";

async function grab(path, opts = {}) {
  const res = await fetch(BASE + path, { redirect: "manual", ...opts });
  const body = await res.text();
  return { res, body };
}

function must(cond, msg) {
  if (!cond) {
    console.error("FAIL  " + msg);
    process.exitCode = 1;
  } else {
    console.log("ok    " + msg);
  }
}

const { body: home } = await grab("/");
must(home.includes("Free while we test"), "homepage: Free while we test");
must(home.includes("Create a free account"), "homepage: Create a free account");
must(!/£4\.99|Join the waitlist|Thirty days free|Free for 30 days/.test(home), "homepage: no prices or waitlist");

const { body: trial } = await grab("/trial");
must(trial.includes("Create a free account") || trial.includes("Your name"), "trial page loads");
must(trial.toLowerCase().includes("free while we test"), "trial: free while we test");

const signup = await grab("/signup");
must(
  signup.res.status === 307 || signup.res.status === 308 || signup.res.headers.get("location")?.includes("/trial"),
  "signup redirects to trial (got " + signup.res.status + " " + signup.res.headers.get("location") + ")"
);

const checkout = await fetch(BASE + "/api/stripe/checkout", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: "{}",
});
const checkoutBody = await checkout.text();
must(checkout.status === 503, "checkout is 503, not charging (got " + checkout.status + ")");
must(/switched off/i.test(checkoutBody), "checkout says payments are switched off");

const login = await fetch(BASE + "/api/auth/login", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: "{}",
});
must(login.status === 400, "login rejects an empty body");

if (process.exitCode) {
  console.error("\nLive smoke failed against " + BASE);
  process.exit(1);
}
console.log("\nLive smoke passed against " + BASE);
