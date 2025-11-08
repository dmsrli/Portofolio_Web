import { useEffect, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import Background3D from '../components/Background3D'
import InteractiveCard, { WorkItem } from './components/InteractiveCard'
import PopupModal from './components/PopupModal'

type ItemType = 'image' | 'video' | 'code' | 'audio'

export default function WorksContent() {
  const [activeTab, setActiveTab] = useState<'main' | 'side' | 'cert'>('main')
  const searchParams = useSearchParams()

  useEffect(() => {
    const section = searchParams.get('section')
    if (section === 'main' || section === 'side' || section === 'cert') {
      setActiveTab(section)
    }
  }, [searchParams])

  const [works, setWorks] = useState<WorkItem[]>([])
  const [sideProjects, setSideProjects] = useState<WorkItem[]>([])
  const [certifications, setCertifications] = useState<WorkItem[]>([])
  const [loading, setLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const activeContentList =
    activeTab === 'main'
      ? works
      : activeTab === 'side'
      ? sideProjects
      : certifications

  // === Fetch Data ===
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [wRes, sRes, cRes] = await Promise.all([
          fetch('/api/works'),
          fetch('/api/side-projects'),
          fetch('/api/certifications'),
        ])
        const [wData, sData, cData] = await Promise.all([
          wRes.json(),
          sRes.json(),
          cRes.json(),
        ])

        const normalize = (
          arr: any[],
          collection: 'works' | 'side-projects' | 'certifications'
        ): WorkItem[] =>
          arr.map((d) => ({
            id: String(d.id),
            title: d.title,
            description: d.description,
            ...d,
            src:
              d.image ||
              d.audio ||
              d.video ||
              d.code ||
              d.src ||
              '/placeholder.jpg',
            favorite: d.favorite || false,
            collection,
          }))

        setWorks(normalize(wData, 'works'))
        setSideProjects(normalize(sData, 'side-projects'))
        setCertifications(normalize(cData, 'certifications'))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [])

  const tabs = [
    { id: 'main', label: 'Main Portfolio' },
    { id: 'side', label: 'My Side Projects' },
    { id: 'cert', label: 'Certifications' },
  ]

  const activeContent = activeContentList

  const CARD_W = 240
  const CARD_H = 300
  const SPACING_X = 40
  const SPACING_Y = 48
  const MARGIN = 120

  const generatePositionFromId = (
    id: string | number,
    idx: number,
    cols: number
  ) => {
    const s = String(id)
    let h = 0
    for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i)
    const rand = Math.abs(Math.sin(h) % 1)
    const col = idx % cols
    const row = Math.floor(idx / cols)
    const baseX =
      col * (CARD_W + SPACING_X) -
      Math.max(0, (cols - 1) * (CARD_W + SPACING_X)) / 2
    const baseY = row * (CARD_H + SPACING_Y)
    const offsetX = (rand - 0.5) * 30
    const offsetY = (rand - 0.5) * 30
    return { x: baseX + offsetX, y: baseY + offsetY }
  }

  const [cols, setCols] = useState(4)
  useEffect(() => {
    const calcCols = () => {
      const w = window.innerWidth
      const possible = Math.max(1, Math.floor((w - MARGIN * 2) / (CARD_W + SPACING_X)))
      setCols(Math.min(Math.max(1, possible), 6))
      const rows = Math.ceil(activeContent.length / Math.max(1, possible))
      if (containerRef.current) {
        const needed = rows * (CARD_H + SPACING_Y) + MARGIN * 2
        containerRef.current.style.minHeight = `${Math.max(window.innerHeight, needed)}px`
      }
    }
    calcCols()
    window.addEventListener('resize', calcCols)
    return () => window.removeEventListener('resize', calcCols)
  }, [activeContent.length])

  const openAt = (index: number) => setActiveIndex(index)
  const closeModal = () => setActiveIndex(null)
  const showPrev = () =>
    setActiveIndex((i) =>
      i == null ? null : (i - 1 + activeContent.length) % activeContent.length
    )
  const showNext = () =>
    setActiveIndex((i) => (i == null ? null : (i + 1) % activeContent.length))

  return (
    <div className="relative w-full min-h-screen text-white overflow-auto bg-[#050b16]">
      {/* === FIX: background layering === */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Background3D />
      </div>

      {/* === TRANSPARENT SENSOR === */}
      <div
        className="fixed inset-0 z-10 pointer-events-none"
        id="background-sensor"
      ></div>

      {/* === Foreground UI === */}
      <div className="relative z-10 pointer-events-auto">
        {/* Home button */}
        <div className="absolute top-6 left-6 z-30">
          <Link
            href="/"
            className="flex items-center gap-2 text-cyan-400 font-semibold tracking-wider 
                       bg-[rgba(10,15,25,0.4)] backdrop-blur-md px-5 py-2 rounded-xl 
                       border border-[rgba(94,180,255,0.3)] transition-all duration-300"
          >
            <span className="text-lg">←</span> Home
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mt-20 space-x-6 z-20 relative">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`relative px-6 py-3 rounded-xl text-lg font-semibold transition-all duration-300
                ${
                  activeTab === tab.id
                    ? 'bg-linear-to-r from-blue-500 to-cyan-400 text-white shadow-[0_0_20px_#00ffff70]'
                    : 'bg-white/5 hover:bg-white/10 text-gray-300'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Card Container */}
        <div
          id="card-container"
          ref={containerRef}
          className="relative w-full mt-32 pb-40 z-10"
        >
          <div className="relative w-full h-full">
            <AnimatePresence>
              {!loading &&
                activeContent.map((item, idx) => {
                  const pos = generatePositionFromId(item.id, idx, cols)
                  const offsetY = pos.y + 80
                  return (
                    <InteractiveCard
                      key={item.id}
                      item={item}
                      initialPos={{ x: pos.x, y: offsetY }}
                      containerRef={containerRef}
                      onOpen={() => openAt(idx)}
                      showHint={idx === 0}
                    />
                  )
                })}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Modal */}
      {activeIndex != null && (
        <PopupModal
          items={activeContent}
          index={activeIndex}
          onClose={closeModal}
          onPrev={showPrev}
          onNext={showNext}
        />
      )}
    </div>
  )
}
