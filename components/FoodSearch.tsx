'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { searchOpenFoodFacts, getFoodByBarcode } from '@/lib/openfoodfacts'
import { FOODS } from '@/lib/foods'
import type { FoodResult } from '@/lib/openfoodfacts'

interface FoodSearchProps {
  activeMeal: string
  onAdd: (food: { food_name: string; kcal: number; protein: number; carbs: number; fat: number }) => void
}

export default function FoodSearch({ activeMeal, onAdd }: FoodSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<FoodResult[]>([])
  const [loading, setLoading] = useState(false)
  const [showScanner, setShowScanner] = useState(false)
  const [scanResult, setScanResult] = useState<string>('')
  const [barcodeFood, setBarcodeFood] = useState<FoodResult | null>(null)
  const [barcodeLoading, setBarcodeLoading] = useState(false)
  const debounceRef = useRef<NodeJS.Timeout>()
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Convert local foods to FoodResult format
  const localFoods: FoodResult[] = FOODS.map(f => ({
    id: String(f.id),
    name: f.name,
    kcal: f.kcal,
    protein: f.protein,
    carbs: f.carbs,
    fat: f.fat,
    serving: '1 serving',
    source: 'local' as const,
  }))

  const search = useCallback(async (q: string) => {
    if (!q || q.length < 2) {
      setResults(localFoods.slice(0, 10))
      return
    }

    setLoading(true)

    // Search local first
    const local = localFoods.filter(f => f.name.toLowerCase().includes(q.toLowerCase()))

    // Search OpenFoodFacts
    const online = await searchOpenFoodFacts(q)

    // Merge €” local Nigerian foods first, then online results
    const merged = [
      ...local.slice(0, 4),
      ...online.filter(o => !local.some(l => l.name.toLowerCase() === o.name.toLowerCase())),
    ].slice(0, 15)

    setResults(merged)
    setLoading(false)
  }, [])

  useEffect(() => {
    // Show local foods by default
    setResults(localFoods.slice(0, 10))
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => search(query), 400)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [query, search])

  async function startBarcodeScanner() {
    setShowScanner(true)
    setBarcodeFood(null)
    setScanResult('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
    } catch (err) {
      console.error('Camera error:', err)
    }
  }

  function stopScanner() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    setShowScanner(false)
  }

  async function handleBarcodeInput(barcode: string) {
    if (!barcode || barcode.length < 8) return
    setBarcodeLoading(true)
    const food = await getFoodByBarcode(barcode)
    if (food) {
      setBarcodeFood(food)
      setScanResult(barcode)
    } else {
      setScanResult('not_found')
    }
    setBarcodeLoading(false)
  }

  function handleAdd(food: FoodResult) {
    onAdd({
      food_name: food.brand ? `${food.name} (${food.brand})` : food.name,
      kcal: food.kcal,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
    })
    setQuery('')
    setResults(localFoods.slice(0, 10))
  }

  return (
    <div>
      {/* SEARCH INPUT */}
      <div className="flex gap-2 mb-3">
        <div className="flex-1 relative">
          <input
            className="w-full border border-gray-200 rounded-full px-4 py-2.5 text-sm outline-none focus:border-green-600 bg-white pr-10"
            placeholder="Search 3M+ foods or Nigerian dishes..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          {loading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"/>
            </div>
          )}
        </div>
        {/* BARCODE BUTTON */}
        <button
          onClick={startBarcodeScanner}
          className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-800 flex-shrink-0"
          title="Scan barcode"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9V5a2 2 0 0 1 2-2h4M3 15v4a2 2 0 0 0 2 2h4M21 9V5a2 2 0 0 0-2-2h-4M21 15v4a2 2 0 0 1-2 2h-4"/>
            <line x1="7" y1="12" x2="7" y2="12.01"/><line x1="10" y1="9" x2="10" y2="15"/>
            <line x1="13" y1="9" x2="13" y2="15"/><line x1="16" y1="9" x2="16" y2="15"/>
          </svg>
        </button>
      </div>

      {/* SOURCE INDICATOR */}
      {query.length >= 2 && !loading && (
        <div className="text-xs text-gray-400 mb-2 px-1">
          {results.filter(r => r.source === 'local').length > 0 && (
            <span className="text-green-600 font-semibold">Nigerian foods - </span>
          )}
          <span>Global database</span>
        </div>
      )}

      {/* RESULTS */}
      <div className="space-y-1.5 max-h-64 overflow-y-auto">
        {results.map((food) => (
          <motion.div
            key={food.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-gray-100 bg-gray-50 hover:bg-green-50 cursor-pointer transition-colors"
            onClick={() => handleAdd(food)}
          >
            {food.image && (
              <img src={food.image} alt="" className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
            )}
            {!food.image && (
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                food.source === 'local' ? 'NG' : 'GL'
              }`}>
                {food.source === 'local' ? 'NG' : 'GL'}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-gray-800 truncate">{food.name}</div>
              <div className="text-xs text-gray-400 truncate">
                {food.brand && <span className="text-gray-500">{food.brand} - </span>}
                {food.protein}g P - {food.carbs}g C - {food.fat}g F
                {food.serving && <span className="text-gray-300"> - {food.serving}</span>}
              </div>
            </div>
            <div className="flex-shrink-0 text-right">
              <div className="text-sm font-extrabold text-green-700">{food.kcal}</div>
              <div className="text-xs text-gray-400">kcal</div>
            </div>
          </motion.div>
        ))}

        {query.length >= 2 && !loading && results.length === 0 && (
          <div className="text-center py-6">
            <div className="text-gray-400 text-sm mb-1">No results for "{query}"</div>
            <div className="text-xs text-gray-300">Try scanning the barcode instead</div>
          </div>
        )}
      </div>

      {/* BARCODE SCANNER MODAL */}
      <AnimatePresence>
        {showScanner && (
          <div className="fixed inset-0 z-50 bg-black flex flex-col">
            <div className="flex items-center justify-between px-5 py-4">
              <div className="text-white font-bold">Scan barcode</div>
              <button onClick={stopScanner} className="text-white text-2xl">x</button>
            </div>

            {/* Camera view */}
            <div className="flex-1 relative">
              <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
              {/* Scanning overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-32 border-2 border-lime-400 rounded-xl relative">
                  <div className="absolute inset-x-0 h-0.5 bg-lime-400 top-1/2"
                    style={{ animation: 'scan 2s ease-in-out infinite' }}/>
                  <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-lime-400 rounded-tl"/>
                  <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-lime-400 rounded-tr"/>
                  <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-lime-400 rounded-bl"/>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-lime-400 rounded-br"/>
                </div>
              </div>
            </div>

            {/* Manual barcode input */}
            <div className="bg-gray-900 px-5 py-4">
              <p className="text-gray-400 text-xs mb-3 text-center">
                Point camera at barcode - or type barcode number below
              </p>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Type barcode number..."
                  className="flex-1 bg-gray-800 text-white rounded-full px-4 py-2.5 text-sm outline-none border border-gray-700 focus:border-lime-400"
                  onChange={e => {
                    if (e.target.value.length >= 8) handleBarcodeInput(e.target.value)
                  }}
                />
              </div>

              {barcodeLoading && (
                <div className="flex items-center justify-center gap-2 mt-3 text-gray-400 text-sm">
                  <div className="w-4 h-4 border-2 border-lime-400 border-t-transparent rounded-full animate-spin"/>
                  Looking up product...
                </div>
              )}

              {scanResult === 'not_found' && (
                <div className="text-red-400 text-sm text-center mt-3">Product not found in database</div>
              )}

              {barcodeFood && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="mt-3 bg-gray-800 rounded-2xl p-4">
                  <div className="font-bold text-white mb-1">{barcodeFood.name}</div>
                  {barcodeFood.brand && <div className="text-gray-400 text-xs mb-2">{barcodeFood.brand}</div>}
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {[
                      { label: 'kcal', val: barcodeFood.kcal },
                      { label: 'protein', val: `${barcodeFood.protein}g` },
                      { label: 'carbs', val: `${barcodeFood.carbs}g` },
                      { label: 'fat', val: `${barcodeFood.fat}g` },
                    ].map(m => (
                      <div key={m.label} className="bg-gray-700 rounded-xl p-2 text-center">
                        <div className="text-white font-bold text-sm">{m.val}</div>
                        <div className="text-gray-400 text-xs">{m.label}</div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => { handleAdd(barcodeFood); stopScanner() }}
                    className="w-full bg-lime-400 text-gray-900 font-bold py-2.5 rounded-full text-sm">
                    Add to {activeMeal}
                  </button>
                </motion.div>
              )}
            </div>

            <style>{`
              @keyframes scan { 0%, 100% { top: 20%; } 50% { top: 80%; } }
            `}</style>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
