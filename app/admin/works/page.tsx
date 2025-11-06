'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Edit, Trash2, Plus, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function AdminWorksPage() {
  const router = useRouter()
  const [works, setWorks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchWorks = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/works')
      if (!res.ok) throw new Error('Failed to fetch works')
      const data = await res.json()
      setWorks(data)
    } catch (err) {
      console.error(err)
      alert('Gagal memuat data Works.')
    } finally {
      setLoading(false)
    }
  }

  // 🔹 Hapus data dari Firestore
  const handleDelete = async (id: string) => {
    if (!confirm('Yakin mau hapus item ini?')) return
    try {
      await fetch(`/api/admin/works?id=${id}`, { method: 'DELETE' })
      fetchWorks()
    } catch (err) {
      console.error(err)
      alert('Gagal menghapus data.')
    }
  }

  useEffect(() => {
    fetchWorks()
  }, [])

  return (
    <div className="min-h-screen bg-[#0b1220] text-white px-8 py-10">
      {}
      <button
        onClick={() => router.push('/admin')}
        className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2 rounded-lg hover:opacity-90 transition mb-8"
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </button>

      {/* Header section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-cyan-400">Manage Works</h1>
        <Link
          href="/admin/works/new"
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 rounded-lg hover:opacity-90 transition"
        >
          <Plus size={18} /> Add New
        </Link>
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-gray-400">Loading data...</p>
      ) : works.length === 0 ? (
        <p className="text-gray-400">Belum ada data.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
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
              {works.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-cyan-700/20 hover:bg-cyan-900/10 transition"
                >
                  <td className="py-3 px-2">{item.id}</td>
                  <td className="py-3 px-2 font-semibold">{item.title}</td>
                  <td className="py-3 px-2 text-gray-300">{item.description}</td>
                  <td className="py-3 px-2">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    ) : (
                      <span className="text-gray-500 text-sm">No image</span>
                    )}
                  </td>
                  <td className="py-3 px-2">
                    {item.audio ? (
                      <audio controls src={item.audio} className="w-32" />
                    ) : item.code ? (
                      <code className="bg-cyan-900/30 px-2 py-1 rounded text-sm text-cyan-300">
                        {item.code}
                      </code>
                    ) : (
                      <span className="text-gray-500 text-sm">—</span>
                    )}
                  </td>
                  <td className="py-3 px-2 flex gap-3">
                    <Link
                      href={`/admin/works/${item.id}`}
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
        </div>
      )}
    </div>
  )
}
