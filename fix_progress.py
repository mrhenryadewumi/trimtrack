with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'r', encoding='utf-8') as f:
    d = f.read()

old = """        {/* HERO CALORIE CARD */}
        <div style={{ background: 'linear-gradient(135deg, #1a5c38 0%, #0f3d25 100%)', borderRadius: '24px', padding: '24px', marginBottom: '12px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }}/>
          <div style={{ position: 'absolute', bottom: '-30px', right: '40px', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(181,242,61,0.08)' }}/>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', fontWeight: 500, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Remaining today</div>
          <div style={{ fontSize: '56px', fontWeight: 900, color: remain < 0 ? '#fca5a5' : remain < 200 ? '#fde047' : '#b5f23d', lineHeight: 1, marginBottom: '4px' }}>
            {Math.abs(remain).toLocaleString()}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginBottom: '16px' }}>
            {remain < 0 ? 'kcal over goal' : `kcal left - ${eaten.toLocaleString()} eaten of ${goal.toLocaleString()}`}
          </div>
          <div style={{ height: '6px', background: 'rgba(255,255,255,0.15)', borderRadius: '99px', overflow: 'hidden' }}>
            <motion.div style={{ height: '100%', borderRadius: '99px', background: remain < 0 ? '#fca5a5' : remain < 200 ? '#fde047' : '#b5f23d' }}
              animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: 'easeOut' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>0</span>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{goal.toLocaleString()} kcal</span>
          </div>
        </div>"""

new = """        {/* HERO CALORIE CARD */}
        <div style={{ background: 'linear-gradient(135deg, #1a5c38 0%, #0f3d25 100%)', borderRadius: '24px', padding: '24px', marginBottom: '12px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }}/>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {/* CIRCULAR PROGRESS RING */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
                {/* Background ring */}
                <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="10"/>
                {/* Progress ring */}
                <circle cx="60" cy="60" r="50" fill="none"
                  stroke={remain < 0 ? '#fca5a5' : remain < 200 ? '#fde047' : '#b5f23d'}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 50}`}
                  strokeDashoffset={`${2 * Math.PI * 50 * (1 - pct / 100)}`}
                  style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                />
              </svg>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
                <div style={{ fontSize: '28px', fontWeight: 900, color: remain < 0 ? '#fca5a5' : remain < 200 ? '#fde047' : '#b5f23d', lineHeight: 1 }}>
                  {pct}%
                </div>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>eaten</div>
              </div>
            </div>

            {/* STATS */}
            <div style={{ flex: 1 }}>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Remaining today</div>
              <div style={{ fontSize: '42px', fontWeight: 900, color: remain < 0 ? '#fca5a5' : remain < 200 ? '#fde047' : '#b5f23d', lineHeight: 1, marginBottom: '4px' }}>
                {Math.abs(remain).toLocaleString()}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '12px', marginBottom: '16px' }}>
                {remain < 0 ? 'kcal over goal' : 'kcal remaining'}
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Eaten</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: 'white' }}>{eaten.toLocaleString()}</div>
                </div>
                <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }}/>
                <div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Goal</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: 'white' }}>{goal.toLocaleString()}</div>
                </div>
                <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }}/>
                <div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Status</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: remain < 0 ? '#fca5a5' : remain < 200 ? '#fde047' : '#b5f23d' }}>
                    {remain < 0 ? 'Over' : remain < 200 ? 'Almost' : 'Good'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SEGMENTED PROGRESS BAR */}
          <div style={{ marginTop: '20px' }}>
            <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '99px', overflow: 'hidden', position: 'relative' }}>
              <div style={{
                height: '100%', borderRadius: '99px',
                background: remain < 0 ? '#fca5a5' : remain < 200 ? '#fde047' : '#b5f23d',
                width: `${Math.min(pct, 100)}%`,
                transition: 'width 0.8s ease',
                position: 'relative'
              }}>
                {/* Shine effect */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50%', background: 'rgba(255,255,255,0.2)', borderRadius: '99px' }}/>
              </div>
              {/* Goal markers at 25%, 50%, 75% */}
              {[25, 50, 75].map(p => (
                <div key={p} style={{ position: 'absolute', top: 0, left: `${p}%`, width: '1px', height: '100%', background: 'rgba(255,255,255,0.15)' }}/>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>0</span>
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>{Math.round(goal * 0.25).toLocaleString()}</span>
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>{Math.round(goal * 0.5).toLocaleString()}</span>
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>{Math.round(goal * 0.75).toLocaleString()}</span>
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>{goal.toLocaleString()}</span>
            </div>
          </div>
        </div>"""

if old in d:
    d = d.replace(old, new)
    print("Progress ring added")
else:
    print("Pattern not found - searching for hero card")
    idx = d.find("HERO CALORIE CARD")
    print(repr(d[idx:idx+200]))

with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'w', encoding='utf-8') as f:
    f.write(d)