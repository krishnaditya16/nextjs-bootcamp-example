import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/db"

const createApiProductSchema = z.object({
  name: z.string().trim().min(2, "Nama produk minimal 2 karakter"),
  slug: z.string().trim().min(2, "Slug minimal 2 karakter"),
  description: z.string().optional(),
  categoryId: z.string().optional(),
})

export async function GET(request: NextRequest) {
  const pageParam = Number(request.nextUrl.searchParams.get("page") || "1")
  const limitParam = Number(request.nextUrl.searchParams.get("limit") || "10")

  const page =
    Number.isFinite(pageParam) && pageParam > 0 ? Math.floor(pageParam) : 1
  const limit =
    Number.isFinite(limitParam) && limitParam > 0
      ? Math.min(Math.floor(limitParam), 50)
      : 10
  const skip = (page - 1) * limit

  const [products, total] = await prisma.$transaction([
    prisma.product.findMany({
      where: { isActive: true },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        images: { orderBy: { order: "asc" }, take: 1 },
      },
    }),
    prisma.product.count({ where: { isActive: true } }),
  ])

  return NextResponse.json(
    {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    },
    { status: 200 }
  )
}

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: "Body JSON tidak valid" },
      { status: 400 }
    )
  }

  const parsed = createApiProductSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Validasi gagal" },
      { status: 400 }
    )
  }

  try {
    const product = await prisma.product.create({
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        description: parsed.data.description || null,
        categoryId: parsed.data.categoryId || null,
      },
    })

    return NextResponse.json({ data: product }, { status: 201 })
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Slug produk sudah digunakan" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Gagal membuat produk" },
      { status: 500 }
    )
  }
}
