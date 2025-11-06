'use client'

import { useEffect, useState, ChangeEvent, FormEvent } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { uploadToCloudinary } from '../../../../lib/uploadToCloudinary'

interface CertForm {
  title: string
  issuer: string
  certNumber: string
  issueDate: string
  expiryDate: string
  hasExpiry: boolean
  image: string
  favorite: boolean
}

export default function EditCertification() {
  const router = useRouter()
  const { id } = useParams()
  const [form, setForm] = useState<CertForm>({
    title: '',
    issuer: '',
    certNumber: '',
    issueDate: '',
    expiryDate: '',
    hasExpiry: false,
    image: '',
    favorite: false,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/admin/certifications?id=${id}`)
        const data = await res.json()
        setForm(data)
      } catch (err) {
        console.error('Failed to load certification:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const res = await uploadToCloudinary(file)
    setForm((f) => ({ ...f, image: res.secure_url }))
  }

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/admin/certifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...form }),
    })
    if (res.ok) router.push('/admin/certifications')
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this certification?')) return
    await fetch(`/api/admin/certifications?id=${id}`, { method: 'DELETE' })
    router.push('/admin/certifications')
  }

  if (loading) return <p className="text-center mt-10 text-cyan-300">Loading...</p>

  return (
    <div className="min-h-screen bg-[#0b1220] text-white p-10">
      <Header title="Edit Certification" onBack={() => router.push('/admin/certifications')} onDelete={handleDelete} />

      <form
        onSubmit={handleUpdate}
        className="max-w-2xl mx-auto bg-[#111a2d]/70 border border-cyan-400/20 p-6 rounded-2xl space-y-5"
      >
        <Text label="Certificate Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
        <Text label="Issuer / Organization" value={form.issuer} onChange={(v) => setForm({ ...form, issuer: v })} />
        <Text label="Certificate Number" value={form.certNumber} onChange={(v) => setForm({ ...form, certNumber: v })} />

        <div>
          <label className="text-sm text-gray-300 block mb-2">Issued Date</label>
          <input
            type="date"
            value={form.issueDate}
            onChange={(e) => setForm({ ...form, issueDate: e.target.value })}
            className="w-full p-2 bg-[#111a2d] border border-cyan-700/30 rounded"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.hasExpiry}
            onChange={(e) => setForm({ ...form, hasExpiry: e.target.checked })}
          />
          <label>Has expiration date</label>
        </div>

        {form.hasExpiry && (
          <div>
            <label className="text-sm text-gray-300 block mb-2">Expiry Date</label>
            <input
              type="date"
              value={form.expiryDate}
              onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
              className="w-full p-2 bg-[#111a2d] border border-cyan-700/30 rounded"
            />
          </div>
        )}

        <FileUpload label="Certificate Image" accept="image/*" value={form.image} handleFile={handleFile} />

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.favorite}
            onChange={(e) => setForm({ ...form, favorite: e.target.checked })}
          />
          <label>Mark as favorite</label>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          type="submit"
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 rounded-lg hover:opacity-90 transition font-semibold"
        >
          Update Certification
        </motion.button>
      </form>
    </div>
  )
}

function Header({ title, onBack, onDelete }: { title: string; onBack: () => void; onDelete: () => void }) {
  return (
    <div className="flex justify-between items-center mb-8 relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        onClick={onBack}
        className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 rounded-lg shadow-md"
      >
        <ArrowLeft size={18} /> Back
      </motion.button>

      <h1 className="text-2xl font-bold text-cyan-400 absolute left-1/2 -translate-x-1/2">{title}</h1>

      <motion.button
        whileHover={{ scale: 1.05 }}
        onClick={onDelete}
        className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded-lg shadow-md"
      >
        <Trash2 size={18} /> Delete
      </motion.button>
    </div>
  )
}

function Text({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-sm text-gray-300 block mb-2">{label}</label>
      <input
        className="w-full p-2 bg-[#111a2d] border border-cyan-700/30 rounded focus:ring-1 focus:ring-cyan-500"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

function FileUpload({
  label,
  accept,
  value,
  handleFile,
}: {
  label: string
  accept: string
  value: string
  handleFile: (e: ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <div>
      <label className="text-sm text-gray-300 block mb-2">{label}</label>
      <input type="file" accept={accept} onChange={handleFile} />
      {value && <img src={value} alt="Preview" className="mt-3 w-40 h-28 rounded-lg object-cover" />}
    </div>
  )
}
