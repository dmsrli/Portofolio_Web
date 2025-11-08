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

  // Admin page skip semua layout global
  if (isAdminPage) return <>{children}</>

  return (
    <>
      {/* === Background global (video + blur) === */}
      {isHomePage && (
        <div className="fixed inset-0 -z-50">
          <BackgroundVideo />
          <div className="absolute inset-0 bg-[rgba(10,20,35,0.4)] backdrop-blur-lg pointer-events-none" />
        </div>
      )}

      {/* Musik global tetap hidup di semua halaman */}
      <BackgroundMusic />

      {/* === Wrapper utama === */}
      <div className="relative z-10 flex min-h-screen flex-col text-white">
        {/* Navbar tetap di atas semua konten */}
        {isHomePage && <Navbar />}

        {/* Konten utama */}
        <main className="flex-1 w-full flex flex-col items-center justify-start overflow-visible">
          {/* Container utama: responsif tapi tidak mengubah proporsi */}
          <div className="w-full max-w-[1440px] px-4 sm:px-6 md:px-8 lg:px-12">
            {children}
          </div>
        </main>

        {/* Footer di bagian bawah halaman */}
        {isHomePage && <Footer />}
      </div>
    </>
  )
}
