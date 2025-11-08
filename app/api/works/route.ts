import { NextResponse } from 'next/server'
import { adminDb } from '../../../lib/firebaseAdmin'

export async function GET() {
  try {
    if (process.env.VERCEL === '1' && process.env.NODE_ENV === 'production') {
      console.log('🏗️ Using mock data for /api/works during build')
      const mockData = [
        {
          id: 'mock-work-1',
          title: 'Mock Work Project',
          description: 'This is a placeholder used during build time.',
          image: '/placeholder.jpg',
        },
      ]
      return NextResponse.json(mockData)
    }

    const snap = await adminDb.collection('works').get()
    const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    return NextResponse.json(data)
  } catch (err) {
    console.error('🔥 Error fetching works:', err)
    return NextResponse.json({ error: 'Failed to fetch works' }, { status: 500 })
  }
}
