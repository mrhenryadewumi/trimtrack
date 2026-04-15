with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'r', encoding='utf-8') as f:
    d = f.read()

hydration_component = """
        {/* HYDRATION REMINDER */}
        {(() => {
          const hr = new Date().getHours()
          const msg = hr < 12 ? "Start your day with a glass of water." : hr < 17 ? "Take a water break — stay hydrated." : "Stay hydrated this evening."
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(219,234,254,0.5)', borderRadius: '14px', padding: '10px 16px', marginBottom: '12px', border: '1px solid rgba(147,197,253,0.4)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="rgba(59,130,246,0.1)" stroke="none"/>
                <path d="M12 2c0 0-6 8-6 12a6 6 0 0 0 12 0c0-4-6-12-6-12z"/>
              </svg>
              <span style={{ fontSize: '13px', color: '#1d4ed8', fontWeight: 500 }}>{msg}</span>
            </div>
          )
        })()}"""

# Insert after the status alert div
old = "        {/* MEAL SELECTOR */}"
new = hydration_component + "\n        {/* MEAL SELECTOR */}"

if old in d:
    d = d.replace(old, new)
    print("FIXED")
else:
    print("Pattern not found")

with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'w', encoding='utf-8') as f:
    f.write(d)