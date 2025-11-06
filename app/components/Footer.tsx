'use client'

export default function Footer() {
  return (
    <footer
      className="relative z-20 py-6 px-8 text-center
                 bg-[rgba(10,20,35,0.25)] text-cyan-300/80"
    >
      {/* === Credit kiri === */}
      <div className="absolute left-6 bottom-4 text-[11px] leading-tight text-cyan-300/60 text-left">
        <p>
          🎬 Video by{' '}
          <a
            href="https://id.pinterest.com/MiliMika12/"
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-cyan-200"
          >
            MiliMika
          </a>
        </p>
        <p>
          🎵 Audio by{' '}
          <a
            href="https://freetouse.com/music/hazelwood/coming-of-age"
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-cyan-200"
          >
            Hazelwood
          </a>
        </p>
      </div>

      {/* === Nama tengah === */}
      <p className="text-sm font-medium tracking-wide">
        © {new Date().getFullYear()} Dimas Riali
      </p>
    </footer>
  )
}
