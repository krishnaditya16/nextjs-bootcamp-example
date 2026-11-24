import { mkdir, unlink, writeFile } from "fs/promises"
import path from "path"
import crypto from "crypto"

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads")
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
}
const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2 MB

export async function saveUploadedImages(
  files: File[],
  folder: string = "products"
): Promise<string[]> {
  // Sanitize folder name to prevent path traversal
  const safeFolder = folder.replace(/[^a-zA-Z0-9_-]/g, "")
  const targetDir = path.join(UPLOAD_ROOT, safeFolder)
  await mkdir(targetDir, { recursive: true })
  const savedUrls: string[] = []

  for (const file of files) {
    const ext = ALLOWED_TYPES[file.type]
    if (!ext) {
      throw new Error(`Format file tidak didukung: ${file.type}. Gunakan JPG, PNG, atau WebP.`)
    }
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`Ukuran file "${file.name}" melebihi batas 2 MB.`)
    }

    const filename = `${crypto.randomUUID()}${ext}`
    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(path.join(targetDir, filename), buffer)
    savedUrls.push(`/uploads/${safeFolder}/${filename}`)
  }

  return savedUrls
}

export async function deleteLocalFile(relativeUrl: string) {
  if (!relativeUrl.startsWith("/uploads/")) return

  // Prevent path traversal by resolving against public directory
  const normalizedPath = path.normalize(relativeUrl).replace(/^(\.\.(\/|\\|$))+/, "")
  const fullPath = path.resolve(process.cwd(), "public", normalizedPath.replace(/^\/+/, ""))

  // Verify the target path stays inside UPLOAD_ROOT
  if (!fullPath.startsWith(UPLOAD_ROOT)) return

  try {
    await unlink(fullPath)
  } catch (err: unknown) {
    if (typeof err === "object" && err !== null && "code" in err && (err as { code: string }).code === "ENOENT") {
      return
    }
    console.error("Gagal menghapus file lokal:", err)
  }
}
