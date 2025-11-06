'use client'
import dynamic from 'next/dynamic'

const Background3DScene = dynamic(() => import('./Background3DScene'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-[#030b18]" />,
})

export default function Background3DWrapper() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        src="/videos/neuron-bg.mp4"
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      />
      <Background3DScene />
    </div>
  )
}
