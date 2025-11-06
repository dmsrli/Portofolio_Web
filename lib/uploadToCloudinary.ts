export async function uploadToCloudinary(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'unsigned_preset')
  formData.append('folder', process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER || 'portfolio')

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  if (!cloudName) throw new Error('❌ NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME belum diset di .env.local')

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
    method: 'POST',
    body: formData,
  })

  const text = await res.text()
  if (!res.ok) {
    console.error('Cloudinary Upload Error:', text)
    throw new Error(`Gagal upload ke Cloudinary: ${text}`)
  }

  return JSON.parse(text)
}
