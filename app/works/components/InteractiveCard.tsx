'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'

export interface WorkItem {
  id: string | number
  title: string
  description?: string
  image?: string | { secure_url?: string; url?: string }
  src?: string
  audio?: string
  repository?: string
  url?: string
  favorite?: boolean
  collection?: 'works' | 'side-projects' | 'certifications'
  [k: string]: any
}

interface Props {
  item: WorkItem
  initialPos: { x: number; y: number }
  showHint?: boolean
  staticMode?: boolean
  containerRef?: React.RefObject<HTMLElement | null>
  onOpen?: () => void
}

export default function InteractiveCard({
  item,
  initialPos,
  showHint = false,
  staticMode = false,
  containerRef,
  onOpen,
}: Props) {
  const [isFavorite, setIsFavorite] = useState(item.favorite ?? false)
  const [isDragging, setIsDragging] = useState(false)
  const [hintVisible, setHintVisible] = useState(showHint)
  const [clickStart, setClickStart] = useState<number | null>(null)
  const movedRef = useRef(false)

  const x = useMotionValue(initialPos.x)
  const y = useMotionValue(initialPos.y)
  const mvx = useMotionValue(0)
  const mvy = useMotionValue(0)
  const rotateX = useTransform(mvy, [-60, 60], [10, -10])
  const rotateY = useTransform(mvx, [-60, 60], [-10, 10])

  const cardRef = useRef<HTMLDivElement | null>(null)
  const [dragBounds, setDragBounds] = useState<
    { top: number; left: number; right: number; bottom: number } | false
  >(false)

  // === Setup bounding box fallback constraints
  useEffect(() => {
    if (!containerRef?.current || !cardRef.current) return
    const containerRect = containerRef.current.getBoundingClientRect()
    const cardRect = cardRef.current.getBoundingClientRect()

    setDragBounds({
      top: -containerRect.height / 2 + cardRect.height / 2,
      bottom: containerRect.height / 2 - cardRect.height / 2,
      left: -containerRect.width / 2 + cardRect.width / 2,
      right: containerRect.width / 2 - cardRect.width / 2,
    })
  }, [containerRef])

  // === hint
  useEffect(() => {
    const interval = setInterval(() => {
      setHintVisible(true)
      setTimeout(() => setHintVisible(false), 2000)
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  // pointer handlers
  const handlePointerDown = () => {
    setClickStart(Date.now())
    movedRef.current = false
    setIsDragging(true)
  }

  const handlePointerUp = () => {
    setIsDragging(false)
    const now = Date.now()
    const started = clickStart ?? now
    const elapsed = now - started
    if (!movedRef.current && elapsed > 60) onOpen?.()
  }

  const imgSrc =
    item.src ||
    (typeof item.image === 'string'
      ? item.image
      : item.image?.secure_url || item.image?.url)

  return (
    <motion.div
      ref={cardRef}
      className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2
        w-56 h-72 rounded-[1.2rem] cursor-grab select-none
        border border-cyan-400/40 backdrop-blur-md overflow-hidden
        shadow-[0_0_20px_rgba(0,255,255,0.15)]
        transition-transform duration-300 ${
          isDragging ? 'shadow-[0_0_30px_#00ffffa0]' : ''
        }`}
      style={{ x, y, rotateX, rotateY, touchAction: 'none' }}
      drag={!staticMode}
      dragElastic={0.18}
      dragMomentum
      dragConstraints={dragBounds || containerRef || undefined}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onDrag={(e, info) => {
        if (Math.abs(info.offset.x) + Math.abs(info.offset.y) > 8)
          movedRef.current = true
      }}
      onDragEnd={() => setIsDragging(false)}
      onMouseMove={(e) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
        mvx.set(e.clientX - rect.left - rect.width / 2)
        mvy.set(e.clientY - rect.top - rect.height / 2)
      }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ cursor: 'grabbing', scale: 1.02 }}
    >
      {/* favorite button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          const newFav = !isFavorite
          setIsFavorite(newFav)
          fetch(`/api/admin/${item.collection}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: item.id, favorite: newFav }),
          }).catch(console.error)
        }}
        className={`absolute top-2 right-2 z-20 text-xl ${
          isFavorite
            ? 'text-yellow-400 drop-shadow-[0_0_8px_gold]'
            : 'text-gray-400 hover:text-yellow-300'
        }`}
      >
        {isFavorite ? '★' : '☆'}
      </button>

      {/* content */}
      <div className="absolute inset-0">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={item.title}
            draggable={false}
            className="object-cover w-full h-full rounded-[1.2rem]"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray-400">
            No media
          </div>
        )}
      </div>

      {/* title bar */}
      <div className="absolute bottom-0 w-full bg-black/50 backdrop-blur-sm p-2 text-center text-sm text-cyan-200 font-semibold truncate">
        {item.title}
      </div>

      {hintVisible && (
        <div className="absolute left-2 bottom-2 text-xs text-cyan-100/80 bg-black/30 px-2 py-1 rounded">
          Drag to move →
        </div>
      )}
    </motion.div>
  )
}
