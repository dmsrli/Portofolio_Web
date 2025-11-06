'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

export default function NotFoundPage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#030712] text-white">
      {/* === Background Gradient === */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-[#071224] to-[#081b33]" />

      {/* === Animated Glow Layer === */}
      <motion.div
        className="absolute inset-0 opacity-70"
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          opacity: [0.6, 0.9, 0.6],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(0,255,255,0.08) 0%, transparent 70%),
            radial-gradient(circle at 80% 70%, rgba(0,160,255,0.05) 0%, transparent 70%)
          `,
          backgroundSize: '200% 200%',
        }}
      />

      {/* === Floating Particles === */}
      {[...Array(25)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-cyan-400/10 blur-[3px]"
          style={{
            width: Math.random() * 3 + 2,
            height: Math.random() * 3 + 2,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -10, 0],
            opacity: [0.2, 0.7, 0.2],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* === Glowing 404 Text === */}
      <motion.h1
        className="text-[8rem] sm:text-[10rem] font-extrabold text-cyan-400 drop-shadow-[0_0_30px_rgba(0,255,255,0.4)] select-none z-10"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      >
        404
      </motion.h1>

      {/* === Subtitle === */}
      <motion.p
        className="text-gray-300 text-lg sm:text-xl mt-2 text-center max-w-md z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        Oops! The page you’re looking for seems to have wandered into the void.
      </motion.p>

      {/* === Home Button === */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="mt-8 z-10"
      >
        <Link
          href="/"
          className="px-6 py-3 text-lg rounded-xl border border-cyan-400/40 text-cyan-300 
          hover:text-cyan-100 hover:border-cyan-300 transition-all duration-300
          shadow-[0_0_15px_rgba(0,255,255,0.2)] hover:shadow-[0_0_25px_rgba(0,255,255,0.4)]"
        >
          ⬅ Back to Home
        </Link>
      </motion.div>

      {/* === Chibi Admin Easter Egg === */}
      <motion.div
        className="absolute bottom-6 right-8 flex flex-col items-center z-20"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <motion.div
          animate={{ y: [0, -8, 0], rotate: [0, 3, -3, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="relative"
        >
          <Image
            src="/images/chibi-admin.png"
            alt="Confused Chibi Admin"
            width={90}
            height={90}
            className="drop-shadow-[0_0_20px_rgba(0,255,255,0.3)] rounded-full"
          />
        </motion.div>
        <motion.span
          className="mt-3 text-cyan-300/80 text-sm italic"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          “Uh... where am I?”
        </motion.span>
      </motion.div>
    </main>
  )
}
