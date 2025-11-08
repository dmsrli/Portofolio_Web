import './styles/globals.css'
import type { Metadata } from 'next'
import ClientLayout from './ClientLayout'
import ClientChibiTrigger from './components/ClientChibiTrigger'
import GlobalAdminActivator from './components/GlobalAdminActivator'
import ViewportScaler from './components/ViewportScaler'

export const metadata: Metadata = {
  title: 'Dimas Portfolio',
  description: 'Portfolio - Dimas Riali',
  icons: {
    icon: '/favicon.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Meta viewport agar tidak auto-zoom di mobile */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </head>
      <body className="relative bg-transparent text-white overflow-x-hidden antialiased">
        {/* Adaptive scaling (non-destructive) */}
        <ViewportScaler />

        {/* Semua konten utama */}
        <ClientLayout>{children}</ClientLayout>

        {/* Hidden Admin Access */}
        <ClientChibiTrigger />
        <GlobalAdminActivator />
      </body>
    </html>
  )
}
