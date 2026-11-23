"use server"

import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { categorySchema, type CategoryFormValues } from "@/lib/schemas/category"

async function requireAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!session || (session.user as any)?.role !== "admin") {
    throw new Error("Akses ditolak. Hanya admin yang diizinkan.")
  }
}

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { products: true },
      },
    },
  })
}

export async function getCategoryById(id: string) {
  return prisma.category.findUnique({
    where: { id },
  })
}

export async function createCategory(values: CategoryFormValues) {
  await requireAdmin()

  const parsed = categorySchema.safeParse(values)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Data tidak valid" }
  }

  try {
    const category = await prisma.category.create({
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        description: parsed.data.description || null,
        isActive: parsed.data.isActive,
      },
    })

    revalidatePath("/admin/categories")
    return { data: category }
  } catch (err: unknown) {
    if (typeof err === "object" && err !== null && "code" in err && (err as { code: string }).code === "P2002") {
      return { error: "Nama atau slug kategori sudah digunakan." }
    }
    return { error: "Gagal membuat kategori baru." }
  }
}

export async function updateCategory(id: string, values: CategoryFormValues) {
  await requireAdmin()

  const parsed = categorySchema.safeParse(values)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Data tidak valid" }
  }

  try {
    const category = await prisma.category.update({
      where: { id },
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        description: parsed.data.description || null,
        isActive: parsed.data.isActive,
      },
    })

    revalidatePath("/admin/categories")
    revalidatePath(`/admin/categories/${id}/edit`)
    return { data: category }
  } catch (err: unknown) {
    if (typeof err === "object" && err !== null && "code" in err && (err as { code: string }).code === "P2002") {
      return { error: "Nama atau slug kategori sudah digunakan." }
    }
    return { error: "Gagal memperbarui kategori." }
  }
}

export async function deleteCategory(id: string) {
  await requireAdmin()

  try {
    await prisma.category.delete({
      where: { id },
    })

    revalidatePath("/admin/categories")
    return { success: true }
  } catch {
    return { error: "Gagal menghapus kategori. Pastikan tidak ada produk terkait." }
  }
}
