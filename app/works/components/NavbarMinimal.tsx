'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function NavbarMinimal() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 w-full z-50 bg-black/20 backdrop-blur-md border-b border-white/10"
    >
      <div className="flex items-center justify-between px-10 py-3">
        <Link
          href="/"
          className="text-cyan-300 hover:text-white transition text-lg font-semibold"
        >
          ← Home
        </Link>
        <span className="text-gray-400 text-sm italic">Workspace Mode</span>
      </div>
    </motion.nav>
  )
}
