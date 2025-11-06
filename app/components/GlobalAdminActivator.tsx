'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

export default function GlobalAdminActivator() {
  const pathname = usePathname()
  const isHome = pathname === '/' // hanya aktif di home

  const [charging, setCharging] = useState(false)
  const [showPulse, setShowPulse] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pulseDelay = useRef<ReturnType<typeof setTimeout> | null>(null)
  const PRESS_TIME = 2000 // tahan 2 detik

  // === toggle chibi admin visibility ===
  const toggleChibi = () => {
    const visible = sessionStorage.getItem('showChibi') === 'true'
    sessionStorage.setItem('showChibi', (!visible).toString())
    window.dispatchEvent(new CustomEvent('chibi-toggle', { detail: !visible }))
  }

  // === pointer down ===
  const handlePointerDown = (e: PointerEvent | TouchEvent) => {
    if (!isHome) return // ⛔ nonaktif di halaman lain

    const clientX = 'touches' in e ? e.touches[0].clientX : (e as PointerEvent).clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as PointerEvent).clientY
    setPos({ x: clientX, y: clientY })

    pulseDelay.current = setTimeout(() => {
      setShowPulse(true)
      setCharging(true)
    }, 400)

    pressTimer.current = setTimeout(() => {
      setCharging(false)
      setShowPulse(false)
      toggleChibi()
    }, PRESS_TIME)
  }

  // === pointer up ===
  const handlePointerUp = () => {
    if (pressTimer.current) clearTimeout(pressTimer.current)
    if (pulseDelay.current) clearTimeout(pulseDelay.current)
    setCharging(false)
    setShowPulse(false)
  }

  // === keyboard shortcut ===
  const handleKey = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'd') {
      e.preventDefault()
      toggleChibi()
    }
  }

  useEffect(() => {
    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('touchstart', handlePointerDown)
    window.addEventListener('touchend', handlePointerUp)
    window.addEventListener('keydown', handleKey)

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('touchstart', handlePointerDown)
      window.removeEventListener('touchend', handlePointerUp)
      window.removeEventListener('keydown', handleKey)
    }
  }, [isHome])

  return (
    <AnimatePresence>
      {showPulse && isHome && (
        <motion.div
          key="pulse"
          className="fixed z-[9999] pointer-events-none"
          style={{
            top: pos.y - 15,
            left: pos.x - 15,
            width: 30,
            height: 30,
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: charging ? 0.9 : 0, scale: charging ? 1 : 0.9 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-cyan-400/60 shadow-[0_0_8px_rgba(0,255,255,0.5)]"
            animate={{
              scale: charging ? [0.9, 1.1, 0.9] : 1,
              opacity: charging ? [0.4, 0.8, 0.4] : 0,
            }}
            transition={{
              duration: 1.4,
              repeat: charging ? Infinity : 0,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute inset-0 rounded-full bg-cyan-400/20 blur-sm"
            animate={{
              scale: charging ? [1, 1.1, 1] : 1,
              opacity: charging ? [0.2, 0.5, 0.2] : 0,
            }}
            transition={{
              duration: 1.4,
              repeat: charging ? Infinity : 0,
              ease: 'easeInOut',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
