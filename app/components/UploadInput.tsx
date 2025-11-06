'use client'

import { useState } from 'react'

interface UploadInputProps {
  label: string
  onUploadComplete: (url: string) => void
  accept?: string
  initialUrl?: string
}

export default function UploadInput({
  label,
  onUploadComplete,
  accept = 'image/*',
  initialUrl,
}: UploadInputProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(initialUrl || null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)

      const formData = new FormData()
      formData.append('file', file)

      // Upload ke API Cloudinary
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) throw new Error('Upload failed')
      const data = await res.json()

      if (data.secure_url) {
        onUploadComplete(data.secure_url)
        setPreview(data.secure_url)
      }
    } catch (err) {
      console.error('Upload error:', err)
      alert('Upload gagal, coba lagi!')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm text-gray-300">{label}</label>

      <input
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="w-full text-sm text-gray-300 bg-[#111a2d] border border-cyan-700/30 p-2 rounded cursor-pointer"
        disabled={uploading}
      />

      {uploading && <p className="text-cyan-400 text-sm">Uploading...</p>}

      {preview && (
        <div className="mt-3">
          {accept.includes('audio') ? (
            <audio controls src={preview} className="w-56" />
          ) : (
            <img
              src={preview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded border border-gray-700"
            />
          )}
        </div>
      )}
    </div>
  )
}
