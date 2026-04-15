with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'r', encoding='utf-8') as f:
    d = f.read()

# Add time state
old = "  const [today, setToday] = useState<string>(\"\")"
new = """  const [today, setToday] = useState<string>("")
  const [currentTime, setCurrentTime] = useState<string>("")"""

if old in d:
    d = d.replace(old, new)
    print("Time state added")
else:
    print("State not found")

# Add clock update to useEffect
old = "    setToday(todayStr)"
new = """    setToday(todayStr)

    // Live clock
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true }))
    }
    updateTime()
    const clockInterval = setInterval(updateTime, 1000)"""

if old in d:
    d = d.replace(old, new)
    print("Clock added")
else:
    print("setToday not found")

# Add cleanup for clock interval
old = "    return () => clearTimeout(midnightTimer)"
new = "    return () => { clearTimeout(midnightTimer); clearInterval(clockInterval) }"

if old in d:
    d = d.replace(old, new)
    print("Clock cleanup added")
else:
    print("Cleanup not found")

# Add time display in JSX below date
old = "        {/* MOTIVATION */}"
new = """        {/* DATE AND TIME */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', marginTop: '-8px' }}>
          <p style={{ fontSize: '13px', color: '#888', margin: 0 }}>{today}</p>
          <p style={{ fontSize: '15px', fontWeight: 700, color: '#1a5c38', margin: 0 }}>{currentTime}</p>
        </div>

        {/* MOTIVATION */}"""

if old in d:
    d = d.replace(old, new)
    print("Date/time display added")
else:
    print("Motivation section not found")
    # Remove old date display if exists
    d = d.replace(
        "        <p style={{ fontSize: '13px', color: '#888', marginBottom: '4px', marginTop: '-8px' }}>{today}</p>\n\n",
        ""
    )

with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'w', encoding='utf-8') as f:
    f.write(d)