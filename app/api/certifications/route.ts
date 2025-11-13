import { NextResponse } from 'next/server'
import { adminDb } from '../../../lib/firebaseAdmin'

export async function GET() {
  try {
    const snap = await adminDb.collection('certifications').get()
    const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    return NextResponse.json(data)
  } catch (err) {
    console.error('🔥 Error fetching certifications:', err)
    return NextResponse.json({ error: 'Failed to fetch certifications' }, { status: 500 })
  }
}
