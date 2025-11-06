'use client'

import { useState, ChangeEvent, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { uploadToCloudinary } from '../../../../lib/uploadToCloudinary'

export default function NewWork() {
  const router = useRouter()
  const [form, setForm] = useState({
    title: '',
    description: '',
    image: '',
    audio: '',
    repository: '',
  })
  const [loading, setLoading] = useState(false)

  const handleFile = async (e: ChangeEvent<HTMLInputElement>, field: 'image' | 'audio') => {
    const file = e.target.files?.[0]
    if (!file) return
    setLoading(true)
    try {
      const res = await uploadToCloudinary(file)
      setForm((prev) => ({ ...prev, [field]: res.secure_url }))
    } catch {
      alert('Upload failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/admin/works', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setLoading(false)
    if (res.ok) router.push('/admin/works')
    else alert('Failed to save work')
  }

  return (
    <div className="min-h-screen bg-[#0b1220] text-white px-8 py-12">
      <motion.button
        onClick={() => router.push('/admin/works')}
        whileHover={{ scale: 1.05 }}
        className="flex items-center gap-2 mb-8 bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2 rounded-lg hover:opacity-90"
      >
        <ArrowLeft size={18} /> Back
      </motion.button>

      <motion.h1 className="text-3xl font-bold text-cyan-400 mb-10">➕ New Work</motion.h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl bg-[#111a2d]/70 p-6 rounded-2xl border border-cyan-400/30 shadow-[0_0_20px_rgba(0,255,255,0.15)] space-y-6"
      >
        <Text label="Title" value={form.title} onChange={(v: string) => setForm({ ...form, title: v })} />
        <TextArea label="Description" value={form.description} onChange={(v: string) => setForm({ ...form, description: v })} />
        <FileUpload label="Upload Image" accept="image/*" field="image" form={form} handleFile={handleFile} />
        <FileUpload label="Upload Audio" accept="audio/*" field="audio" form={form} handleFile={handleFile} />
        <Text label="Repository Link" value={form.repository} onChange={(v: string) => setForm({ ...form, repository: v })} />
        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 rounded-lg hover:opacity-90 w-full"
        >
          {loading ? 'Uploading...' : 'Save Work'}
        </button>
      </form>
    </div>
  )
}

function Text({
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
        rows={4}
        className="w-full p-2 bg-[#111a2d] border border-cyan-700/30 rounded"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

function FileUpload({
  label,
  accept,
  field,
  form,
  handleFile,
}: {
  label: string
  accept: string
  field: 'image' | 'audio'
  form: Record<string, string>
  handleFile: (e: ChangeEvent<HTMLInputElement>, field: 'image' | 'audio') => void
}) {
  return (
    <div>
      <label className="text-sm text-gray-300 block mb-2">{label}</label>
      <input type="file" accept={accept} onChange={(e) => handleFile(e, field)} className="text-sm" />
      {form[field] && (
        <>
          {accept.includes('image') ? (
            <img src={form[field]} className="mt-3 w-40 h-28 rounded-lg object-cover border border-cyan-700/30" />
          ) : (
            <audio controls src={form[field]} className="mt-3 w-full" />
          )}
        </>
      )}
    </div>
  )
}
