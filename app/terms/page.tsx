export default function TermsPage() {
  return (
    <div style={{ maxWidth: "760px", margin: "0 auto", padding: "60px 24px", fontFamily: "system-ui, sans-serif" }}>
      <a href="/" style={{ color: "#1a5c38", fontWeight: 700, textDecoration: "none", fontSize: "18px" }}>TrimTrack</a>
      <h1 style={{ fontSize: "32px", fontWeight: 800, color: "#0f1f14", margin: "32px 0 8px" }}>Terms of Service</h1>
      <p style={{ color: "#888", marginBottom: "40px" }}>Last updated: 9 April 2026</p>

      {[
        { title: "Acceptance of terms", body: "By using TrimTrack at trimtrack.fit, you agree to these terms. If you do not agree, do not use the service." },
        { title: "What TrimTrack is", body: "TrimTrack is a calorie tracking and meal planning tool. It is not a medical service. The calorie estimates and meal plans provided are for informational purposes only and should not be used as a substitute for advice from a qualified healthcare professional." },
        { title: "Free trial and subscription", body: "TrimTrack offers a 30-day free trial with full access to all features. After the trial, continued access to premium features (unlimited AI food scanning, reminders, barcode scanner) requires a subscription of GBP 2.99 per month or GBP 19.99 per year. You can cancel at any time. No charges are made without your explicit consent." },
        { title: "Your account", body: "You are responsible for keeping your login credentials secure. You must provide accurate information during registration. We reserve the right to suspend accounts that violate these terms." },
        { title: "Acceptable use", body: "You agree not to misuse TrimTrack. You must not attempt to access other users' data, reverse engineer the application, use the service for any unlawful purpose, or attempt to disrupt the service." },
        { title: "Intellectual property", body: "TrimTrack and its content, features, and functionality are owned by TapIn Studio. You may not copy, reproduce, or distribute any part of the service without our written permission." },
        { title: "Disclaimer", body: "TrimTrack is provided on an as-is basis. We make no warranties about the accuracy of calorie estimates or the effectiveness of any meal plan. Results vary by individual. We are not liable for any health outcomes resulting from use of the service." },
        { title: "Termination", body: "We may suspend or terminate your access at any time if you violate these terms. You may cancel your subscription at any time from your account settings." },
        { title: "Governing law", body: "These terms are governed by the laws of England and Wales. Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales." },
        { title: "Contact", body: "Questions about these terms: hello@trimtrack.fit" },
      ].map(s => (
        <div key={s.title} style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#0f1f14", marginBottom: "8px" }}>{s.title}</h2>
          <p style={{ color: "#444", lineHeight: "1.7", margin: 0 }}>{s.body}</p>
        </div>
      ))}

      <div style={{ marginTop: "60px", paddingTop: "24px", borderTop: "1px solid #e5e7eb" }}>
        <a href="/" style={{ color: "#1a5c38", textDecoration: "none", fontWeight: 600 }}>Back to TrimTrack</a>
        <span style={{ margin: "0 12px", color: "#ccc" }}>|</span>
        <a href="/privacy" style={{ color: "#1a5c38", textDecoration: "none", fontWeight: 600 }}>Privacy Policy</a>
      </div>
    </div>
  )
}