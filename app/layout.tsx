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
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </head>
      <body className="relative bg-transparent text-white overflow-hidden antialiased">
        {/* Adaptive viewport scaling */}
        <ViewportScaler />

        <ClientLayout>{children}</ClientLayout>
        <ClientChibiTrigger />
        <GlobalAdminActivator />
      </body>
    </html>
  )
}
