'use client'

import { useEffect, useRef } from 'react'

export default function BackgroundVideo() {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = ref.current
    if (!v) return
    v.muted = true
    v.loop = true
    v.playsInline = true
    v.play().catch(() => {})
  }, [])

  return (
    <video
      ref={ref}
      src="/media/background.mp4"
      className="absolute inset-0 w-full h-full object-cover z-[-60] opacity-95 pointer-events-none"
      muted
      autoPlay
      loop
      playsInline
    />
  )
}
