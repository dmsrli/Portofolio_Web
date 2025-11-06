'use client'

import { motion, AnimatePresence } from 'framer-motion'
import React, { useEffect } from 'react'

interface PopupModalProps {
  items: any[]
  index: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

export default function PopupModal({ items, index, onClose, onPrev, onNext }: PopupModalProps) {
  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', keyHandler)
    // lock background scroll
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', keyHandler)
      document.body.style.overflow = prev
    }
  }, [onClose, onPrev, onNext])

  const item = items[index]
  if (!item) return null

  // filter keys to show as metadata
  const hiddenKeys = new Set(['id', 'image', 'src', 'collection', 'favorite'])
  const metaEntries = Object.entries(item).filter(([k]) => !hiddenKeys.has(k))

  const imgSrc =
    item.src ||
    (typeof item.image === 'string' ? item.image : item.image?.secure_url || item.image?.url)

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-9999 flex items-center justify-center bg-black/65 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          key="modal"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-[92%] max-w-4xl max-h-[90vh] overflow-auto rounded-2xl bg-[rgba(10,20,35,0.9)] p-6 border border-cyan-400/30"
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-cyan-300 text-xl">✕</button>

          <div className="flex gap-6 flex-col md:flex-row">
            <div className="flex-1">
              {imgSrc ? (
                <img src={imgSrc} alt={item.title} className="w-full max-h-[60vh] object-contain rounded-lg" />
              ) : (
                <div className="w-full h-[280px] bg-[#071026]/50 flex items-center justify-center rounded-lg text-gray-400">No media</div>
              )}
            </div>

            <div className="flex-1 overflow-auto">
              <h2 className="text-2xl font-bold text-cyan-300">{item.title}</h2>

              {item.description && <p className="mt-3 text-gray-300 whitespace-pre-line">{ String(item.description) }</p>}

              <div className="mt-4 space-y-2 text-sm text-gray-300">
                {metaEntries.map(([k, v]) => (
                  <div key={k} className="flex gap-2">
                    <div className="w-28 text-cyan-300 font-medium">{k}:</div>
                    <div className="flex-1">{typeof v === 'object' ? JSON.stringify(v) : String(v)}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex gap-3">
                <button onClick={onPrev} className="px-4 py-2 bg-white/5 rounded hover:bg-white/10">Prev</button>
                <button onClick={onNext} className="px-4 py-2 bg-white/5 rounded hover:bg-white/10">Next</button>
                {item.repository && (
                  <a href={item.repository} target="_blank" rel="noreferrer" className="ml-auto text-cyan-400 hover:underline">Open Repo ↗</a>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
