'use client'

import { useEffect, useState, ChangeEvent, FormEvent } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { uploadToCloudinary } from '../../../../lib/uploadToCloudinary'

interface SideProjectForm {
  title: string
  description: string
  image: string
  audio: string
  link: string
  favorite: boolean
}

export default function EditSideProject() {
  const router = useRouter()
  const { id } = useParams()
  const [form, setForm] = useState<SideProjectForm>({
    title: '',
    description: '',
    image: '',
    audio: '',
    link: '',
    favorite: false,
  })
  const [loading, setLoading] = useState(true)

  // 🔹 Fetch data
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/admin/side-projects?id=${id}`)
        const data = await res.json()
        setForm(data)
      } catch (err) {
        console.error('Failed to load side project:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  // ☁️ Upload file ke Cloudinary
  const handleFile = async (e: ChangeEvent<HTMLInputElement>, field: 'image' | 'audio') => {
    const file = e.target.files?.[0]
    if (!file) return
    const res = await uploadToCloudinary(file)
    setForm((f) => ({ ...f, [field]: res.secure_url }))
  }

  // 💾 Update
  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/admin/side-projects', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...form }),
    })
    if (res.ok) router.push('/admin/side-projects')
  }

  // ❌ Delete
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this side project?')) return
    await fetch(`/api/admin/side-projects?id=${id}`, { method: 'DELETE' })
    router.push('/admin/side-projects')
  }

  if (loading) return <p className="text-center mt-10 text-cyan-300">Loading...</p>

  return (
    <div className="min-h-screen bg-[#0b1220] text-white p-10">
      <Header title="Edit Side Project" onBack={() => router.push('/admin/side-projects')} onDelete={handleDelete} />

      <FormContent
        form={form}
        setForm={setForm}
        handleFile={handleFile}
        onSubmit={handleUpdate}
        buttonText="Update Side Project"
      />
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

function FormContent({
  form,
  setForm,
  handleFile,
  onSubmit,
  buttonText,
}: {
  form: SideProjectForm
  setForm: React.Dispatch<React.SetStateAction<SideProjectForm>>
  handleFile: (e: ChangeEvent<HTMLInputElement>, field: 'image' | 'audio') => void
  onSubmit: (e: FormEvent) => void
  buttonText: string
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="max-w-2xl mx-auto bg-[#111a2d]/70 border border-cyan-400/20 p-6 rounded-2xl space-y-5"
    >
      <Text label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
      <TextArea label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} />
      <Text label="Link" value={form.link} onChange={(v) => setForm({ ...form, link: v })} />

      <FileUpload label="Project Image" accept="image/*" field="image" value={form.image} handleFile={handleFile} />
      <FileUpload label="Audio File" accept="audio/*" field="audio" value={form.audio} handleFile={handleFile} />

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
        {buttonText}
      </motion.button>
    </form>
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

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-sm text-gray-300 block mb-2">{label}</label>
      <textarea
        rows={4}
        className="w-full p-2 bg-[#111a2d] border border-cyan-700/30 rounded focus:ring-1 focus:ring-cyan-500"
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
  value,
  handleFile,
}: {
  label: string
  accept: string
  field: 'image' | 'audio'
  value: string
  handleFile: (e: ChangeEvent<HTMLInputElement>, field: 'image' | 'audio') => void
}) {
  return (
    <div>
      <label className="text-sm text-gray-300 block mb-2">{label}</label>
      <input type="file" accept={accept} onChange={(e) => handleFile(e, field)} />
      {value && (
        <>
          {accept.includes('image') ? (
            <img src={value} alt="Preview" className="mt-3 w-40 h-28 rounded-lg object-cover" />
          ) : (
            <audio controls src={value} className="mt-3 w-full" />
          )}
        </>
      )}
    </div>
  )
}
