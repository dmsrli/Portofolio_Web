'use client'

import HeroSection from './components/HeroSection'
import ContactForm from './components/ContactForm'
import CVSection from './components/CVSection'
import WorksSection from './components/WorksSection'

export default function Home() {
  return (
    <>
      <HeroSection />
      <WorksSection />
      <CVSection />
      <ContactForm />
    </>
  )
}
