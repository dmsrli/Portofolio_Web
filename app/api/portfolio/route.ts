import { db } from '../../../lib/firebase'
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore'

export async function GET() {
  const snapshot = await getDocs(collection(db, 'works'))
const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() as Record<string, any> }))

  return Response.json(data)
}

export async function POST(req: Request) {
  const body = await req.json()
  await addDoc(collection(db, 'works'), body)
  return Response.json({ message: 'Work item added successfully' })
}

export async function PUT(req: Request) {
  const body = await req.json()
  const { id, ...updateData } = body
  await updateDoc(doc(db, 'works', id), updateData)
  return Response.json({ message: 'Work updated successfully' })
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (id) await deleteDoc(doc(db, 'works', id))
  return Response.json({ message: 'Work deleted successfully' })
}
