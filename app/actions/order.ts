"use server"

import { prisma } from "@/lib/db"
import { requireAdmin } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { z } from "zod"

export async function getAdminOrders() {
  await requireAdmin()
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      items: {
        include: {
          variant: {
            include: {
              product: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  })

  return orders.map((order) => ({
    id: order.id,
    status: order.status,
    totalAmount: Number(order.totalAmount),
    xenditInvoiceId: order.xenditInvoiceId,
    paymentUrl: order.paymentUrl,
    paymentMethod: order.paymentMethod,
    recipientName: order.recipientName || order.user?.name || "-",
    phone: order.phone || "-",
    shippingAddress: order.shippingAddress || "-",
    createdAt: order.createdAt.toISOString(),
    customerEmail: order.user?.email || "-",
    customerName: order.user?.name || "-",
    itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
  }))
}

export type AdminOrderItem = Awaited<ReturnType<typeof getAdminOrders>>[number]

export async function getAdminOrderById(id: string) {
  await requireAdmin()
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      items: {
        include: {
          variant: {
            include: {
              product: {
                include: {
                  images: true,
                },
              },
            },
          },
        },
      },
    },
  })

  if (!order) return null

  return {
    id: order.id,
    status: order.status,
    totalAmount: Number(order.totalAmount),
    xenditInvoiceId: order.xenditInvoiceId,
    paymentUrl: order.paymentUrl,
    paymentMethod: order.paymentMethod,
    recipientName: order.recipientName || order.user?.name || "-",
    phone: order.phone || "-",
    shippingAddress: order.shippingAddress || "-",
    createdAt: order.createdAt.toISOString(),
    customerEmail: order.user?.email || "-",
    customerName: order.user?.name || "-",
    items: order.items.map((item) => {
      const product = item.variant?.product
      const variantLabel =
        [item.variant?.size, item.variant?.color].filter(Boolean).join(" / ") ||
        item.variant?.sku ||
        "Standar"
      return {
        id: item.id,
        name: product?.name || "Produk",
        variant: variantLabel,
        quantity: item.quantity,
        price: Number(item.price),
        image: product?.images?.[0]?.url || "/placeholder/product.jpg",
      }
    }),
  }
}

const updateOrderSchema = z.object({
  orderId: z.string().min(1, "Order ID wajib diisi"),
  status: z.enum(["PENDING", "PAID", "CANCELLED"]),
  recipientName: z.string().trim().min(2, "Nama penerima minimal 2 karakter"),
  phone: z.string().trim().min(8, "Nomor telepon minimal 8 digit"),
  shippingAddress: z.string().trim().min(10, "Alamat pengiriman minimal 10 karakter"),
})

export async function updateAdminOrder(input: z.infer<typeof updateOrderSchema>) {
  await requireAdmin()

  const parsed = updateOrderSchema.safeParse(input)
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Data tidak valid",
    }
  }

  const { orderId, status, recipientName, phone, shippingAddress } = parsed.data

  try {
    await prisma.$transaction(async (tx) => {
      const existing = await tx.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      })

      if (!existing) {
        throw new Error("Pesanan tidak ditemukan")
      }

      const prevStatus = existing.status
      const nextStatus = status

      // Handle stock adjustments when status changes
      if (prevStatus !== "CANCELLED" && nextStatus === "CANCELLED") {
        // Restore stock when order is cancelled
        for (const item of existing.items) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { increment: item.quantity } },
          })
        }
      } else if (prevStatus === "CANCELLED" && nextStatus !== "CANCELLED") {
        // Decrement stock again if order is revived from CANCELLED
        for (const item of existing.items) {
          const variant = await tx.productVariant.findUnique({
            where: { id: item.variantId },
          })
          if (!variant || variant.stock < item.quantity) {
            throw new Error("Stok tidak mencukupi untuk mengaktifkan kembali pesanan")
          }
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { decrement: item.quantity } },
          })
        }
      }

      // Update order data
      await tx.order.update({
        where: { id: orderId },
        data: {
          status: nextStatus,
          recipientName,
          phone,
          shippingAddress,
        },
      })
    })

    revalidatePath("/admin/orders")
    revalidatePath(`/orders/${orderId}`)
    return { success: true, message: "Pesanan berhasil diperbarui" }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Gagal memperbarui pesanan",
    }
  }
}
