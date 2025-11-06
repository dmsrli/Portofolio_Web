'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PlusCircle, Edit, Trash2, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface SideProject {
  id: number
  title: string
  description: string
  image?: string
  audio?: string
  code?: string
}

export default function SideProjectsAdminPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<SideProject[]>([])

  useEffect(() => {
    fetch('/api/side-projects')
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch(() => console.error('Failed to fetch side projects'))
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return
    await fetch(`/api/admin/side-projects?id=${id}`, { method: 'DELETE' })
    setProjects((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div className="min-h-screen bg-[#0b1220] text-white px-8 py-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => router.push('/admin')}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2 rounded-lg hover:opacity-90 transition"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        <h1 className="text-3xl font-bold text-cyan-400">Side Projects</h1>

        <Link
          href="/admin/side-projects/new"
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 rounded-lg hover:opacity-90 transition"
        >
          <PlusCircle size={18} />
          Add New
        </Link>
      </div>

      {/* === Tabel CRUD === */}
      <div className="bg-[#111a2d] rounded-xl p-6 shadow-lg border border-cyan-700/30">
        {projects.length === 0 ? (
          <p className="text-gray-400 text-center py-10">No side projects yet.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-cyan-400 border-b border-cyan-700/40">
                <th className="py-3 px-2">ID</th>
                <th className="py-3 px-2">Title</th>
                <th className="py-3 px-2">Description</th>
                <th className="py-3 px-2">Image</th>
                <th className="py-3 px-2">Audio/Code</th>
                <th className="py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((item) => (
                <tr key={item.id} className="border-b border-cyan-700/20 hover:bg-cyan-900/10 transition">
                  <td className="py-3 px-2">{item.id}</td>
                  <td className="py-3 px-2 font-semibold">{item.title}</td>
                  <td className="py-3 px-2 text-gray-300">{item.description}</td>
                  <td className="py-3 px-2">
                    {item.image ? (
                      <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded-md" />
                    ) : (
                      <span className="text-gray-500 text-sm">No image</span>
                    )}
                  </td>
                  <td className="py-3 px-2">
                    {item.audio ? (
                      <audio controls src={item.audio} className="w-32" />
                    ) : item.code ? (
                      <code className="bg-cyan-900/30 px-2 py-1 rounded text-sm text-cyan-300">{item.code}</code>
                    ) : (
                      <span className="text-gray-500 text-sm">—</span>
                    )}
                  </td>
                  <td className="py-3 px-2 flex gap-3">
                    <Link
                      href={`/admin/side-projects/${item.id}`}
                      className="flex items-center gap-1 text-blue-400 hover:underline"
                    >
                      <Edit size={16} /> Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="flex items-center gap-1 text-red-400 hover:underline"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
