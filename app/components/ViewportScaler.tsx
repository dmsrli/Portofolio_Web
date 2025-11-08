'use client'
import { useEffect } from 'react'

export default function ViewportScaler() {
  useEffect(() => {
    const handleResize = () => {
      const baseWidth = 1440
      const baseHeight = 900
      const scaleX = window.innerWidth / baseWidth
      const scaleY = window.innerHeight / baseHeight
      const scale = Math.min(scaleX, scaleY)

      document.documentElement.style.setProperty('--viewport-zoom', scale.toString())
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <style jsx global>{`
      html,
      body {
        width: 100%;
        height: 100%;
        overflow: hidden;
      }

      body {
        zoom: var(--viewport-zoom);
        transform-origin: top left;
        background-color: transparent;
      }

      /* Tambahkan sedikit padding aman supaya tidak ada bagian terpotong */
      #__next {
        padding: 20px;
        box-sizing: border-box;
      }
    `}</style>
  )
}
