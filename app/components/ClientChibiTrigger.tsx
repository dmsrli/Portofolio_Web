'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import ChibiAdminTrigger from './ChibiAdminTrigger'

export default function ClientChibiTrigger() {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // baca state awal dari sessionStorage
    const initial = sessionStorage.getItem('showChibi') === 'true'
    setVisible(initial)

    // dengarkan event dari GlobalAdminActivator
    const toggleListener = (e: Event) => {
      const detail = (e as CustomEvent).detail
      setVisible(detail)
    }

    window.addEventListener('chibi-toggle', toggleListener)
    return () => window.removeEventListener('chibi-toggle', toggleListener)
  }, [])

  if (isAdmin || !visible) return null

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <ChibiAdminTrigger />
    </div>
  )
}
