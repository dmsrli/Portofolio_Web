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
        <div className="fixed inset-0 -z-50">
          <BackgroundVideo />
          <div className="absolute inset-0 mobile-blur" />
        </div>
      )}

      {isHome && <BackgroundMusic />}

      <div className="relative flex flex-col min-h-screen z-10">

        {isHome && <Navbar />}

        <main className="flex-1 w-full flex justify-center">
          <div className="w-full max-w-[1200px] px-4 md:px-6 lg:px-8 py-10 space-y-16">
            {children}
          </div>
        </main>

        {isHome && <Footer />}
      </div>
    </>
  );
}
