"use server"

import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { createXenditInvoice } from "@/lib/xendit"

const checkoutSchema = z.object({
  recipientName: z.string().trim().min(2, "Nama penerima wajib diisi"),
  phone: z.string().trim().min(8, "Nomor telepon minimal 8 digit"),
  shippingAddress: z.string().trim().min(10, "Alamat pengiriman terlalu singkat"),
})

export type CheckoutInput = z.infer<typeof checkoutSchema>

export async function createCheckoutOrder(input: CheckoutInput) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user?.id) {
    return { success: false, error: "Silakan login terlebih dahulu" }
  }

  const parsed = checkoutSchema.safeParse(input)
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Data tidak valid",
    }
  }

  const userId = session.user.id
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            include: {
              variants: true,
            },
          },
          variant: true,
        },
      },
    },
  })

  if (!cart || cart.items.length === 0) {
    return { success: false, error: "Keranjang belanja masih kosong" }
  }

  try {
    const newOrder = await prisma.$transaction(async (tx) => {
      let totalAmount = 0
      const orderItemsData: Array<{
        variantId: string
        quantity: number
        price: number
      }> = []

      for (const item of cart.items) {
        const variantId = item.variantId ?? item.product.variants?.[0]?.id
        if (!variantId) {
          throw new Error(`Produk ${item.product.name} tidak memiliki varian aktif`)
        }

        const freshVariant = await tx.productVariant.findUnique({
          where: { id: variantId },
        })

        if (!freshVariant || freshVariant.stock < item.quantity) {
          throw new Error(`Stok ${item.product.name} tidak mencukupi`)
        }

        await tx.productVariant.update({
          where: { id: variantId },
          data: { stock: { decrement: item.quantity } },
        })

        const unitPrice = Number(freshVariant.price)
        totalAmount += unitPrice * item.quantity

        orderItemsData.push({
          variantId,
          quantity: item.quantity,
          price: unitPrice,
        })
      }

      const created = await tx.order.create({
        data: {
          userId,
          totalAmount,
          status: "PENDING",
          recipientName: parsed.data.recipientName,
          phone: parsed.data.phone,
          shippingAddress: parsed.data.shippingAddress,
          items: { create: orderItemsData },
        },
      })

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } })
      return created
    })

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ??
      process.env.BETTER_AUTH_URL ??
      "http://localhost:3000"

    const invoice = await createXenditInvoice({
      externalId: newOrder.id,
      amount: Number(newOrder.totalAmount),
      payerEmail: session.user.email,
      description: `Pembayaran Pesanan #${newOrder.id.slice(0, 8).toUpperCase()}`,
      successRedirectUrl: `${appUrl}/orders/${newOrder.id}`,
      failureRedirectUrl: `${appUrl}/orders/${newOrder.id}`,
    })

    await prisma.order.update({
      where: { id: newOrder.id },
      data: {
        xenditInvoiceId: invoice.id,
        paymentUrl: invoice.invoice_url,
      },
    })

    revalidatePath("/")
    revalidatePath("/checkout")
    revalidatePath("/admin/orders")
    revalidatePath(`/orders/${newOrder.id}`)

    return {
      success: true,
      orderId: newOrder.id,
      invoiceUrl: invoice.invoice_url,
    }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Gagal memproses checkout",
    }
  }
}
