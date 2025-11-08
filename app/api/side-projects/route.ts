import { NextResponse } from 'next/server'
import { adminDb } from '../../../lib/firebaseAdmin'

export async function GET() {
  try {
    if (process.env.VERCEL === '1' && process.env.NODE_ENV === 'production') {
      console.log('🏗️ Using mock data for /api/side-projects during build')
      const mockData = [
        {
          id: 'mock-side-1',
          title: 'Mock Side Project',
          description: 'Dummy data during build process.',
          image: '/placeholder.jpg',
        },
      ]
      return NextResponse.json(mockData)
    }

    const snap = await adminDb.collection('side-projects').get()
    const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    return NextResponse.json(data)
  } catch (err) {
    console.error('🔥 Error fetching side projects:', err)
    return NextResponse.json({ error: 'Failed to fetch side projects' }, { status: 500 })
  }
}
