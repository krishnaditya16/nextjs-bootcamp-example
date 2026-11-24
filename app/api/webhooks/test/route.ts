import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const webhookSchema = z.object({
  event: z.enum(["order.paid", "order.expired"]),
  orderId: z.string().min(1, "orderId wajib diisi"),
})

export async function POST(request: NextRequest) {
  const token = request.headers.get("x-webhook-token")
  if (
    !token ||
    token !== (process.env.WEBHOOK_SECRET_TOKEN || "dev-webhook-token-123")
  ) {
    return NextResponse.json(
      { error: "Token webhook tidak valid" },
      { status: 401 }
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: "Payload bukan JSON valid" },
      { status: 400 }
    )
  }

  const parsed = webhookSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Payload tidak sesuai" },
      { status: 400 }
    )
  }

  return NextResponse.json(
    {
      received: true,
      status: "VERIFIED",
      event: parsed.data.event,
      orderId: parsed.data.orderId,
    },
    { status: 200 }
  )
}
