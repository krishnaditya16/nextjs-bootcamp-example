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

export interface PaymentReceiptEmailProps {
  recipientName: string
  orderId: string
  totalAmount: number
  paymentMethod: string
  orderUrl: string
  items: OrderItemSummary[]
}

export function PaymentReceiptEmail({
  recipientName,
  orderId,
  totalAmount,
  paymentMethod,
  orderUrl,
  items,
}: PaymentReceiptEmailProps) {
  const shortId = orderId.slice(0, 8).toUpperCase()

  return (
    <Html>
      <Head />
      <Preview>Pembayaran pesanan #{shortId} berhasil diverifikasi</Preview>
      <Tailwind>
        <Body className="bg-[#f6f9fc] font-sans">
          <Container className="bg-white mx-auto my-10 p-6 rounded-lg max-w-[520px] border border-[#e2e8f0]">
            <Heading className="text-[20px] font-semibold text-[#0f172a]">
              Bukti Pembayaran Lunas #{shortId}
            </Heading>
            <Text className="text-[14px] text-[#334155]">
              Halo {recipientName}, pembayaran untuk pesananmu telah berhasil diverifikasi oleh sistem Xendit.
            </Text>
            <Section className="bg-[#f0fdf4] border border-[#bbf7d0] p-4 rounded-md my-4">
              <Text className="text-[13px] text-[#166534] font-semibold m-0">
                Status: Pembayaran Lunas (PAID)
              </Text>
              <Text className="text-[13px] text-[#166534] mt-1 m-0">
                Metode: {paymentMethod || "Xendit Invoice"}
              </Text>
            </Section>
            <Section className="bg-[#f8fafc] p-4 rounded-md my-4">
              {items.map((item, idx) => (
                <Text key={idx} className="text-[13px] text-[#1e293b] my-1">
                  {item.name} &times; {item.quantity} — Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                </Text>
              ))}
              <Hr className="border-[#cbd5e1] my-3" />
              <Text className="text-[14px] font-bold text-[#0f172a] m-0">
                Total Dibayar: Rp {totalAmount.toLocaleString("id-ID")}
              </Text>
            </Section>
            <Section className="text-center my-6">
              <Button
                href={orderUrl}
                className="bg-[#0f172a] text-white text-[14px] font-semibold px-6 py-3 rounded-md no-underline inline-block"
              >
                Lihat Detail Pesanan
              </Button>
            </Section>
            <Text className="text-[12px] text-[#64748b] text-center mt-6">
              Simpan bukti email ini sebagai tanda terima transaksi resmi di TokoKita.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

export default PaymentReceiptEmail
