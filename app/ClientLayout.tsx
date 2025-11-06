'use client'

import { usePathname } from 'next/navigation'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import BackgroundVideo from './components/BackgroundVideo'
import BackgroundMusic from './components/BackgroundMusic'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminPage = pathname.startsWith('/admin')
  const isHomePage = pathname === '/'

  if (isAdminPage) return <>{children}</>

  return (
    <>
      {/* === FIX: Blur & video global keluar dari flow utama === */}
      {isHomePage && (
        <div className="fixed inset-0 -z-50">
          <BackgroundVideo />

          {/* Lapisan blur seluruh layar */}
          <div className="absolute inset-0 bg-[rgba(10,20,35,0.4)] backdrop-blur-lg pointer-events-none" />
        </div>
      )}

      {/* Musik global tetap aktif */}
      <BackgroundMusic />

      {/* === Semua konten di atas blur === */}
      <div className="relative z-10 min-h-screen flex flex-col text-white">
        {/* Navbar dipisah dari layout supaya tidak terpengaruh overflow */}
        {isHomePage && <Navbar />}

        <main className="flex-1">{children}</main>

        {isHomePage && <Footer />}
      </div>
    </>
  )
}
