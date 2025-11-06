'use client'

import Image from 'next/image'

export default function CVSection() {
  const timeline = [
    { year: '2025', title: 'Information Technology Graduate', place: 'Telkom University (Telu)', desc: 'Focused on system and web development with specialization in UI/UX design' },
    { year: '2023', title: 'Assistant Professor', place: 'Database Laboratory - Telu', desc: 'Assisting lecturers in teaching students about databases.' },
    { year: '2024', title: 'Front-end Web Developer (Intern)', place: 'PT. Angkasa Pura Aviasi', desc: 'Built responsive web apps using PHP for Warehouse Management.' },
    { year: '2024', title: 'Chatbot Developer (Intern)', place: 'PT. Telkom Regional 1 Sumatra', desc: 'Created an interactive Telegram bot for reporting network cable issues in Sumatra.' },
  ]

  const cvLink = 'https://raw.githubusercontent.com/dmsrli/portofolio-assets/main/Dimas_Riali_Resume.pdf'

  return (
    <section
      id="cv"
      className="relative min-h-screen bg-[rgba(10,20,35,0.35)] text-gray-200 
                 py-24 px-8 md:px-24 flex flex-col md:flex-row items-start justify-between"
    >
      {/* Left */}
      <div className="md:w-1/3 w-full flex flex-col items-center md:items-start mb-16 md:mb-0">
        <div className="relative w-48 h-48 mb-6">
          <Image
            src="/images/profile.png"
            alt="Profile Picture"
            fill
            className="rounded-full object-cover shadow-[0_0_25px_rgba(0,255,255,0.4)]"
          />
        </div>
        <h2 className="text-3xl font-bold text-accent-cyan drop-shadow-[0_0_15px_rgba(0,255,255,0.3)] text-center md:text-left">
          Muhammad Dimas Aulia Putra Riali
        </h2>
        <p className="text-gray-400 text-center md:text-left mt-2">
          Computer Engineering Graduate | Web Dev | UI/UX Designer
        </p>
        <a
          href={cvLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 px-8 py-3 rounded-full font-semibold text-white 
                     bg-linear-to-r from-cyan-500 via-blue-500 to-purple-500 
                     shadow-[0_0_20px_rgba(0,255,255,0.4)] hover:shadow-[0_0_35px_rgba(0,255,255,0.7)] 
                     hover:scale-105 transition-all duration-300 flex items-center gap-2"
        >
          📄 Download CV
        </a>
      </div>

      {/* Right */}
      <div className="relative md:w-2/3 w-full">
        <div className="space-y-10 pl-10">
          {timeline.map((item, idx) => (
            <div key={idx} className="relative">
              <h3 className="text-xl font-semibold text-accent-cyan">{item.title}</h3>
              <p className="text-sm text-gray-400">{item.place}</p>
              <span className="text-xs text-gray-500">{item.year}</span>
              <p className="text-gray-300 mt-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
