'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface AdminLoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AdminLoginModal({ isOpen, onClose }: AdminLoginModalProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    setError('')
    const res = await fetch('/api/admin-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    const data = await res.json()
    setLoading(false)
    if (data.success) {
      localStorage.setItem('isAdmin', 'true')
      window.location.href = '/admin'
    } else {
      setError('Incorrect password')
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999]"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            className="bg-[#101826] text-white p-8 rounded-2xl shadow-[0_0_25px_rgba(0,255,255,0.3)] w-96 relative"
          >
            <h2 className="text-xl font-semibold text-cyan-400 mb-4 text-center">
              🔐 Admin Login
            </h2>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full px-4 py-2 rounded-md bg-gray-900 text-white border border-cyan-400/40 mb-3 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
            <div className="flex justify-between mt-4">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleLogin}
                disabled={loading}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-all disabled:opacity-50"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
