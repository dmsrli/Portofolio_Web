'use client'

import { motion } from 'framer-motion'
import { FaInstagram, FaLinkedin, FaWhatsapp } from 'react-icons/fa'

export default function SocialLinks() {
  const socials = [
    { icon: <FaInstagram />, url: 'https://instagram.com/dimasrialii', color: '#E4405F' },
    { icon: <FaLinkedin />, url: 'https://linkedin.com/in/dimasrialii', color: '#0A66C2' },
    { icon: <FaWhatsapp />, url: 'https://wa.me/6283194593682', color: '#25D366' },
  ]

  return (
    <div className="absolute bottom-6 left-6 flex flex-col items-center gap-5 z-50">
      {/* Garis vertikal glowing */}
      <motion.div
        className="w-[2px] h-[100px] bg-gradient-to-b from-transparent via-cyan-400 to-transparent relative overflow-hidden rounded-full"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, repeatType: 'mirror' }}
      >
        <motion.div
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-cyan-300 to-transparent"
          animate={{ y: ['100%', '-100%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
      </motion.div>

      {/* Ikon sosial */}
      {socials.map((s, i) => (
        <motion.a
          key={i}
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          <motion.div
            className="p-3 rounded-full bg-black/40 backdrop-blur-md shadow-md"
            animate={{
              boxShadow: [
                `0 0 5px ${s.color}`,
                `0 0 20px ${s.color}`,
                `0 0 5px ${s.color}`,
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: 'mirror',
            }}
          >
            <div style={{ color: s.color }} className="text-2xl">
              {s.icon}
            </div>
          </motion.div>
        </motion.a>
      ))}
    </div>
  )
}
