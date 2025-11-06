'use client'

import { useEffect, useRef } from 'react'

export default function BackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.muted = true
    video.loop = true
    video.playsInline = true
    video.autoplay = true

    const playVideo = async () => {
      try {
        await video.play()
      } catch (err) {
        console.warn('Autoplay video gagal:', err)
      }
    }

    playVideo()
  }, [])

  return (
    <video
      ref={videoRef}
      src="/media/background.mp4"
      className="fixed top-0 left-0 w-screen h-screen object-cover z-[-2] opacity-80"
      muted
      autoPlay
      loop
      playsInline
    />
  )
}
