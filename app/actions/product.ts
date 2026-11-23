"use server"

import { prisma } from "@/lib/db"
import { Prisma } from "@prisma/client"
import type { Product } from "@/data/products-data"

export interface GetProductsParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: "name" | "createdAt" | "updatedAt"
  sortOrder?: "asc" | "desc"
}

export interface PaginatedProductsResult {
  products: Product[]
  metadata: {
    total: number
    totalPages: number
    currentPage: number
    limit: number
  }
}

interface RawVariant {
  id: string
  sku: string
  size?: string | null
  color?: string | null
  price: number | string | { toString(): string }
  stock: number
  productId: string
}

interface RawImage {
  id: string
  url: string
  altText?: string | null
  order: number
  productId: string
  createdAt?: string | Date
}

interface RawProduct {
  id: string
  name: string
  slug: string
  description?: string | null
  isActive?: boolean
  categoryId?: string | null
  createdAt?: string | Date
  updatedAt?: string | Date
  category?: { id: string; name: string; slug: string } | null
  variants?: RawVariant[]
  images?: RawImage[]
}

function serializeProduct(product: RawProduct): Product {
  const serializedVariants = (product.variants || []).map((v: RawVariant) => ({
    id: v.id,
    sku: v.sku,
    size: v.size || "",
    color: v.color || "",
    price: Number(v.price),
    stock: v.stock,
    productId: v.productId,
  }))

  const serializedImages = (product.images || []).map((img: RawImage) => ({
    id: img.id,
    url: img.url,
    altText: img.altText,
    order: img.order,
    productId: img.productId,
    createdAt: img.createdAt ? new Date(img.createdAt).toISOString() : new Date().toISOString(),
  }))

  const basePrice = serializedVariants.length > 0 ? serializedVariants[0].price : 0

  return {
    id: product.id,
    name: product.name,
    title: product.name,
    slug: product.slug,
    description: product.description,
    isActive: product.isActive,
    createdAt: product.createdAt ? new Date(product.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: product.updatedAt ? new Date(product.updatedAt).toISOString() : new Date().toISOString(),
    categoryId: product.categoryId || undefined,
    category: product.category
      ? {
          id: product.category.id,
          name: product.category.name,
          slug: product.category.slug,
        }
      : null,
    categorySlug: product.category?.slug,
    price: basePrice,
    rating: 4.8,
    reviewsCount: 12,
    images: serializedImages,
    specs: [],
    variants: serializedVariants,
  }
}

export async function getProducts(): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        variants: {
          select: {
            id: true,
            sku: true,
            size: true,
            color: true,
            price: true,
            stock: true,
            productId: true,
          },
        },
        images: {
          orderBy: { order: "asc" },
          select: {
            id: true,
            url: true,
            altText: true,
            order: true,
            productId: true,
            createdAt: true,
          },
        },
      },
    })

    return products.map(serializeProduct)
  } catch (error) {
    console.error("Gagal mengambil data produk:", error)
    return []
  }
}

export async function getPaginatedProducts({
  page = 1,
  limit = 10,
  search = "",
  sortBy = "createdAt",
  sortOrder = "desc",
}: GetProductsParams = {}): Promise<PaginatedProductsResult> {
  try {
    // 1. Validasi parameter input untuk mencegah nilai negatif atau 0
    const safePage = Math.max(1, Number(page) || 1)
    const safeLimit = Math.max(1, Math.min(100, Number(limit) || 10))
    const skip = (safePage - 1) * safeLimit

    // 2. Susun filter pencarian jika kata kunci tersedia
    const where: Prisma.ProductWhereInput = search
      ? {
          OR: [
            { name: { contains: search } },
            { description: { contains: search } },
          ],
        }
      : {}

    // 3. Eksekusi query data dan hitungan total secara atomik dalam satu transaksi
    const [products, totalCount] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        skip,
        take: safeLimit,
        orderBy: {
          [sortBy]: sortOrder,
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          variants: {
            select: {
              id: true,
              sku: true,
              size: true,
              color: true,
              price: true,
              stock: true,
              productId: true,
            },
          },
          images: {
            orderBy: { order: "asc" },
            select: {
              id: true,
              url: true,
              altText: true,
              order: true,
              productId: true,
              createdAt: true,
            },
          },
        },
      }),
      prisma.product.count({ where }),
    ])

    // 4. Hitung total halaman yang tersedia
    const totalPages = Math.ceil(totalCount / safeLimit) || 1

    // 5. Serialisasi data sebelum dikirim ke browser client
    const serializedProducts = products.map(serializeProduct)

    return {
      products: serializedProducts,
      metadata: {
        total: totalCount,
        totalPages,
        currentPage: safePage,
        limit: safeLimit,
      },
    }
  } catch (error) {
    console.error("Gagal mengambil data produk terpaginasi:", error)
    return {
      products: [],
      metadata: {
        total: 0,
        totalPages: 1,
        currentPage: 1,
        limit: 10,
      },
    }
  }
}
