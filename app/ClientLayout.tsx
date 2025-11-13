"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import BackgroundVideo from "./components/BackgroundVideo";
import BackgroundMusic from "./components/BackgroundMusic";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    const el = document.getElementById("scaled-root");
    if (!el) return;

    const baseWidth = 1280;

    const applyScale = () => {
      const scale = Math.min(window.innerWidth / baseWidth, 1);
      el.style.transform = `scale(${scale})`;
    };

    applyScale();
    window.addEventListener("resize", applyScale);
    return () => window.removeEventListener("resize", applyScale);
  }, []);

  if (isAdmin) return <>{children}</>;

  return (
    <>
      {isHome && (
        <div className="fixed inset-0 -z-50">
          <BackgroundVideo />
          <div className="absolute inset-0 bg-[rgba(10,20,35,0.25)] backdrop-blur-[14px]" />
        </div>
      )}

      {isHome && <BackgroundMusic />}

      <div className="relative flex flex-col min-h-screen z-10">
        {isHome && <Navbar />}

        <main className="flex-1 w-full flex items-start justify-center overflow-hidden">
          <div
            id="scaled-root"
            className="origin-top"
            style={{
              width: "1280px",
              transform: "scale(1)",
              transition: "transform 0.25s ease-out",
            }}
          >
            {children}
          </div>
        </main>

        {isHome && <Footer />}
      </div>
    </>
  );
}
