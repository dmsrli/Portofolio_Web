'use client'

import { useState } from 'react'

export default function AdminTable({ data, refresh }: any) {
  const [category, setCategory] = useState<'main' | 'side' | 'cert'>('main')
  const [newItem, setNewItem] = useState({ title: '', type: 'image', src: '' })

  const handleAdd = async () => {
    await fetch('/api/works', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category, item: newItem }),
    })
    setNewItem({ title: '', type: 'image', src: '' })
    refresh()
  }

  const handleDelete = async (id: number) => {
    await fetch('/api/works', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category, id }),
    })
    refresh()
  }

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as any)}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg"
        >
          <option value="main">Main Portfolio</option>
          <option value="side">Side Projects</option>
          <option value="cert">Certifications</option>
        </select>

        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg text-white font-semibold"
        >
          + Add
        </button>
      </div>

      <div className="space-y-3">
        {data[category].map((item: any) => (
          <div
            key={item.id}
            className="flex justify-between items-center bg-gray-900/50 px-4 py-3 rounded-lg"
          >
            <div>
              <p className="font-semibold text-cyan-300">{item.title}</p>
              <p className="text-xs text-gray-400">{item.type}</p>
            </div>
            <button
              onClick={() => handleDelete(item.id)}
              className="text-red-400 hover:text-red-600 text-sm"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 border-t border-gray-700 pt-4">
        <input
          placeholder="Title"
          value={newItem.title}
          onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
          className="bg-gray-800 text-white px-3 py-2 rounded mr-2"
        />
        <select
          value={newItem.type}
          onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
          className="bg-gray-800 text-white px-3 py-2 rounded mr-2"
        >
          <option value="image">Image</option>
          <option value="video">Video</option>
          <option value="code">Code</option>
          <option value="audio">Audio</option>
        </select>
        <input
          placeholder="Source URL"
          value={newItem.src}
          onChange={(e) => setNewItem({ ...newItem, src: e.target.value })}
          className="bg-gray-800 text-white px-3 py-2 rounded mr-2 w-72"
        />
      </div>
    </div>
  )
}
