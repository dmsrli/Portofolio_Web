'use client'

import { Suspense } from 'react'
import WorksContent from './WorksContent'

export default function WorksPage() {
  return (
    <Suspense fallback={<div className="text-white text-center mt-20">Loading...</div>}>
      <WorksContent />
    </Suspense>
  )
}
