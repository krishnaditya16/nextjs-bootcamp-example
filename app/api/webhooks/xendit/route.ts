import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

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
      include: { items: true },
    })

    if (!order) {
      return NextResponse.json({ error: "Order tidak ditemukan" }, { status: 404 })
    }

    // Idempotency: hanya proses pesanan yang masih berstatus PENDING
    if (order.status !== "PENDING") {
      return NextResponse.json({ received: true, skipped: true })
    }

    if (status === "PAID" || status === "SETTLED") {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: "PAID",
          paymentMethod: payload.payment_method ?? payload.payment_channel ?? "XENDIT",
        },
      })
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
