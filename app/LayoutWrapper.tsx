'use client'

import { usePathname } from 'next/navigation'
import ClientLayout from './ClientLayout'

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAdminPage = pathname.startsWith('/admin')

  if (isAdminPage) {
    return <>{children}</>
  }

  return <ClientLayout>{children}</ClientLayout>
}
