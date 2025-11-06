'use client'

import { useState, ChangeEvent, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { uploadToCloudinary } from '../../../../lib/uploadToCloudinary'

export default function NewCertification() {
  const router = useRouter()
  const [form, setForm] = useState({
    title: '',
    description: '',
    issuer: '',
    certNumber: '',
    issueDate: '',
    expiryDate: '',
    hasExpiry: false,
    image: '',
  })
  const [loading, setLoading] = useState(false)

  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLoading(true)
    try {
      const res = await uploadToCloudinary(file)
      setForm((f) => ({ ...f, image: res.secure_url }))
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/admin/certifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) router.push('/admin/certifications')
    else alert('Failed to save certification')
  }

  return (
    <div className="min-h-screen bg-[#0b1220] text-white p-10">
      <motion.button
        whileHover={{ scale: 1.05 }}
        onClick={() => router.push('/admin/certifications')}
        className="flex items-center gap-2 mb-8 bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2 rounded-lg"
      >
        <ArrowLeft size={18} /> Back
      </motion.button>

      <h1 className="text-3xl text-cyan-400 font-bold mb-8">🏅 New Certification</h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl bg-[#111a2d]/70 border border-cyan-400/20 p-6 rounded-xl space-y-6"
      >
        <Input label="Title" value={form.title} onChange={(v: string) => setForm({ ...form, title: v })} />
        <Input label="Issuer" value={form.issuer} onChange={(v: string) => setForm({ ...form, issuer: v })} />
        <Input label="Certificate Number" value={form.certNumber} onChange={(v: string) => setForm({ ...form, certNumber: v })} />
        <TextArea label="Description" value={form.description} onChange={(v: string) => setForm({ ...form, description: v })} />

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.hasExpiry}
            onChange={(e) => setForm({ ...form, hasExpiry: e.target.checked })}
          />
          <span className="text-sm text-gray-300">Has Expiration Date?</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <DateInput label="Issue Date" value={form.issueDate} onChange={(v: string) => setForm({ ...form, issueDate: v })} />
          {form.hasExpiry && (
            <DateInput label="Expiry Date" value={form.expiryDate} onChange={(v: string) => setForm({ ...form, expiryDate: v })} />
          )}
        </div>

        <FileUpload label="Upload Certificate Image" onChange={handleFile} value={form.image} />

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 rounded-lg hover:opacity-90"
        >
          {loading ? 'Uploading...' : 'Save Certification'}
        </button>
      </form>
    </div>
  )
}

function Input({
  label,
  value,
  onChange,
}: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-sm text-gray-300 block mb-2">{label}</label>
      <input
        className="w-full p-2 bg-[#111a2d] border border-cyan-700/30 rounded"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

function TextArea({
  label,
  value,
  onChange,
}: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-sm text-gray-300 block mb-2">{label}</label>
      <textarea
        rows={3}
        className="w-full p-2 bg-[#111a2d] border border-cyan-700/30 rounded"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

function DateInput({
  label,
  value,
  onChange,
}: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-sm text-gray-300 block mb-2">{label}</label>
      <input
        type="date"
        className="w-full p-2 bg-[#111a2d] border border-cyan-700/30 rounded"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

function FileUpload({
  label,
  onChange,
  value,
}: { label: string; onChange: (e: ChangeEvent<HTMLInputElement>) => void; value: string }) {
  return (
    <div>
      <label className="text-sm text-gray-300 block mb-2">{label}</label>
      <input type="file" accept="image/*" onChange={onChange} className="text-sm" />
      {value && <img src={value} className="mt-3 w-40 h-28 rounded-lg object-cover border border-cyan-700/30" />}
    </div>
  )
}
