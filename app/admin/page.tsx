'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function AdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  // Simulasi cek login status (bisa dihubungkan ke localStorage/token nanti)
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isAdmin')
    if (!isLoggedIn) {
      router.push('/')
    } else {
      setLoading(false)
    }
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-cyan-300 text-lg">
        Loading...
      </div>
    )
  }

  const handleLogout = () => {
    localStorage.removeItem('isAdmin')
    router.push('/')
  }

  // === Daftar Section dengan rute masing-masing ===
  const sections = [
    { name: 'Main Portfolio', path: '/admin/works' },
    { name: 'Side Projects', path: '/admin/side-projects' },
    { name: 'Certifications', path: '/admin/certifications' },
  ]

  return (
    <div className="min-h-screen bg-[#0b1220] text-white p-8 relative overflow-hidden">
      {/* === Tombol Logout === */}
      <div className="flex justify-end">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-5 py-2 
                     rounded-lg font-semibold shadow-[0_0_15px_rgba(0,255,255,0.4)]
                     hover:shadow-[0_0_25px_rgba(0,255,255,0.7)] transition-all"
        >
          Logout
        </motion.button>
      </div>

      {/* === Judul Dashboard === */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-cyan-300 mt-12 mb-8 text-center"
      >
        🛠️ Admin Dashboard
      </motion.h1>

      {/* === Tombol Navigasi CRUD === */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col items-center justify-center text-gray-300 mt-10"
      >
        <p className="text-lg">Welcome back, Dimas!</p>
        <p className="text-sm mt-2 text-gray-400">
          You can manage your portfolio content here.
        </p>

        <div className="mt-12 w-full max-w-3xl grid grid-cols-1 sm:grid-cols-3 gap-6">
          {sections.map((section) => (
            <motion.div
              key={section.name}
              whileHover={{ scale: 1.05 }}
              onClick={() => router.push(section.path)}
              className="bg-[rgba(20,30,50,0.6)] backdrop-blur-md border border-cyan-400/30
                         shadow-[0_0_20px_rgba(0,255,255,0.2)] rounded-xl p-6 text-center cursor-pointer
                         hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(0,255,255,0.4)] transition-all"
            >
              <h3 className="text-cyan-300 font-semibold mb-2">{section.name}</h3>
              <p className="text-sm text-gray-400">
                Manage your {section.name.toLowerCase()} content
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
