export function validateFields(data: Record<string, any>, isUpdate = false) {
  const clean: Record<string, any> = {}

  for (const [key, val] of Object.entries(data)) {
    if (val === undefined || val === null) continue

    if (typeof val === 'object' && val?.secure_url) {
      clean[key] = String(val.secure_url).trim()
      continue
    }

    if (val instanceof File || val instanceof Blob) continue
    if (['string', 'boolean', 'number'].includes(typeof val)) {
      clean[key] = val
    }
  }

  if (!isUpdate) {
    clean.favorite = clean.favorite ?? false
    clean.createdAt = clean.createdAt ?? new Date().toISOString()

    if (!clean.title && data.title) clean.title = data.title
    if (!clean.description && data.description) clean.description = data.description
  }

  return clean
}
