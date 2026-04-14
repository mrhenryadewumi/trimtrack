with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'r', encoding='utf-8') as f:
    old = f.read()

if old.startswith('\ufeff'):
    old = old[1:]

# Keep everything up to the main return
logic_part = old[:8197]

new_jsx = """
  return (
    <div style={{ minHeight: '100vh', background: '#f6fbf8' }}>

      {/* NAV */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(246,251,248,0.97)', backdropFilter: 'blur(8px)', borderBottom: '1px solid #e8f5ee', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '56px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '28px', height: '28px', background: '#1a5c38', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
              <path d="M3 14L7 9L10 12L14 6" stroke="#b5f23d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="14" cy="6" r="2" fill="#b5f23d"/>
            </svg>
          </div>
          <a href="/" style={{ textDecoration: 'none', fontWeight: 800, fontSize: '18px', color: '#1a5c38' }}>TrimTrack</a>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <a href="/login" style={{ fontSize: '13px', color: '#1a5c38', textDecoration: 'none', fontWeight: 600 }}>Login</a>
          <button onClick={() => router.push('/profile')} style={{ fontSize: '12px', color: '#888', border: '1px solid #e5e7eb', borderRadius: '20px', padding: '5px 14px', background: 'white', cursor: 'pointer' }}>
            Edit profile
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '20px 16px' }}>

        {/* GREETING */}
        <p style={{ fontSize: '20px', fontWeight: 800, color: '#0f1f14', marginBottom: '16px' }}>
          {getGreeting(profile?.name || 'there')}
        </p>

        {/* HERO CALORIE CARD */}
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
        </div>

        {/* STATUS ALERT */}
        <div style={{ borderRadius: '14px', padding: '12px 16px', fontSize: '13px', fontWeight: 600, marginBottom: '20px', border: '1px solid', ...(
          status === 'good' || status === 'empty' ? { background: '#f0fdf4', color: '#166534', borderColor: '#bbf7d0' } :
          status === 'warn' || status === 'critical' ? { background: '#fffbeb', color: '#92400e', borderColor: '#fde68a' } :
          { background: '#fef2f2', color: '#991b1b', borderColor: '#fecaca' }
        )}}>
          {getStatusMessage(status, eaten, goal)}
        </div>

        {/* MEAL SELECTOR */}
        <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #f0f0f0', padding: '16px', marginBottom: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', marginBottom: '14px' }}>
            {MEAL_DEFS.map(m => (
              <button key={m.key} onClick={() => setActiveMeal(m.key)} style={{
                padding: '8px 4px', borderRadius: '12px', fontSize: '12px', fontWeight: 700,
                border: 'none', cursor: 'pointer', transition: 'all 0.15s',
                background: activeMeal === m.key ? m.color : '#f8f9fa',
                color: activeMeal === m.key ? '#fff' : '#888',
              }}>{m.label}</button>
            ))}
          </div>

          {showUpgrade && (
            <UpgradeModal onClose={() => setShowUpgrade(false)} sessionId={typeof window !== 'undefined' ? localStorage.getItem('sessionId') || '' : ''} />
          )}

          {scansLeft > 0 || isPremium ? (
            <PhotoScanner onAdd={async (meal) => {
              const sid = typeof window !== 'undefined' ? localStorage.getItem('sessionId') || '' : '';
              const res = await fetch('/api/subscription', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sessionId: sid }) });
              const data = await res.json();
              if (data.limitReached) { setShowUpgrade(true); return; }
              setScansLeft(data.scansLeft);
              handlePhotoAdd(meal);
            }} mealType={activeMeal} />
          ) : (
            <button onClick={() => setShowUpgrade(true)} style={{ width: '100%', padding: '14px', background: '#1a5c38', color: '#b5f23d', border: 'none', borderRadius: '14px', fontSize: '15px', fontWeight: 700, cursor: 'pointer' }}>
              Scan Food - Upgrade to continue
            </button>
          )}

          {!isPremium && (
            <div style={{ textAlign: 'center', fontSize: '12px', color: '#aaa', marginTop: '8px' }}>
              {scansLeft} free scan{scansLeft !== 1 ? 's' : ''} remaining today
            </div>
          )}

          <div style={{ marginTop: '12px' }}>
            <FoodSearch activeMeal={activeMeal} onAdd={handlePhotoAdd} />
          </div>
        </div>

        {/* TABS */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', background: 'white', padding: '4px', borderRadius: '14px', border: '1px solid #f0f0f0' }}>
          {[
            { key: 'log' as const, label: "Meals" },
            { key: 'progress' as const, label: 'Progress' },
            { key: 'plan' as const, label: 'My plan' },
          ].map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
              flex: 1, padding: '9px', borderRadius: '10px', fontSize: '13px', fontWeight: 700,
              border: 'none', cursor: 'pointer', transition: 'all 0.2s',
              background: activeTab === t.key ? '#1a5c38' : 'transparent',
              color: activeTab === t.key ? '#b5f23d' : '#888',
            }}>{t.label}</button>
          ))}
        </div>

        {/* MEALS TAB */}
        {activeTab === 'log' && (
          <div>
            <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #f0f0f0', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', marginBottom: '12px' }}>
              {MEAL_DEFS.map((m, mi) => {
                const items = meals[m.key]
                const mkcal = items.reduce((s, i) => s + i.kcal, 0)
                return (
                  <div key={m.key} style={{ borderBottom: mi < 3 ? '1px solid #f8f8f8' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', cursor: 'pointer' }}
                      onClick={() => { setActiveMeal(m.key) }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: m.color, flexShrink: 0 }}/>
                        <span style={{ fontWeight: 700, fontSize: '14px', color: '#1a1a1a' }}>{m.label}</span>
                      </div>
                      <span style={{ fontSize: '13px', color: mkcal > 0 ? '#1a5c38' : '#ccc', fontWeight: mkcal > 0 ? 700 : 400 }}>
                        {mkcal > 0 ? `${mkcal} kcal` : 'tap to add'}
                      </span>
                    </div>
                    {items.length > 0 && (
                      <div style={{ padding: '0 16px 12px' }}>
                        {items.map((it, ii) => (
                          <div key={ii} style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', background: '#fafafa', borderRadius: '12px', marginBottom: '6px', gap: '8px' }}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a1a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.foodName}</div>
                              <div style={{ fontSize: '11px', color: '#aaa', marginTop: '2px' }}>
                                {it.protein}g P - {it.carbs}g C - {it.fat}g F
                              </div>
                            </div>
                            <span style={{ fontSize: '14px', fontWeight: 700, color: '#1a5c38', whiteSpace: 'nowrap' }}>{it.kcal}</span>
                            <span style={{ fontSize: '11px', color: '#ccc' }}>kcal</span>
                            <button onClick={() => removeFood(m.key, ii)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#ddd', display: 'flex', alignItems: 'center', borderRadius: '6px', transition: 'color 0.15s' }}
                              onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
                              onMouseLeave={e => (e.currentTarget.style.color = '#ddd')}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* MACROS SUMMARY */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px' }}>
              {[
                { label: 'Protein', val: allMeals.reduce((s, i) => s + i.protein, 0), color: '#3b82f6', bg: '#eff6ff' },
                { label: 'Carbs', val: allMeals.reduce((s, i) => s + i.carbs, 0), color: '#f59e0b', bg: '#fffbeb' },
                { label: 'Fat', val: allMeals.reduce((s, i) => s + i.fat, 0), color: '#f97316', bg: '#fff7ed' },
              ].map(m => (
                <div key={m.label} style={{ background: m.bg, borderRadius: '16px', padding: '14px', textAlign: 'center' }}>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: m.color }}>{m.val}g</div>
                  <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROGRESS TAB */}
        {activeTab === 'progress' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <StepCounter />
            <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #f0f0f0', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <div style={{ fontWeight: 800, color: '#0f1f14', fontSize: '16px', marginBottom: '14px' }}>Weight log</div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <input style={{ flex: 1, border: '1.5px solid #e5e7eb', borderRadius: '99px', padding: '10px 16px', fontSize: '14px', outline: 'none' }}
                  type="number" placeholder="Today's weight (kg)" value={wtInput}
                  onChange={e => setWtInput(e.target.value)} step="0.1" min="30" max="300" />
                <button onClick={logWeight} style={{ background: '#1a5c38', color: '#b5f23d', fontWeight: 700, fontSize: '14px', padding: '10px 20px', borderRadius: '99px', border: 'none', cursor: 'pointer' }}>Log</button>
              </div>
              {weightLog.slice(0, 5).map((e, i) => {
                const diff = i < weightLog.length - 1 ? e.weight - weightLog[i + 1].weight : null
                return (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#f8f9fa', borderRadius: '12px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '13px', color: '#888' }}>{e.date}</span>
                    <span style={{ fontSize: '14px', fontWeight: 700 }}>{e.weight} kg</span>
                    {diff === null ? <span style={{ fontSize: '12px', color: '#ccc' }}>start</span> :
                      diff > 0 ? <span style={{ fontSize: '12px', fontWeight: 700, color: '#ef4444' }}>+{diff.toFixed(1)}</span> :
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#22c55e' }}>{diff.toFixed(1)}</span>}
                  </div>
                )
              })}
            </div>

            <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #f0f0f0', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <div style={{ fontWeight: 800, color: '#0f1f14', fontSize: '16px', marginBottom: '14px' }}>Exercise</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {exercises.map((ex, i) => (
                  <div key={i} onClick={() => setExDone(d => ({ ...d, [i]: !d[i] }))} style={{
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', borderRadius: '16px',
                    background: exDone[i] ? '#f0fdf4' : '#f8f9fa', border: `1.5px solid ${exDone[i] ? '#bbf7d0' : '#f0f0f0'}`,
                    cursor: 'pointer', transition: 'all 0.2s'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '14px', color: '#1a1a1a' }}>{ex.title}</div>
                      <div style={{ fontSize: '12px', color: '#1a5c38', fontWeight: 600, marginTop: '2px' }}>~{ex.burn} kcal - {ex.duration}</div>
                    </div>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', border: `2px solid ${exDone[i] ? '#1a5c38' : '#ddd'}`, background: exDone[i] ? '#1a5c38' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                      {exDone[i] && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#b5f23d" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                    </div>
                  </div>
                ))}
              </div>
              {totalBurned > 0 && (
                <div style={{ marginTop: '12px', background: '#f0fdf4', borderRadius: '12px', padding: '12px 16px', fontSize: '14px', fontWeight: 700, color: '#166534' }}>
                  ~{totalBurned} kcal earned back today
                </div>
              )}
            </div>
          </div>
        )}

        {/* PLAN TAB */}
        {activeTab === 'plan' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #f0f0f0', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <div style={{ fontWeight: 800, color: '#0f1f14', fontSize: '16px', marginBottom: '16px' }}>
                Today's meal plan - {profile?.country || 'Global'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {MEAL_DEFS.map(m => (
                  <div key={m.key} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: m.color, marginTop: '6px', flexShrink: 0 }}/>
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>{m.label}</div>
                      <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: 500 }}>{plan[m.key][new Date().getDate() % plan[m.key].length]}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #f0f0f0', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <div style={{ fontWeight: 800, color: '#0f1f14', fontSize: '16px', marginBottom: '12px' }}>Avoid today</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {plan.avoid.map(f => (
                  <span key={f} style={{ fontSize: '13px', padding: '6px 14px', borderRadius: '99px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', fontWeight: 500 }}>{f}</span>
                ))}
              </div>
            </div>

            {profile?.reminders && (
              <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #f0f0f0', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <div style={{ fontWeight: 800, color: '#0f1f14', fontSize: '16px', marginBottom: '12px' }}>Reminders</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ background: '#fffbeb', borderRadius: '14px', padding: '14px', border: '1px solid #fde68a' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#92400e', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>7:00 AM</div>
                    <div style={{ fontSize: '14px', color: '#78350f' }}>Goal: <strong>{goal.toLocaleString()} kcal</strong>. Start with <strong>{plan.breakfast[0]}</strong>.</div>
                  </div>
                  <div style={{ background: '#eff6ff', borderRadius: '14px', padding: '14px', border: '1px solid #bfdbfe' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#1e40af', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>8:00 PM</div>
                    <div style={{ fontSize: '14px', color: '#1e3a8a' }}>
                      {eaten > 0 ? `${eaten.toLocaleString()} kcal eaten. ${remain > 0 ? `${remain.toLocaleString()} remaining.` : `${Math.abs(remain).toLocaleString()} over.`}` : "Don't forget to log your meals!"}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
"""

new_content = logic_part + new_jsx

# Verify no bad chars
import re
bad = re.findall(r'[\x80-\xff]', new_content)
print(f"Bad chars in new content: {len(bad)}")

with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'w', encoding='utf-8') as f:
    f.write(new_content)
print(f"Written: {len(new_content)} chars, {len(new_content.splitlines())} lines")