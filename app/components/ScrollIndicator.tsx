'use client'

import { motion } from 'framer-motion'

export default function ScrollIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
      className="flex flex-col items-center"
    >
      <div className="text-gray-400 text-sm mb-2">Scroll Down</div>
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="w-1.5 h-1.5 rounded-full bg-accent-cyan shadow-[0_0_10px_rgba(93,224,255,0.6)]"
      />
    </motion.div>
  )
}
