"use client";

import { usePathname } from "next/navigation";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import BackgroundVideo from "./components/BackgroundVideo";
import BackgroundMusic from "./components/BackgroundMusic";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) return <>{children}</>;

  return (
    <>
      {/* ✅ Background fixed (optimized for mobile) */}
      {isHome && (
        <div className="fixed inset-0 -z-50 pointer-events-none">
          <div className="absolute inset-0">
            <BackgroundVideo />
          </div>

          {/* ✅ Stronger blur for mobile */}
          <div className="absolute inset-0 bg-[rgba(10,20,35,0.3)] backdrop-blur-lg sm:backdrop-blur-xl" />
        </div>
      )}

      {/* ✅ Background music (perbaikan autoplay iOS) */}
      {isHome && <BackgroundMusic />}

      <div className="relative flex flex-col min-h-screen z-10">

        {/* ✅ Navbar hanya di home */}
        {isHome && <Navbar />}

        {/* ✅ Global responsive wrapper */}
        <main className="
          flex-1 w-full flex flex-col items-center justify-start
          px-4 sm:px-6 md:px-8
        ">
          <div className="
            w-full 
            max-w-[1150px] 
            md:max-w-7xl
            py-6 sm:py-8 md:py-10
            space-y-10 sm:space-y-12 md:space-y-16
          ">
            {children}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
