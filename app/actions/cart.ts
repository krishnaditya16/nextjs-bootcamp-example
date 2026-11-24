"use server"

import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export interface CartActionResponse {
  success: boolean
  requiresAuth?: boolean
  error?: string
}

async function getCurrentUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  return session?.user?.id ?? null
}

export async function getCart() {
  const userId = await getCurrentUserId()
  if (!userId) return { items: [], totalItems: 0, subtotal: 0 }

  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        orderBy: { createdAt: "desc" },
        include: {
          product: {
            include: { images: { orderBy: { order: "asc" }, take: 1 } },
          },
          variant: true,
        },
      },
    },
  })

  const items = (cart?.items ?? []).map((item) => ({
    ...item,
    variant: item.variant
      ? {
          ...item.variant,
          price: Number(item.variant.price),
        }
      : null,
  }))

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce((sum, item) => {
    const unitPrice = item.variant?.price ?? 0
    return sum + unitPrice * item.quantity
  }, 0)

  return { items, totalItems, subtotal }
}

export async function addToCart(input: {
  productId: string
  variantId?: string | null
  quantity?: number
}): Promise<CartActionResponse> {
  const userId = await getCurrentUserId()
  if (!userId) {
    return {
      success: false,
      requiresAuth: true,
      error: "Silakan login terlebih dahulu",
    }
  }

  const quantity = Math.max(1, input.quantity ?? 1)
  const variantId = input.variantId ?? null

  const product = await prisma.product.findUnique({
    where: { id: input.productId, isActive: true },
    include: { variants: true },
  })
  if (!product) return { success: false, error: "Produk tidak ditemukan" }

  const selectedVariant = variantId
    ? product.variants.find((v) => v.id === variantId)
    : product.variants[0] ?? null

  if (variantId && !selectedVariant) {
    return { success: false, error: "Varian produk tidak valid" }
  }

  if (selectedVariant && selectedVariant.stock < quantity) {
    return {
      success: false,
      error: `Stok tersisa hanya ${selectedVariant.stock}`,
    }
  }

  const cart = await prisma.cart.upsert({
    where: { userId },
    update: {},
    create: { userId },
  })

  const existingItem = await prisma.cartItem.findFirst({
    where: {
      cartId: cart.id,
      productId: product.id,
      variantId: selectedVariant?.id ?? variantId,
    },
  })

  const nextQty = (existingItem?.quantity ?? 0) + quantity
  if (selectedVariant && selectedVariant.stock < nextQty) {
    return {
      success: false,
      error: `Stok tersisa hanya ${selectedVariant.stock}`,
    }
  }

  if (existingItem) {
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: nextQty },
    })
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: product.id,
        variantId: selectedVariant?.id ?? variantId,
        quantity,
      },
    })
  }

  revalidatePath("/")
  return { success: true }
}

export async function updateCartItemQuantity(
  cartItemId: string,
  quantity: number
): Promise<CartActionResponse> {
  const userId = await getCurrentUserId()
  if (!userId) return { success: false, error: "Unauthorized" }

  const item = await prisma.cartItem.findFirst({
    where: { id: cartItemId, cart: { userId } },
    include: { variant: true },
  })
  if (!item) return { success: false, error: "Item keranjang tidak ditemukan" }

  if (quantity <= 0) {
    await prisma.cartItem.delete({ where: { id: item.id } })
    return { success: true }
  }

  if (item.variant && item.variant.stock < quantity) {
    return {
      success: false,
      error: `Stok tersisa hanya ${item.variant.stock}`,
    }
  }

  await prisma.cartItem.update({
    where: { id: item.id },
    data: { quantity },
  })

  return { success: true }
}

export async function removeCartItem(
  cartItemId: string
): Promise<CartActionResponse> {
  const userId = await getCurrentUserId()
  if (!userId) return { success: false, error: "Unauthorized" }

  await prisma.cartItem.deleteMany({
    where: { id: cartItemId, cart: { userId } },
  })

  return { success: true }
}

export async function clearCart(): Promise<CartActionResponse> {
  const userId = await getCurrentUserId()
  if (!userId) return { success: false, error: "Unauthorized" }

  const cart = await prisma.cart.findUnique({ where: { userId } })
  if (cart) {
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } })
  }

  return { success: true }
}
