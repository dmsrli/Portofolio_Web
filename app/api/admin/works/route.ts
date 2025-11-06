import { NextResponse } from 'next/server'
import { adminDb } from '../../../../lib/firebaseAdmin'

const COLLECTION = 'works'

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

  if (!data.title && !isUpdate) data.title = '(Untitled Work)'
  if (!data.description) data.description = ''

  return data
}

// 🟢 GET
export async function GET() {
  try {
    const snapshot = await adminDb.collection(COLLECTION).get()
    const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    return NextResponse.json(docs)
  } catch (err) {
    console.error(`GET ${COLLECTION} error:`, err)
    return NextResponse.json({ error: 'Failed to fetch works' }, { status: 500 })
  }
}

// 🟡 POST
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = normalizeData(body, false)
    const ref = await adminDb.collection(COLLECTION).add(data)
    return NextResponse.json({ id: ref.id, success: true })
  } catch (err) {
    console.error(`POST ${COLLECTION} error:`, err)
    return NextResponse.json({ error: 'Failed to add work' }, { status: 400 })
  }
}

// 🟠 PATCH
export async function PATCH(req: Request) {
  try {
    const { id, ...updates } = await req.json()
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    await adminDb.collection(COLLECTION).doc(id).update(normalizeData(updates, true))
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(`PATCH ${COLLECTION} error:`, err)
    return NextResponse.json({ error: 'Failed to update work' }, { status: 500 })
  }
}

// 🔴 DELETE
export async function DELETE(req: Request) {
  try {
    const id = new URL(req.url).searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    await adminDb.collection(COLLECTION).doc(id).delete()
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(`DELETE ${COLLECTION} error:`, err)
    return NextResponse.json({ error: 'Failed to delete work' }, { status: 500 })
  }
}
