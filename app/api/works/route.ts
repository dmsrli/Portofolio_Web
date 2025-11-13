import { NextResponse } from 'next/server'
import { adminDb } from '../../../lib/firebaseAdmin'

export async function GET() {
  try {
    const snap = await adminDb.collection('works').get()
    const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    return NextResponse.json(data)
  } catch (err) {
    console.error('🔥 Error fetching works:', err)
    return NextResponse.json({ error: 'Failed to fetch works' }, { status: 500 })
  }
}
