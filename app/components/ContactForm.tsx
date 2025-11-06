'use client'

import { useState } from 'react'
import { toast, Toaster } from 'react-hot-toast'
import { FaInstagram, FaLinkedin, FaWhatsapp } from 'react-icons/fa'

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all fields.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      res.ok
        ? (toast.success('Message sent successfully!'),
          setForm({ name: '', email: '', message: '' }))
        : toast.error(data.error || 'Failed to send message.')
    } catch {
      toast.error('Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section
      id="contact"
      className="relative flex flex-col items-center justify-center min-h-[90vh]
                 bg-[rgba(10,20,35,0.35)] text-white px-6 py-20"
    >
      <Toaster position="top-center" />

      {/* Contact Card */}
      <div className="relative w-full max-w-lg rounded-2xl border border-cyan-400/20 
                      bg-[rgba(10,20,35,0.45)] backdrop-blur-md p-8 shadow-[0_0_20px_rgba(0,255,255,0.1)]">
        <h2 className="text-3xl font-bold mb-6 text-center text-accent-cyan 
                       drop-shadow-[0_0_10px_rgba(93,224,255,0.6)]">
          Contact Me 🎫
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="w-full px-4 py-3 rounded-lg bg-[#0e162a]/80 border border-accent-blue/40 
                       focus:ring-2 focus:ring-accent-cyan outline-none text-white placeholder-gray-400"
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Your Email"
            className="w-full px-4 py-3 rounded-lg bg-[#0e162a]/80 border border-accent-blue/40 
                       focus:ring-2 focus:ring-accent-cyan outline-none text-white placeholder-gray-400"
          />
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Your Message"
            rows={4}
            className="w-full px-4 py-3 rounded-lg bg-[#0e162a]/80 border border-accent-blue/40 
                       focus:ring-2 focus:ring-accent-cyan outline-none text-white placeholder-gray-400 resize-none"
          ></textarea>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 font-semibold rounded-full transition-all duration-300 flex justify-center items-center gap-2 ${
              loading
                ? 'bg-accent-blue/50 cursor-not-allowed'
                : 'bg-accent-blue hover:shadow-[0_0_20px_rgba(46,91,184,0.6)]'
            }`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Send Message ✉️'
            )}
          </button>
        </form>
      </div>

      {/* Social Links */}
      <div className="absolute bottom-6 left-6 flex gap-6 text-2xl text-gray-300">
        <a
          href="https://www.instagram.com/dmsriali"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-pink-500 transition"
        >
          <FaInstagram />
        </a>
        <a
          href="https://www.linkedin.com/in/dimasriali"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-500 transition"
        >
          <FaLinkedin />
        </a>
        <a
          href="https://wa.me/6283194593682"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-green-500 transition"
        >
          <FaWhatsapp />
        </a>
      </div>
    </section>
  )
}
