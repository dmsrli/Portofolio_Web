import { NextResponse } from 'next/server'
import { adminDb } from '../../../../lib/firebaseAdmin'

const COLLECTION = 'side-projects'

function normalizeData(body: any, isUpdate = false) {
  const data: Record<string, any> = { ...body }

  for (const key of ['image', 'audio']) {
    if (data[key] && typeof data[key] === 'object' && data[key].secure_url) {
      data[key] = data[key].secure_url
    }
  }

  if (!isUpdate) {
    data.favorite = data.favorite ?? false
    data.createdAt = data.createdAt || new Date().toISOString()
  }

  if (typeof data.title === 'string') data.title = data.title.trim()
  if (typeof data.description === 'string') data.description = data.description.trim()
  if (typeof data.link === 'string') data.link = data.link.trim()

  if (!data.title && !isUpdate) data.title = '(Untitled Side Project)'
  data.description = data.description || ''
  data.link = data.link || ''

  return data
}

// === 🟢 GET: Get all ===
export async function GET() {
  try {
    const snapshot = await adminDb.collection(COLLECTION).get()
    const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    return NextResponse.json(docs)
  } catch (err) {
    console.error(`GET ${COLLECTION} error:`, err)
    return NextResponse.json({ error: 'Failed to fetch side projects' }, { status: 500 })
  }
}

// === 🟡 POST: Add new ===
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = normalizeData(body, false)
    const ref = await adminDb.collection(COLLECTION).add(data)
    return NextResponse.json({ id: ref.id, success: true })
  } catch (err) {
    console.error(`POST ${COLLECTION} error:`, err)
    return NextResponse.json({ error: 'Failed to add side project' }, { status: 400 })
  }
}

// === 🟠 PATCH: Update ===
export async function PATCH(req: Request) {
  try {
    const { id, ...updates } = await req.json()
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    await adminDb.collection(COLLECTION).doc(id).update(normalizeData(updates, true))
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(`PATCH ${COLLECTION} error:`, err)
    return NextResponse.json({ error: 'Failed to update side project' }, { status: 500 })
  }
}

// === 🔴 DELETE: Delete ===
export async function DELETE(req: Request) {
  try {
    const id = new URL(req.url).searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    await adminDb.collection(COLLECTION).doc(id).delete()
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(`DELETE ${COLLECTION} error:`, err)
    return NextResponse.json({ error: 'Failed to delete side project' }, { status: 500 })
  }
}
