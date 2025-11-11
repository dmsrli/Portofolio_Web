'use client'

import React, { useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, useAnimation } from 'framer-motion'
import { FaChevronDown } from 'react-icons/fa'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Navbar() {
  const controls = useAnimation()
  const [showDropdown, setShowDropdown] = useState(false)
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number } | null>(null)
  const pathname = usePathname()
  const router = useRouter()
  const holdTimer = useRef<number | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)

  // ---------- AUTO-HIDE / SLIDE (robust)
  useEffect(() => {
    let lastY = window.scrollY
    let ticking = false

    const update = () => {
      const y = window.scrollY

      if (y > lastY && y > 120) {
  controls.start({
    y: -140,
    opacity: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  })
} else if (y < 40) {
  controls.start({
    y: 0,
    opacity: 1,
    transition: { duration: 0.45, ease: "easeOut" },
  })
}


      lastY = y
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update)
        ticking = true
      }
    }

    // passive listener for performance
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [controls])

  // ---------- Neuron canvas (unchanged)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = (canvas.width = canvas.offsetWidth)
    let h = (canvas.height = canvas.offsetHeight)
    const nodes = Array.from({ length: 36 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
    }))

    let raf = 0
    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = 'rgba(93,224,255,0.85)'
      nodes.forEach((n) => {
        n.x += n.vx
        n.y += n.vy
        if (n.x < 0 || n.x > w) n.vx *= -1
        if (n.y < 0 || n.y > h) n.vy *= -1
        ctx.beginPath()
        ctx.arc(n.x, n.y, 1.4, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.strokeStyle = 'rgba(93,224,255,0.12)'
      ctx.lineWidth = 0.8
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j]
          const dx = a.x - b.x, dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 90) {
            ctx.globalAlpha = 1 - dist / 90
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(draw)
    }
    draw()

    const onResize = () => {
      w = canvas.width = canvas.offsetWidth
      h = canvas.height = canvas.offsetHeight
    }
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  // ---------- Works routing (unchanged)
  const goToWorks = (section: string) => {
    setShowDropdown(false)
    router.push(`/works?section=${section}`)
  }

  // ---------- Contact smooth scroll (unchanged)
  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (pathname === '/') {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
    } else {
      router.push('/#contact')
    }
  }

  // ---------- Hold mini-game (unchanged)
  const handleMouseDown = () => {
    holdTimer.current = window.setTimeout(() => router.push('/minigame'), 10000)
  }
  const handleMouseUp = () => {
    if (holdTimer.current) clearTimeout(holdTimer.current)
    holdTimer.current = null
  }

  // ---------- Dropdown portal (unchanged logic, adjusted position)
  const toggleDropdown = () => {
    const next = !showDropdown
    setShowDropdown(next)

    if (next && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setDropdownPos({
        left: Math.min(Math.max(rect.left + rect.width / 2 - 130, 12), window.innerWidth - 280),
        top: rect.bottom + 10,
      })
    } else {
      setDropdownPos(null)
    }
  }

  const DropdownPortal =
    dropdownPos &&
    typeof window !== 'undefined' &&
    createPortal(
      <div style={{ position: 'fixed', left: dropdownPos.left, top: dropdownPos.top, width: 280, zIndex: 99999 }}>
        <div className="rounded-xl overflow-hidden bg-[#071026]/95 backdrop-blur-md border border-cyan-400/30 shadow-[0_12px_40px_rgba(0,0,0,0.6)]">
          <button onClick={() => goToWorks('main')} className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:text-cyan-300 hover:bg-cyan-500/10 transition">🎨 Main Portfolio</button>
          <button onClick={() => goToWorks('side')} className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:text-cyan-300 hover:bg-cyan-500/10 transition">🧠 Side Projects</button>
          <button onClick={() => goToWorks('cert')} className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:text-cyan-300 hover:bg-cyan-500/10 transition">🏅 Certifications</button>
        </div>
      </div>,
      document.body
    )

  return (
    <>
      <motion.nav
        animate={controls}
        initial={{ y: 0, opacity: 1, boxShadow: '0px 12px 30px rgba(0,255,255,0.15)' }}
        className="
          fixed top-6 left-1/2 -translate-x-1/2
          z-9999
          w-[92%] md:w-[75%] lg:w-[65%]
          px-6 py-3 rounded-3xl
          bg-[rgba(10,20,35,0.55)]
          border border-cyan-400/30
          shadow-[0_8px_40px_rgba(0,255,255,0.12)]
          backdrop-blur-md
        "
        role="navigation"
      >
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0 pointer-events-none rounded-3xl" />

        <div className="relative z-10 flex items-center justify-between">
          <h1 className="text-lg md:text-xl font-bold tracking-widest bg-linear-to-r from-cyan-400 via-blue-400 to-purple-500 text-transparent bg-clip-text select-none">
            Dimas Portofolio
          </h1>

          <div className="flex items-center gap-6 text-sm md:text-base font-medium">
            <button ref={triggerRef} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} className="text-gray-300 hover:text-cyan-400 transition" title="Hold 10s for a surprise">?</button>

            <button onClick={toggleDropdown} className="flex items-center gap-2 text-gray-300 hover:text-cyan-400 transition">
              What’s My Works <FaChevronDown className={`${showDropdown ? 'rotate-180' : ''}`} />
            </button>

            <a href="#contact" onClick={handleContactClick} className="text-gray-300 hover:text-cyan-400 transition">Contact</a>
          </div>
        </div>
      </motion.nav>

      {DropdownPortal}
    </>
  )
}
