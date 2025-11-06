'use client'

import { useEffect, useState } from 'react'

function StaticCard({ item }: { item: any }) {
  const [showModal, setShowModal] = useState(false)
  const imgSrc =
    typeof item.image === 'string'
      ? item.image
      : item.image?.secure_url || item.image?.url || item.image?.src || null

  return (
    <>
      <div
        onClick={() => setShowModal(true)}
        className="relative cursor-pointer group w-80 h-64 rounded-3xl overflow-hidden 
          bg-[rgba(10,20,35,0.35)] backdrop-blur-md border border-cyan-400/30 
          shadow-[0_0_25px_rgba(0,255,255,0.15)] transition-all hover:scale-[1.03]"
      >
        {/* Media */}
        <div className="absolute inset-0">
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={item.title}
              className="object-cover w-full h-full"
              draggable={false}
            />
          ) : (
            <div className="flex items-center justify-center text-gray-400 text-sm h-full bg-[#0b1220]">
              No image
            </div>
          )}
        </div>

        {/* Overlay title */}
        <div className="absolute bottom-0 w-full bg-black/55 backdrop-blur-sm px-3 py-2">
          <h3 className="text-base font-semibold text-cyan-200 truncate">
            {item.title}
          </h3>
        </div>
      </div>

      {showModal && <Modal item={item} onClose={() => setShowModal(false)} />}
    </>
  )
}

function Modal({ item, onClose }: { item: any; onClose: () => void }) {
  const imgSrc =
    typeof item.image === 'string'
      ? item.image
      : item.image?.secure_url || item.image?.url || item.image?.src

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleEsc)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleEsc)
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative z-10 max-w-5xl w-full rounded-3xl bg-[rgba(10,20,35,0.95)] 
                   border border-cyan-600/30 p-6 overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
        >
          ✕
        </button>

        {imgSrc && (
          <div className="w-full flex justify-center mb-6">
            <img
              src={imgSrc}
              alt={item.title}
              className="max-h-[70vh] object-contain rounded-2xl shadow-lg"
            />
          </div>
        )}

        {item.audio && (
          <div className="flex items-center justify-center my-6">
            <audio controls src={item.audio} className="w-[90%]" />
          </div>
        )}

        <h2 className="text-2xl font-bold text-cyan-300 mb-2">{item.title}</h2>
        {item.description && (
          <p className="text-gray-300 mb-4 leading-relaxed">{item.description}</p>
        )}
      </div>
    </div>
  )
}

export default function WorksSection() {
  const [favorites, setFavorites] = useState<any[]>([])
  const [visible, setVisible] = useState<any[]>([])
  const [batch, setBatch] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      const collections = ['works', 'side-projects', 'certifications']
      try {
        const res = await Promise.all(
          collections.map(async (c) => {
            const r = await fetch(`/api/admin/${c}`)
            const data = await r.json()
            return data.filter((d: any) => d.favorite).map((d: any) => ({ ...d, collection: c }))
          })
        )
        const merged = res.flat()
        setFavorites(merged)
        setVisible(merged.slice(0, 3))
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  useEffect(() => {
    if (favorites.length <= 3) return
    const timer = setInterval(() => {
      const next = (batch + 1) % Math.ceil(favorites.length / 3)
      const start = next * 3
      const end = start + 3
      setVisible(favorites.slice(start, end))
      setBatch(next)
    }, 30000)
    return () => clearInterval(timer)
  }, [batch, favorites])

  if (loading)
    return <p className="text-gray-400 text-center mt-10 animate-pulse">Loading featured works...</p>

  if (visible.length === 0)
    return <p className="text-gray-400 text-center mt-10">No favorite works yet ✨</p>

  return (
    <section
      className="relative flex flex-col items-center justify-center min-h-[90vh] text-white px-6 py-20 
                 bg-[rgba(10,20,35,0.35)]"
    >
      <h2 className="text-5xl font-bold mb-4 text-cyan-400 drop-shadow-[0_0_25px_rgba(93,224,255,0.7)] text-center">
        Featured Works ✨
      </h2>

      <p className="text-gray-300 text-center mb-12 max-w-2xl leading-relaxed">
        These are my most outstanding works — a showcase of creativity, logic, and futuristic spirit.
      </p>

      <div className="relative w-full max-w-6xl z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 place-items-center">
        {visible.map((item) => (
          <StaticCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  )
}
