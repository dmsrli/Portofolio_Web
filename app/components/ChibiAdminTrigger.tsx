'use client'

import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import AdminLoginModal from './AdminLoginModal'

export default function ChibiAdminTrigger() {
  const [visible, setVisible] = useState(false)
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState(false)
  const longPressTimer = useRef<number | null>(null)

  useEffect(() => {
    const v = sessionStorage.getItem('showChibi')
    setVisible(v === 'true')

    const toggleListener = (e: Event) => {
      const detail = (e as CustomEvent).detail
      setVisible(detail)
    }
    window.addEventListener('chibi-toggle', toggleListener)

    const onStorage = (e: StorageEvent) => {
      if (e.key === 'showChibi') setVisible(e.newValue === 'true')
    }
    window.addEventListener('storage', onStorage)

    return () => {
      window.removeEventListener('chibi-toggle', toggleListener)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  const hideNav = () => {
    sessionStorage.setItem('showChibi', 'false')
    setVisible(false)
    window.dispatchEvent(new CustomEvent('chibi-toggle', { detail: false }))
  }

  const handlePointerDown = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current)
    longPressTimer.current = window.setTimeout(() => hideNav(), 700)
  }
  const handlePointerUp = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }

  if (!visible) return null

  return (
    <>
      <motion.div
        className="fixed bottom-6 left-6 z-[1000] cursor-pointer select-none"
        onClick={(e) => {
          e.stopPropagation()
          setOpen(true)
        }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        whileHover={{ scale: 1.05, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.img
          src="/images/chibi-admin.png"
          alt="Chibi Admin"
          draggable={false}
          className="w-16 h-16 rounded-full border border-cyan-400/30 shadow-[0_0_15px_rgba(0,255,255,0.35)]"
          animate={{ y: hovered ? -4 : 0, rotate: hovered ? 5 : 0 }}
          transition={{ duration: 0.25 }}
        />
      </motion.div>

      {open && <AdminLoginModal isOpen={open} onClose={() => setOpen(false)} />}
    </>
  )
}
