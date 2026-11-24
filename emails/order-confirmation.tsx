import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components"

export interface OrderItemSummary {
  name: string
  quantity: number
  price: number
}

export interface OrderConfirmationEmailProps {
  recipientName: string
  orderId: string
  totalAmount: number
  invoiceUrl: string
  items: OrderItemSummary[]
}

export function OrderConfirmationEmail({
  recipientName,
  orderId,
  totalAmount,
  invoiceUrl,
  items,
}: OrderConfirmationEmailProps) {
  const shortId = orderId.slice(0, 8).toUpperCase()

  return (
    <Html>
      <Head />
      <Preview>Pesanan #{shortId} berhasil dibuat — selesaikan pembayaranmu</Preview>
      <Tailwind>
        <Body className="bg-[#f6f9fc] font-sans">
          <Container className="bg-white mx-auto my-10 p-6 rounded-lg max-w-[520px] border border-[#e2e8f0]">
            <Heading className="text-[20px] font-semibold text-[#0f172a]">
              Pesanan #{shortId} Menunggu Pembayaran
            </Heading>
            <Text className="text-[14px] text-[#334155]">
              Halo {recipientName}, terima kasih sudah berbelanja di TokoKita. Berikut ringkasan pesananmu:
            </Text>
            <Section className="bg-[#f8fafc] p-4 rounded-md my-4">
              {items.map((item, idx) => (
                <Text key={idx} className="text-[13px] text-[#1e293b] my-1">
                  {item.name} &times; {item.quantity} — Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                </Text>
              ))}
              <Hr className="border-[#cbd5e1] my-3" />
              <Text className="text-[14px] font-bold text-[#0f172a] m-0">
                Total Tagihan: Rp {totalAmount.toLocaleString("id-ID")}
              </Text>
            </Section>
            <Section className="text-center my-6">
              <Button
                href={invoiceUrl}
                className="bg-[#0f172a] text-white text-[14px] font-semibold px-6 py-3 rounded-md no-underline inline-block"
              >
                Bayar Sekarang via Xendit
              </Button>
            </Section>
            <Text className="text-[12px] text-[#64748b] text-center mt-6">
              Jika tombol di atas tidak berfungsi, buka tautan berikut:
              <br />
              <span className="text-[#0284c7] break-all">{invoiceUrl}</span>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

export default OrderConfirmationEmail
