'use client'
import { useStepCounter } from '@/lib/useStepCounter'
import { motion } from 'framer-motion'

const STEP_GOAL = 8000

export default function StepCounter() {
  const { steps, calories, supported, permission, requestPermission } = useStepCounter()

  const pct = Math.min(100, Math.round((steps / STEP_GOAL) * 100))

  if (!supported) return null

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="font-extrabold text-gray-900">Steps today</div>
          <div className="text-xs text-gray-400 mt-0.5">Goal: {STEP_GOAL.toLocaleString()} steps</div>
        </div>
        <div className="text-2xl">🚶</div>
      </div>

      {permission === 'prompt' && (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500 mb-4">
            Enable step tracking to automatically earn back calories from walking.
          </p>
          <button onClick={requestPermission}
            className="bg-green-700 text-white font-bold text-sm px-6 py-2.5 rounded-full hover:bg-green-600">
            Enable step tracking
          </button>
        </div>
      )}

      {permission === 'denied' && (
        <div className="bg-red-50 rounded-2xl p-4 text-sm text-red-600">
          Step tracking permission was denied. Enable it in your phone settings to track steps.
        </div>
      )}

      {permission === 'granted' && (
        <>
          {/* Big step number */}
          <div className="flex items-end gap-2 mb-3">
            <motion.div
              key={steps}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className="text-5xl font-extrabold text-gray-900 tracking-tight">
              {steps.toLocaleString()}
            </motion.div>
            <div className="text-sm text-gray-400 mb-2">steps</div>
          </div>

          {/* Progress bar */}
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-3">
            <motion.div
              className="h-full rounded-full"
              style={{ background: pct >= 100 ? '#22c55e' : pct >= 50 ? '#b5f23d' : '#1a5c38' }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* Stats row */}
          <div className="flex justify-between text-sm">
            <div>
              <span className="font-bold text-green-700">+{calories} kcal</span>
              <span className="text-gray-400"> earned back</span>
            </div>
            <div className="text-gray-400">
              {pct >= 100 ? '🎉 Goal reached!' : `${(STEP_GOAL - steps).toLocaleString()} to go`}
            </div>
          </div>

          {/* Milestone messages */}
          {steps >= 10000 && (
            <div className="mt-3 bg-green-50 rounded-xl px-3 py-2 text-sm text-green-700 font-semibold">
              🔥 10,000 steps! You've earned back {calories} kcal today.
            </div>
          )}
          {steps >= 5000 && steps < 10000 && (
            <div className="mt-3 bg-lime-50 rounded-xl px-3 py-2 text-sm text-lime-700 font-semibold">
              💪 Halfway there! Keep going.
            </div>
          )}
        </>
      )}
    </div>
  )
}
