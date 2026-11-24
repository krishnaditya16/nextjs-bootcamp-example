import { Suspense } from "react"
import type { Metadata } from "next"
import { OrdersClient } from "./orders-client"

export const metadata: Metadata = {
  title: "Daftar Pesanan",
  description: "Kelola pesanan pelanggan dan pantau status transaksi Xendit.",
}

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <OrdersClient />
    </Suspense>
  )
}
