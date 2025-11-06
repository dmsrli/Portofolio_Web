'use client'

import { useState, ChangeEvent, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { uploadToCloudinary } from '../../../../lib/uploadToCloudinary'

export default function NewSideProject() {
  const router = useRouter()
  const [form, setForm] = useState({
    title: '',
    description: '',
    image: '',
    audio: '',
    link: '',
    repository: '',
  })
  const [loading, setLoading] = useState(false)

  // 🧠 Upload ke Cloudinary
  const handleFile = async (e: ChangeEvent<HTMLInputElement>, field: 'image' | 'audio') => {
    const file = e.target.files?.[0]
    if (!file) return
    setLoading(true)
    try {
      const res = await uploadToCloudinary(file)
      setForm((f) => ({ ...f, [field]: res.secure_url }))
    } catch (err) {
      console.error('Upload failed:', err)
      alert('Upload failed, please try again.')
    } finally {
      setLoading(false)
    }
  }

  // 🧾 Submit ke Firestore Admin SDK
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/admin/side-projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setLoading(false)
    if (res.ok) {
      router.push('/admin/side-projects')
    } else {
      alert('❌ Failed to save project.')
    }
  }

  return (
    <div className="min-h-screen bg-[#0b1220] text-white p-10">
      <motion.button
        whileHover={{ scale: 1.05 }}
        onClick={() => router.push('/admin/side-projects')}
        className="flex items-center gap-2 mb-8 bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2 rounded-lg shadow-md hover:opacity-90 transition"
      >
        <ArrowLeft size={18} /> Back
      </motion.button>

      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl text-cyan-400 font-bold mb-8"
      >
        🚀 New Side Project
      </motion.h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl bg-[#111a2d]/70 border border-cyan-400/20 p-6 rounded-2xl shadow-[0_0_20px_rgba(0,255,255,0.15)] space-y-6"
      >
        <Text label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
        <TextArea label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} />
        <FileUpload
          label="Upload Project Image"
          accept="image/*"
          field="image"
          form={form}
          handleFile={handleFile}
        />
        <FileUpload
          label="Upload Project Audio (optional)"
          accept="audio/*"
          field="audio"
          form={form}
          handleFile={handleFile}
        />
        <Text label="Project Link" value={form.link} onChange={(v) => setForm({ ...form, link: v })} />
        <Text label="Repository (GitHub)" value={form.repository} onChange={(v) => setForm({ ...form, repository: v })} />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 rounded-lg hover:opacity-90 transition font-semibold"
        >
          {loading ? 'Uploading...' : 'Save Side Project'}
        </button>
      </form>
    </div>
  )
}

// 🧱 Subcomponents (typed)
function Text({
  label,
  value,
  onChange,
}: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-sm text-gray-300 block mb-2">{label}</label>
      <input
        className="w-full p-2 bg-[#111a2d] border border-cyan-700/30 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500"
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
        className="w-full p-2 bg-[#111a2d] border border-cyan-700/30 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500"
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
      <input
        type="file"
        accept={accept}
        onChange={(e) => handleFile(e, field)}
        className="text-sm"
      />
      {form[field] && (
        <>
          {accept.includes('image') ? (
            <img
              src={form[field]}
              alt="Preview"
              className="mt-3 w-40 h-28 rounded-lg object-cover border border-cyan-700/30"
            />
          ) : (
            <audio controls src={form[field]} className="mt-3 w-full" />
          )}
        </>
      )}
    </div>
  )
}
