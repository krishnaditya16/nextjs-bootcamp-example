"use server"

import { prisma } from "@/lib/db"
import type { Product } from "@/data/products-data"

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

    return products.map((product) => {
      const serializedVariants = product.variants.map((v) => ({
        id: v.id,
        sku: v.sku,
        size: v.size,
        color: v.color,
        price: Number(v.price),
        stock: v.stock,
        productId: v.productId,
      }))

      const serializedImages = product.images.map((img) => ({
        id: img.id,
        url: img.url,
        altText: img.altText,
        order: img.order,
        productId: img.productId,
        createdAt: img.createdAt.toISOString(),
      }))

      const basePrice = serializedVariants.length > 0 ? serializedVariants[0].price : 0

      return {
        id: product.id,
        name: product.name,
        title: product.name,
        slug: product.slug,
        description: product.description,
        isActive: product.isActive,
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
        categoryId: product.categoryId,
        category: product.category,
        categorySlug: product.category?.slug,
        price: basePrice,
        rating: 4.8,
        reviewsCount: 12,
        images: serializedImages,
        specs: [],
        variants: serializedVariants,
      }
    })
  } catch (error) {
    console.error("Gagal mengambil data produk:", error)
    return []
  }
}
