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

      {isHome && (
        <div className="fixed inset-0 -z-50 pointer-events-none">
          <BackgroundVideo />
          <div className="absolute inset-0 bg-[rgba(10,20,35,0.3)] backdrop-blur-lg sm:backdrop-blur-xl" />
        </div>
      )}

      {isHome && <BackgroundMusic />}

      <div className="relative flex flex-col min-h-screen z-10">

        {isHome && <Navbar />}

        {/* Global responsive wrapper */}
        <main className="
          flex-1 w-full flex flex-col items-center
          px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12
        ">
          <div className="
            w-full 
            max-w-[1100px]        /* Responsive global width */
            space-y-14 
            py-10
            md:space-y-20
            md:py-14
            lg:space-y-24
            lg:py-16
          ">
            {children}
          </div>
        </main>

        {isHome && <Footer />}
      </div>
    </>
  );
}
