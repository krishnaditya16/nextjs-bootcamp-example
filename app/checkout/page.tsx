import type { Metadata } from "next"
import { Navbar } from "@/components/storefront/navbar"
import { Footer } from "@/components/storefront/footer"
import { CheckoutForm } from "./checkout-form"

export const metadata: Metadata = {
  title: "Checkout Pembelian - Tokokita",
  description: "Selesaikan transaksi pembelian dengan aman via Xendit Payment Gateway.",
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        <CheckoutForm />
      </main>
      <Footer />
    </div>
  )
}
