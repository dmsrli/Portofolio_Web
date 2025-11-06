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

  // show navbar only at top (you asked earlier)
  useEffect(() => {
    let mounted = true
    const handleScroll = () => {
      if (!mounted) return
      const y = window.scrollY
      if (y > 100) {
        controls.start({ y: -120, opacity: 0, transition: { duration: 0.35 } })
      } else {
        controls.start({ y: 0, opacity: 1, transition: { duration: 0.35 } })
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      mounted = false
      window.removeEventListener('scroll', handleScroll)
    }
  }, [controls])

  // neuron canvas (lightweight)
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
      // nodes
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
      // lines
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

  // navigation to works with query param
  const goToWorks = (section: string) => {
    setShowDropdown(false)
    router.push(`/works?section=${section}`)
  }

  // contact scroll
  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (pathname === '/') {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
    } else {
      router.push('/#contact')
    }
  }

  // hold ? for minigame
  const handleMouseDown = () => {
    holdTimer.current = window.setTimeout(() => router.push('/minigame'), 10000)
  }
  const handleMouseUp = () => {
    if (holdTimer.current) {
      clearTimeout(holdTimer.current)
      holdTimer.current = null
    }
  }

  // Toggle dropdown but compute fixed coords and render via portal
  const toggleDropdown = (open?: boolean) => {
    const next = open ?? !showDropdown
    if (next) {
      const btn = triggerRef.current
      if (btn) {
        const rect = btn.getBoundingClientRect()
        // place dropdown centered horizontally under the button; adjust for viewport
        const left = Math.min(Math.max(rect.left + rect.width / 2 - 280 / 2, 12), window.innerWidth - 12 - 280)
        const top = rect.bottom + 10
        setDropdownPos({ left, top })
      } else {
        setDropdownPos({ left: window.innerWidth / 2 - 140, top: 64 })
      }
    } else {
      setDropdownPos(null)
    }
    setShowDropdown(next)
  }

  // close on escape / outside click
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node
      // if click outside trigger button and the dropdown, close
      if (!triggerRef.current) return
      // keep open if clicking the trigger itself (it toggles)
      if (triggerRef.current.contains(target as Node)) return
      setShowDropdown(false)
      setDropdownPos(null)
    }
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && (setShowDropdown(false), setDropdownPos(null))
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onEsc)
    }
  }, [])

  // dropdown portal element
  // dropdown portal element
  const DropdownPortal =
    dropdownPos &&
    typeof window !== 'undefined' &&
    createPortal(
      <div
        style={{
          position: 'fixed',
          left: dropdownPos.left,
          top: dropdownPos.top,
          width: 280,
          zIndex: 99999,
        }}
      >
          <div
            className="rounded-xl overflow-hidden bg-[#071026]/95 backdrop-blur-md border border-cyan-400/30 shadow-[0_12px_40px_rgba(0,0,0,0.6)]"
            role="menu"
            aria-label="Works menu"
            onMouseDown={(e) => e.stopPropagation()} // <== penting agar portal click tidak ditelan global blur
          >
            <button
              onClick={async () => {
                setShowDropdown(false)
                setDropdownPos(null)
                await router.push('/works?section=main')
              }}
              className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:text-cyan-300 hover:bg-cyan-500/10 transition"
            >
              🎨 Main Portfolio
            </button>

            <button
              onClick={async () => {
                setShowDropdown(false)
                setDropdownPos(null)
                await router.push('/works?section=side')
              }}
              className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:text-cyan-300 hover:bg-cyan-500/10 transition"
            >
              🧠 Side Projects
            </button>

            <button
              onClick={async () => {
                setShowDropdown(false)
                setDropdownPos(null)
                await router.push('/works?section=cert')
              }}
              className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:text-cyan-300 hover:bg-cyan-500/10 transition"
            >
              🏅 Certifications
            </button>
          </div>
      </div>,
      document.body as HTMLElement
    )


  return (
    <>
      <motion.nav
        animate={controls}
        initial={{ y: 0, opacity: 1 }}
        className="
          fixed top-6 left-1/2 -translate-x-1/2 z-50
          w-[92%] md:w-[75%] lg:w-[65%]
          px-6 py-3 rounded-3xl
          bg-[rgba(10,20,35,0.55)]
          border border-cyan-400/30
          shadow-[0_8px_40px_rgba(0,255,255,0.12)]
          backdrop-filter: blur(6px);
        "
        role="navigation"
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full z-0 pointer-events-none rounded-3xl"
        />

        <div className="relative z-10 flex items-center justify-between">
          <h1 className="text-lg md:text-xl font-bold tracking-widest bg-linear-to-r from-cyan-400 via-blue-400 to-purple-500 text-transparent bg-clip-text select-none">
            Dimas Portofolio
          </h1>

          <div className="flex items-center gap-6 text-sm md:text-base font-medium">
            <button
              ref={triggerRef}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="text-gray-300 hover:text-cyan-400 transition"
              title="Hold 10s for a surprise"
            >
              ?
            </button>

            <div className="relative">
              <button
                onClick={() => toggleDropdown()}
                className="flex items-center gap-2 text-gray-300 hover:text-cyan-400 transition"
              >
                What’s My Works <FaChevronDown className={`ml-1 ${showDropdown ? 'rotate-180' : ''}`} />
              </button>
              {/* DO NOT render dropdown here — render via portal */}
            </div>

            <a href="#contact" onClick={handleContactClick} className="text-gray-300 hover:text-cyan-400 transition">
              Contact
            </a>
          </div>
        </div>
      </motion.nav>

      {/* Portal dropdown (conditionally rendered) */}
      {DropdownPortal}
    </>
  )
}
