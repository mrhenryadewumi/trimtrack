'use client'
import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ScanResult {
  identified: boolean
  meal_name?: string
  description?: string
  kcal?: number
  protein?: number
  carbs?: number
  fat?: number
  confidence?: string
  notes?: string
  message?: string
  source?: string
  estimate?: boolean
}

interface PhotoScannerProps {
  onAdd: (meal: { food_name: string; kcal: number; protein: number; carbs: number; fat: number }) => void
  mealType: string
  autoOpen?: boolean
  onClose?: () => void
}

export default function PhotoScanner({ onAdd, mealType, autoOpen = false, onClose }: PhotoScannerProps) {
  const [open, setOpen] = useState(autoOpen)
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState<ScanResult | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const cameraRef = useRef<HTMLInputElement>(null)

  async function handleImage(file: File) {
    if (!file) return
    setError('')
    setResult(null)
    const reader = new FileReader()
    reader.onload = async (e) => {
      const base64Full = e.target?.result as string
      setPreview(base64Full)
      const base64Data = base64Full.split(',')[1]
      const mediaType = file.type || 'image/jpeg'
      setScanning(true)
      try {
        const res = await fetch('/api/scan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64Data, mediaType }),
        })
        const data = await res.json()
        if (data.error) throw new Error(data.error)
        setResult(data)
      } catch (err) {
        setError('Could not analyse image. Please try again.')
      } finally {
        setScanning(false)
      }
    }
    reader.readAsDataURL(file)
  }

  function handleAdd() {
    if (!result?.identified || !result.meal_name) return
    if (result.estimate || !result.kcal) return
    onAdd({
      food_name: result.meal_name,
      kcal: result.kcal || 0,
      protein: result.protein || 0,
      carbs: result.carbs || 0,
      fat: result.fat || 0,
    })
    close()
  }

  function reset() {
    setResult(null)
    setPreview(null)
    setError('')
    setScanning(false)
  }

  function close() {
    setOpen(false)
    reset()
    onClose?.()
  }

  return (
    <>
      {!autoOpen && (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 bg-[#b5f23d] text-[#0a1310] rounded-full text-sm font-semibold hover:bg-[#8dc42a] transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
          <circle cx="12" cy="13" r="4"/>
        </svg>
        Scan Food
      </button>
      )}

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.7)' }}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="w-full max-w-md bg-[#162a20] rounded-3xl overflow-hidden shadow-2xl border border-white/10"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                <div>
                  <div className="font-bold text-white">Scan your meal</div>
                  <div className="text-xs text-[#5f7269] mt-0.5">Adding to {mealType}</div>
                </div>
                <button onClick={close}
                  className="w-8 h-8 rounded-full bg-[#0e1e16] flex items-center justify-center text-[#8a9a92] hover:bg-[#1f3a2b]">
                  x
                </button>
              </div>

              <div className="p-6">
                {!preview && !scanning && (
                  <>
                    <div className="text-center mb-6">
                      <div className="w-20 h-20 bg-[#0e1e16] rounded-3xl flex items-center justify-center mx-auto mb-4">
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#b5f23d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                          <circle cx="12" cy="13" r="4"/>
                        </svg>
                      </div>
                      <p className="text-sm text-[#8a9a92] leading-relaxed">
                        Take a photo. We name the dish, then look up calories in the food tables - we do not guess.
                      </p>
                      <div className="inline-flex items-center gap-1.5 bg-[#233020] text-[#b5f23d] text-xs font-semibold px-3 py-1.5 rounded-full mt-3">
                        Trained on Nigerian and West African foods
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => cameraRef.current?.click()}
                        className="flex flex-col items-center gap-2 p-4 border-2 border-dashed border-[#b5f23d]/30 rounded-2xl hover:border-[#b5f23d] hover:bg-[#1f3a2b] transition-all"
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#b5f23d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                          <circle cx="12" cy="13" r="4"/>
                        </svg>
                        <span className="text-sm font-semibold text-[#b5f23d]">Take Photo</span>
                      </button>
                      <button
                        onClick={() => fileRef.current?.click()}
                        className="flex flex-col items-center gap-2 p-4 border-2 border-dashed border-white/10 rounded-2xl hover:border-white/25 hover:bg-[#0e1e16] transition-all"
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8a9a92" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                          <circle cx="8.5" cy="8.5" r="1.5"/>
                          <polyline points="21 15 16 10 5 21"/>
                        </svg>
                        <span className="text-sm font-semibold text-[#8a9a92]">From Gallery</span>
                      </button>
                    </div>

                    <input ref={cameraRef} type="file" accept="image/*" capture="environment"
                      className="hidden" onChange={e => e.target.files?.[0] && handleImage(e.target.files[0])} />
                    <input ref={fileRef} type="file" accept="image/*"
                      className="hidden" onChange={e => e.target.files?.[0] && handleImage(e.target.files[0])} />
                  </>
                )}

                {scanning && (
                  <div className="text-center py-8">
                    {preview && (
                      <img src={preview} alt="Scanning" className="w-full h-48 object-cover rounded-2xl mb-6" />
                    )}
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <div className="w-5 h-5 border-2 border-[#b5f23d] border-t-transparent rounded-full animate-spin" />
                      <span className="font-semibold text-white">Analysing your meal...</span>
                    </div>
                    <p className="text-sm text-[#5f7269]">Identifying the dish, then looking it up in the food tables</p>
                  </div>
                )}

                {error && !scanning && (
                  <div className="text-center py-6">
                    <div className="text-[#ff8a5e] font-semibold mb-2">{error}</div>
                    <button onClick={reset} className="text-sm text-[#b5f23d] font-semibold underline">Try again</button>
                  </div>
                )}

                {result && !scanning && (
                  <>
                    {preview && (
                      <img src={preview} alt="Scanned meal" className="w-full h-44 object-cover rounded-2xl mb-4" />
                    )}

                    {result.identified ? (
                      <>
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="font-bold text-lg text-white">{result.meal_name}</div>
                            <div className="text-sm text-[#5f7269] mt-0.5">{result.description}</div>
                          </div>
                          <div className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            result.confidence === 'high' ? 'bg-[rgba(181,242,61,0.15)] text-[#b5f23d]' :
                            result.confidence === 'medium' ? 'bg-[rgba(245,197,66,0.15)] text-[#f5c542]' :
                            'bg-[rgba(255,138,94,0.15)] text-[#ff8a5e]'
                          }`}>
                            {result.confidence} confidence
                          </div>
                        </div>

                        <div className="grid grid-cols-4 gap-2 mb-4">
                          {[
                            { label: 'Calories', val: result.kcal, unit: 'kcal', color: 'bg-[rgba(181,242,61,0.12)] text-[#b5f23d]' },
                            { label: 'Protein', val: result.protein, unit: 'g', color: 'bg-[rgba(94,155,255,0.14)] text-[#5e9bff]' },
                            { label: 'Carbs', val: result.carbs, unit: 'g', color: 'bg-[rgba(245,197,66,0.14)] text-[#f5c542]' },
                            { label: 'Fat', val: result.fat, unit: 'g', color: 'bg-[rgba(255,138,94,0.14)] text-[#ff8a5e]' },
                          ].map(m => (
                            <div key={m.label} className={`${m.color} rounded-xl p-2.5 text-center`}>
                              <div className="font-extrabold text-base leading-none">{m.val}</div>
                              <div className="text-xs mt-1 opacity-70">{m.unit}</div>
                              <div className="text-xs font-medium mt-0.5">{m.label}</div>
                            </div>
                          ))}
                        </div>

                        {result.notes && (
                          <div className="bg-[rgba(245,197,66,0.1)] border border-[rgba(245,197,66,0.2)] rounded-xl px-3 py-2 text-xs text-[#f5c542] mb-4">
                            {result.notes}
                          </div>
                        )}

                        <div className="flex gap-3">
                          <button onClick={reset}
                            className="flex-1 py-3 border border-white/10 rounded-full text-sm font-semibold text-[#8a9a92] hover:bg-[#0e1e16]">
                            Retake
                          </button>
                          {result.estimate || !result.kcal ? (
                            <button onClick={close}
                              className="flex-1 py-3 bg-[#b5f23d] text-[#0a1310] rounded-full text-sm font-bold hover:bg-[#8dc42a]">
                              Search the list instead
                            </button>
                          ) : (
                            <button onClick={handleAdd}
                              className="flex-1 py-3 bg-[#b5f23d] text-[#0a1310] rounded-full text-sm font-bold hover:bg-[#8dc42a]">
                              Add to {mealType}
                            </button>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-4">
                        <div className="text-[#8a9a92] mb-4">{result.message}</div>
                        <button onClick={reset}
                          className="px-6 py-2.5 bg-[#b5f23d] text-[#0a1310] rounded-full text-sm font-bold hover:bg-[#8dc42a]">
                          Try another photo
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
