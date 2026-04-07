'use client'
import { useState, useEffect, useRef } from 'react'

export function useStepCounter() {
  const [steps, setSteps] = useState(0)
  const [calories, setCalories] = useState(0)
  const [supported, setSupported] = useState(false)
  const [permission, setPermission] = useState<'granted' | 'denied' | 'prompt' | 'unsupported'>('prompt')
  const lastAcc = useRef<number>(0)
  const stepThreshold = 12
  const stepCooldown = useRef<number>(0)

  useEffect(() => {
    // Load saved steps from today
    const today = new Date().toISOString().split('T')[0]
    const saved = localStorage.getItem('trimtrack_steps')
    if (saved) {
      const parsed = JSON.parse(saved)
      if (parsed.date === today) {
        setSteps(parsed.steps)
        setCalories(Math.round(parsed.steps * 0.04))
      }
    }

    // Check support
    if (typeof window !== 'undefined' && 'DeviceMotionEvent' in window) {
      setSupported(true)
    } else {
      setPermission('unsupported')
    }
  }, [])

  function saveSteps(count: number) {
    const today = new Date().toISOString().split('T')[0]
    localStorage.setItem('trimtrack_steps', JSON.stringify({ date: today, steps: count }))
  }

  async function requestPermission() {
    if (!supported) return

    // iOS 13+ requires explicit permission
    if (typeof (DeviceMotionEvent as unknown as { requestPermission?: () => Promise<string> }).requestPermission === 'function') {
      try {
        const result = await (DeviceMotionEvent as unknown as { requestPermission: () => Promise<string> }).requestPermission()
        if (result === 'granted') {
          setPermission('granted')
          startTracking()
        } else {
          setPermission('denied')
        }
      } catch {
        setPermission('denied')
      }
    } else {
      // Android / non-iOS — no permission needed
      setPermission('granted')
      startTracking()
    }
  }

  function startTracking() {
    window.addEventListener('devicemotion', handleMotion)
  }

  function handleMotion(event: DeviceMotionEvent) {
    const acc = event.accelerationIncludingGravity
    if (!acc) return

    const magnitude = Math.sqrt(
      Math.pow(acc.x || 0, 2) +
      Math.pow(acc.y || 0, 2) +
      Math.pow(acc.z || 0, 2)
    )

    const delta = Math.abs(magnitude - lastAcc.current)
    lastAcc.current = magnitude

    const now = Date.now()
    if (delta > stepThreshold && now - stepCooldown.current > 400) {
      stepCooldown.current = now
      setSteps(prev => {
        const next = prev + 1
        const kcal = Math.round(next * 0.04)
        setCalories(kcal)
        saveSteps(next)
        return next
      })
    }
  }

  useEffect(() => {
    return () => {
      window.removeEventListener('devicemotion', handleMotion)
    }
  }, [])

  return { steps, calories, supported, permission, requestPermission }
}
