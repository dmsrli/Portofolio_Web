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
        <div className="fixed inset-0 -z-50 overflow-hidden">
          <BackgroundVideo />
          {/* Overlay blur full screen */}
          <div className="absolute inset-0 bg-[rgba(10,20,35,0.4)] backdrop-blur-lg pointer-events-none" />
        </div>
      )}

      {/* Global Background Music */}
      <BackgroundMusic />

      {/* === Konten utama === */}
      <div className="relative z-10 min-h-screen flex flex-col text-white items-center justify-center overflow-hidden">
        {/* Navbar */}
        {isHomePage && <Navbar />}

        {/* Area utama terpusat & scalable */}
        <main className="flex-1 flex items-center justify-center w-full overflow-hidden">
          <div
            className="
              relative 
              w-[1440px] 
              h-[900px] 
              max-w-full 
              max-h-[100vh] 
              flex 
              flex-col 
              items-center 
              justify-center 
              px-4 sm:px-6 md:px-8
            "
          >
            {children}
          </div>
        </main>

        {/* Footer */}
        {isHomePage && <Footer />}
      </div>
    </>
  )
}
