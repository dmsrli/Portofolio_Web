'use client'

import { useEffect, useRef, useState } from 'react'
import { FaPause, FaPlay } from 'react-icons/fa'

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.loop = true
    audio.volume = 0.45

    const tryPlay = () => {
      if (!isPlaying) return
      audio.play().catch(() => {})
    }

    const unlock = () => tryPlay()

    window.addEventListener('click', unlock)
    window.addEventListener('touchstart', unlock)

    return () => {
      window.removeEventListener('click', unlock)
      window.removeEventListener('touchstart', unlock)
    }
  }, [isPlaying])

  const toggleMusic = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play().catch(() => {})
      setIsPlaying(true)
    }
  }

  return (
    <>
      <audio ref={audioRef} src="/media/background-music.mp3" preload="auto" />

      <button
        onClick={toggleMusic}
        className="fixed bottom-6 right-6 z-9999
          bg-[rgba(0,0,0,0.4)] border border-cyan-300/40 backdrop-blur-sm
          text-cyan-200 p-3 rounded-full shadow-[0_0_10px_rgba(0,255,255,0.4)]
          hover:shadow-[0_0_15px_rgba(0,255,255,0.6)] transition-all duration-300"
      >
        {isPlaying ? <FaPause size={13} /> : <FaPlay size={13} />}
      </button>
    </>
  )
}
