import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { sendPaymentReceiptEmail } from "@/lib/mail"

export async function POST(request: NextRequest) {
  const expectedToken = process.env.XENDIT_CALLBACK_TOKEN
  const incomingToken = request.headers.get("x-callback-token")

  if (!expectedToken || incomingToken !== expectedToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const payload = await request.json()
    const externalId = payload.external_id as string | undefined
    const status = payload.status as string | undefined

    if (!externalId || !status) {
      return NextResponse.json({ error: "Payload tidak lengkap" }, { status: 400 })
    }

    const order = await prisma.order.findUnique({
      where: { id: externalId },
      include: {
        user: { select: { email: true, name: true } },
        items: {
          include: {
            variant: {
              include: {
                product: { select: { name: true } },
              },
            },
          },
        },
      },
    })

    if (!order) {
      return NextResponse.json({ error: "Order tidak ditemukan" }, { status: 404 })
    }

    // Idempotency: hanya proses pesanan yang masih berstatus PENDING
    if (order.status !== "PENDING") {
      return NextResponse.json({ received: true, skipped: true })
    }

    if (status === "PAID" || status === "SETTLED") {
      const paymentMethod =
        payload.payment_method ?? payload.payment_channel ?? "XENDIT"

      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: "PAID",
          paymentMethod,
        },
      })

      const appUrl =
        process.env.NEXT_PUBLIC_APP_URL ||
        process.env.BETTER_AUTH_URL ||
        "http://localhost:3000"
      const recipientEmail = order.user?.email

      if (recipientEmail) {
        try {
          await sendPaymentReceiptEmail({
            to: recipientEmail,
            recipientName:
              order.recipientName || order.user?.name || "Pelanggan",
            orderId: order.id,
            totalAmount: Number(order.totalAmount),
            paymentMethod,
            orderUrl: `${appUrl}/orders/${order.id}`,
            items: order.items.map((item) => ({
              name: item.variant?.product?.name || "Produk",
              quantity: item.quantity,
              price: Number(item.price),
            })),
          })
        } catch (mailError) {
          console.error(
            "[MAIL] Failed to send payment receipt email:",
            mailError
          )
        }
      }
    } else if (status === "EXPIRED") {
      await prisma.$transaction(async (tx) => {
        await tx.order.update({
          where: { id: order.id },
          data: { status: "CANCELLED" },
        })

        for (const item of order.items) {
          if (item.variantId) {
            await tx.productVariant.update({
              where: { id: item.variantId },
              data: { stock: { increment: item.quantity } },
            })
          }
        }
      })
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error("Xendit webhook error:", err)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
