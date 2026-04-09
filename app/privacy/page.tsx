export default function PrivacyPage() {
  return (
    <div style={{ maxWidth: "760px", margin: "0 auto", padding: "60px 24px", fontFamily: "system-ui, sans-serif" }}>
      <a href="/" style={{ color: "#1a5c38", fontWeight: 700, textDecoration: "none", fontSize: "18px" }}>TrimTrack</a>
      <h1 style={{ fontSize: "32px", fontWeight: 800, color: "#0f1f14", margin: "32px 0 8px" }}>Privacy Policy</h1>
      <p style={{ color: "#888", marginBottom: "40px" }}>Last updated: 9 April 2026</p>

      {[
        { title: "Who we are", body: "TrimTrack is a calorie tracking web application available at trimtrack.fit, built and operated by TapIn Studio. If you have any questions about this policy, contact us at hello@trimtrack.fit." },
        { title: "What data we collect", body: "We collect the information you provide during onboarding (name, age, gender, country, weight, height, activity level, food preferences), meal entries you log in the app, your weight log entries, your email address when you sign up for the trial or waitlist, and anonymous session identifiers stored in your browser." },
        { title: "How we use your data", body: "We use your data to calculate your personalised daily calorie goal, generate your meal plan, send you morning and evening reminder emails if you opted in, and improve the accuracy of our food database. We do not sell your data to any third party. We do not use your data for advertising." },
        { title: "Data storage", body: "Your data is stored securely in Supabase (PostgreSQL database hosted on AWS infrastructure in the EU). Email reminders are sent via Resend. Payments are processed by Stripe. None of these providers sell your data." },
        { title: "Your rights (UK GDPR)", body: "You have the right to access, correct, or delete your personal data at any time. To exercise any of these rights, email us at hello@trimtrack.fit and we will respond within 30 days. You also have the right to lodge a complaint with the Information Commissioner's Office (ICO) at ico.org.uk." },
        { title: "Cookies", body: "TrimTrack uses a single session identifier stored in your browser's localStorage to keep your data consistent across visits. We do not use advertising cookies or third-party tracking cookies." },
        { title: "Data retention", body: "We retain your data for as long as your account is active. If you request deletion, we will remove your personal data within 30 days. Anonymised aggregate data may be retained for analytics." },
        { title: "Changes to this policy", body: "We may update this policy from time to time. We will notify active users by email if we make significant changes. The date at the top of this page will always reflect the most recent update." },
        { title: "Contact", body: "For any privacy-related questions: hello@trimtrack.fit" },
      ].map(s => (
        <div key={s.title} style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#0f1f14", marginBottom: "8px" }}>{s.title}</h2>
          <p style={{ color: "#444", lineHeight: "1.7", margin: 0 }}>{s.body}</p>
        </div>
      ))}

      <div style={{ marginTop: "60px", paddingTop: "24px", borderTop: "1px solid #e5e7eb" }}>
        <a href="/" style={{ color: "#1a5c38", textDecoration: "none", fontWeight: 600 }}>Back to TrimTrack</a>
        <span style={{ margin: "0 12px", color: "#ccc" }}>|</span>
        <a href="/terms" style={{ color: "#1a5c38", textDecoration: "none", fontWeight: 600 }}>Terms of Service</a>
      </div>
    </div>
  )
}