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
      <body className="relative bg-transparent text-white overflow-x-hidden antialiased">
        {/* Adaptive viewport scaling */}
        <ViewportScaler />

        <ClientLayout>{children}</ClientLayout>

        {/* Hidden Admin Access */}
        <ClientChibiTrigger />
        <GlobalAdminActivator />
      </body>
    </html>
  )
}
