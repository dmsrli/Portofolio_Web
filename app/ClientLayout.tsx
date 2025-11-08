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
      {/* === Background global === */}
      {isHomePage && (
        <div className="fixed inset-0 -z-50">
          <BackgroundVideo />
          {/* Overlay blur */}
          <div className="absolute inset-0 bg-[rgba(10,20,35,0.4)] backdrop-blur-lg pointer-events-none" />
        </div>
      )}

      {/* Global Music */}
      <BackgroundMusic />

      {/* === Semua konten utama === */}
      <div className="relative z-10 min-h-screen flex flex-col text-white">
        {/* Navbar dipisah supaya tidak kena overflow */}
        {isHomePage && <Navbar />}

        {/* Konten utama dengan lebar dikunci */}
        <main className="flex-1 flex justify-center">
          <div className="w-[1440px] max-w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
            {children}
          </div>
        </main>

        {isHomePage && <Footer />}
      </div>
    </>
  )
}
