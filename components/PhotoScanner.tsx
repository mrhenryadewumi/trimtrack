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
}

interface PhotoScannerProps {
  onAdd: (meal: { food_name: string; kcal: number; protein: number; carbs: number; fat: number }) => void
  mealType: string
}

export default function PhotoScanner({ onAdd, mealType }: PhotoScannerProps) {
  const [open, setOpen] = useState(false)
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

    // Create preview
    const reader = new FileReader()
    reader.onload = async (e) => {
      const base64Full = e.target?.result as string
      setPreview(base64Full)

      // Extract base64 data without header
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
    onAdd({
      food_name: result.meal_name,
      kcal: result.kcal || 0,
      protein: result.protein || 0,
      carbs: result.carbs || 0,
      fat: result.fat || 0,
    })
    setOpen(false)
    setResult(null)
    setPreview(null)
  }

  function reset() {
    setResult(null)
    setPreview(null)
    setError('')
    setScanning(false)
  }

  const confidenceColor = result?.confidence === 'high' ? 'text-green-600' :
    result?.confidence === 'medium' ? 'text-yellow-600' : 'text-red-500'

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-full text-sm font-semibold hover:bg-green-500 transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
          <circle cx="12" cy="13" r="4"/>
        </svg>
        Scan Food
      </button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.6)' }}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div>
                  <div className="font-bold text-gray-900">Scan your meal</div>
                  <div className="text-xs text-gray-400 mt-0.5">Adding to {mealType}</div>
                </div>
                <button onClick={() => { setOpen(false); reset(); }}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200">
                  ×
                </button>
              </div>

              <div className="p-6">
                {/* No image yet */}
                {!preview && !scanning && (
                  <>
                    <div className="text-center mb-6">
                      <div className="w-20 h-20 bg-green-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#1a5c38" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                          <circle cx="12" cy="13" r="4"/>
                        </svg>
                      </div>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        Take a photo of your meal or upload from your gallery. AI will instantly identify the food and estimate calories.
                      </p>
                      <div className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full mt-3">
                        ✓ Trained on Nigerian & West African foods
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => cameraRef.current?.click()}
                        className="flex flex-col items-center gap-2 p-4 border-2 border-dashed border-green-200 rounded-2xl hover:border-green-400 hover:bg-green-50 transition-all"
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a5c38" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                          <circle cx="12" cy="13" r="4"/>
                        </svg>
                        <span className="text-sm font-semibold text-green-700">Take Photo</span>
                      </button>
                      <button
                        onClick={() => fileRef.current?.click()}
                        className="flex flex-col items-center gap-2 p-4 border-2 border-dashed border-gray-200 rounded-2xl hover:border-gray-400 hover:bg-gray-50 transition-all"
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                          <circle cx="8.5" cy="8.5" r="1.5"/>
                          <polyline points="21 15 16 10 5 21"/>
                        </svg>
                        <span className="text-sm font-semibold text-gray-600">From Gallery</span>
                      </button>
                    </div>

                    <input ref={cameraRef} type="file" accept="image/*" capture="environment"
                      className="hidden" onChange={e => e.target.files?.[0] && handleImage(e.target.files[0])} />
                    <input ref={fileRef} type="file" accept="image/*"
                      className="hidden" onChange={e => e.target.files?.[0] && handleImage(e.target.files[0])} />
                  </>
                )}

                {/* Scanning */}
                {scanning && (
                  <div className="text-center py-8">
                    {preview && (
                      <img src={preview} alt="Scanning" className="w-full h-48 object-cover rounded-2xl mb-6" />
                    )}
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                      <span className="font-semibold text-gray-800">Analysing your meal...</span>
                    </div>
                    <p className="text-sm text-gray-400">AI is identifying the food and calculating calories</p>
                  </div>
                )}

                {/* Error */}
                {error && !scanning && (
                  <div className="text-center py-6">
                    <div className="text-red-500 font-semibold mb-2">{error}</div>
                    <button onClick={reset} className="text-sm text-green-600 font-semibold underline">Try again</button>
                  </div>
                )}

                {/* Result */}
                {result && !scanning && (
                  <>
                    {preview && (
                      <img src={preview} alt="Scanned meal" className="w-full h-44 object-cover rounded-2xl mb-4" />
                    )}

                    {result.identified ? (
                      <>
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="font-bold text-lg text-gray-900">{result.meal_name}</div>
                            <div className="text-sm text-gray-400 mt-0.5">{result.description}</div>
                          </div>
                          <div className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            result.confidence === 'high' ? 'bg-green-100 text-green-700' :
                            result.confidence === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-600'
                          }`}>
                            {result.confidence} confidence
                          </div>
                        </div>

                        {/* Macros */}
                        <div className="grid grid-cols-4 gap-2 mb-4">
                          {[
                            { label: 'Calories', val: result.kcal, unit: 'kcal', color: 'bg-green-50 text-green-700' },
                            { label: 'Protein', val: result.protein, unit: 'g', color: 'bg-blue-50 text-blue-700' },
                            { label: 'Carbs', val: result.carbs, unit: 'g', color: 'bg-yellow-50 text-yellow-700' },
                            { label: 'Fat', val: result.fat, unit: 'g', color: 'bg-orange-50 text-orange-700' },
                          ].map(m => (
                            <div key={m.label} className={`${m.color} rounded-xl p-2.5 text-center`}>
                              <div className="font-extrabold text-base leading-none">{m.val}</div>
                              <div className="text-xs mt-1 opacity-70">{m.unit}</div>
                              <div className="text-xs font-medium mt-0.5">{m.label}</div>
                            </div>
                          ))}
                        </div>

                        {result.notes && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-3 py-2 text-xs text-yellow-800 mb-4">
                            {result.notes}
                          </div>
                        )}

                        <div className="flex gap-3">
                          <button onClick={reset}
                            className="flex-1 py-3 border border-gray-200 rounded-full text-sm font-semibold text-gray-600 hover:bg-gray-50">
                            Retake
                          </button>
                          <button onClick={handleAdd}
                            className="flex-1 py-3 bg-green-600 text-white rounded-full text-sm font-bold hover:bg-green-500">
                            Add to {mealType}
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-4">
                        <div className="text-gray-500 mb-4">{result.message}</div>
                        <button onClick={reset}
                          className="px-6 py-2.5 bg-green-600 text-white rounded-full text-sm font-bold hover:bg-green-500">
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
