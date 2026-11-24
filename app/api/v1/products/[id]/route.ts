import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      variants: true,
      images: { orderBy: { order: "asc" } },
    },
  })

  if (!product) {
    return NextResponse.json(
      { error: "Produk tidak ditemukan" },
      { status: 404 }
    )
  }

  return NextResponse.json({ data: product }, { status: 200 })
}
