import nodemailer from "nodemailer"
import { render } from "@react-email/render"
import { OrderConfirmationEmail } from "@/emails/order-confirmation"
import { PaymentReceiptEmail } from "@/emails/payment-receipt"

const port = Number(process.env.MAIL_PORT ?? 587)
const isConfigured = Boolean(
  process.env.MAIL_HOST &&
  process.env.MAIL_USER &&
  process.env.MAIL_PASSWORD &&
  process.env.MAIL_PASSWORD !== "dev-app-password" &&
  process.env.MAIL_PASSWORD !== "abcdefghijklmnop"
)

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || "smtp.gmail.com",
  port,
  secure: port === 465,
  auth: process.env.MAIL_USER
    ? {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      }
    : undefined,
})

function getFromHeader() {
  const name = process.env.MAIL_FROM_NAME ?? "TokoKita Store"
  const address = process.env.MAIL_FROM_ADDRESS ?? "noreply@tokokita.test"
  return `"${name}" <${address}>`
}

export async function sendOrderConfirmationEmail(params: {
  to: string
  recipientName: string
  orderId: string
  totalAmount: number
  invoiceUrl: string
  items: Array<{ name: string; quantity: number; price: number }>
}) {
  const html = await render(OrderConfirmationEmail(params))

  if (!isConfigured) {
    console.log(
      `[DEV MAIL MOCK] sendOrderConfirmationEmail triggered for ${params.to} (Order #${params.orderId.slice(0, 8).toUpperCase()})`
    )
    return
  }

  await transporter.sendMail({
    from: getFromHeader(),
    to: params.to,
    subject: `Konfirmasi Pesanan #${params.orderId.slice(0, 8).toUpperCase()}`,
    html,
  })
}

export async function sendPaymentReceiptEmail(params: {
  to: string
  recipientName: string
  orderId: string
  totalAmount: number
  paymentMethod: string
  orderUrl: string
  items: Array<{ name: string; quantity: number; price: number }>
}) {
  const html = await render(PaymentReceiptEmail(params))

  if (!isConfigured) {
    console.log(
      `[DEV MAIL MOCK] sendPaymentReceiptEmail triggered for ${params.to} (Order #${params.orderId.slice(0, 8).toUpperCase()}) - Status PAID`
    )
    return
  }

  await transporter.sendMail({
    from: getFromHeader(),
    to: params.to,
    subject: `Pembayaran Diterima #${params.orderId.slice(0, 8).toUpperCase()}`,
    html,
  })
}
