'use client'

import { usePathname } from 'next/navigation'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import BackgroundVideo from './components/BackgroundVideo'
import BackgroundMusic from './components/BackgroundMusic'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const isAdmin = pathname.startsWith('/admin')

  if (isAdmin) return <>{children}</>

  return (
    <>
      {/* background area (won't block pointer) */}
      {isHome && (
        <div className="fixed inset-0 -z-50 pointer-events-none">
          <div className="absolute inset-0">
            <BackgroundVideo />
          </div>
          <div className="absolute inset-0 bg-[rgba(10,20,35,0.25)] backdrop-blur-xl pointer-events-none" />
        </div>
      )}

      {isHome && <BackgroundMusic />}

      <div className="relative flex flex-col min-h-screen z-10">
        {isHome && <Navbar />}

        <main className="flex-1 w-full flex flex-col items-center justify-start">
          <div className="w-full max-w-7xl px-4 sm:px-6 md:px-8">
            {children}
          </div>
        </main>

        <Footer />
      </div>
    </>
  )
}
