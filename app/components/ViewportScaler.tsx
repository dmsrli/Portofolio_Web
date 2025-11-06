'use client'

import { useEffect } from 'react'

export default function ViewportScaler() {
  useEffect(() => {
    const updateViewportUnits = () => {
      const vw = window.innerWidth * 0.01
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vw', `${vw}px`)
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }

    updateViewportUnits()
    window.addEventListener('resize', updateViewportUnits)
    return () => window.removeEventListener('resize', updateViewportUnits)
  }, [])

  return null
}
