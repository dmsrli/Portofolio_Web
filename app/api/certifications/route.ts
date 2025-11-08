import { NextResponse } from 'next/server'
import { adminDb } from '../../../lib/firebaseAdmin'

export async function GET() {
  try {
    if (process.env.VERCEL === '1' && process.env.NODE_ENV === 'production') {
      console.log('🏗️ Using mock data for /api/certifications during build')
      const mockData = [
        {
          id: 'mock-cert-1',
          title: 'Mock Certification',
          description: 'Temporary data used at build time.',
          image: '/placeholder.jpg',
        },
      ]
      return NextResponse.json(mockData)
    }

    const snap = await adminDb.collection('certifications').get()
    const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    return NextResponse.json(data)
  } catch (err) {
    console.error('🔥 Error fetching certifications:', err)
    return NextResponse.json({ error: 'Failed to fetch certifications' }, { status: 500 })
  }
}
