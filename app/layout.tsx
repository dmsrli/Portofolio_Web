import './styles/globals.css'
import type { Metadata } from 'next'
import ClientLayout from './ClientLayout'
import ClientChibiTrigger from './components/ClientChibiTrigger'
import GlobalAdminActivator from './components/GlobalAdminActivator'

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
      <body className="text-white bg-transparent antialiased overflow-x-hidden">
        <ClientLayout>{children}</ClientLayout>
        <ClientChibiTrigger />
        <GlobalAdminActivator />
      </body>
    </html>
  )
}
