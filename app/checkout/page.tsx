"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Navbar } from "@/components/storefront/navbar"
import { Footer } from "@/components/storefront/footer"
import { useCart } from "@/components/storefront/cart-context"
import { formatRupiah } from "@/data/products-data"

const SHIPPING_OPTIONS = [
  { id: "reg", name: "Reguler (2-3 hari kerja)", courier: "JNE / SiCepat", price: 25000 },
  { id: "exp", name: "Express (1 hari kerja)", courier: "SiCepat Best / JNE YES", price: 45000 },
  { id: "same", name: "Instant Same-Day", courier: "GoSend / GrabExpress", price: 65000 },
]

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, clearCart } = useCart()

  // Form states
  const [formData, setFormData] = useState({
    name: "Budi Santoso",
    email: "budi.santoso@example.com",
    phone: "081234567890",
    address: "Jl. Sudirman No. 45, Gedung Plaza Central Lt. 8",
    city: "Jakarta Selatan",
    postalCode: "12190",
    notes: "",
  })

  const [selectedShipping, setSelectedShipping] = useState<string>("reg")
  const [isProcessing, setIsProcessing] = useState(false)

  const shippingCost = SHIPPING_OPTIONS.find((s) => s.id === selectedShipping)?.price || 25000
  const grandTotal = subtotal + shippingCost

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Simulate payment redirect
  const handlePaymentRedirect = (status: "success" | "failed") => {
    setIsProcessing(true)
    const orderId = `TK-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`

    setTimeout(() => {
      if (status === "success") {
        clearCart()
        router.push(`/payment/success?order_id=${orderId}&amount=${grandTotal}&email=${encodeURIComponent(formData.email)}`)
      } else {
        router.push(`/payment/failed?order_id=${orderId}`)
      }
    }, 700)
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-zinc-500 mb-6">
          <Link href="/" className="hover:text-zinc-900 transition-colors">
            Beranda
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-zinc-900 transition-colors">
            Katalog
          </Link>
          <span>/</span>
          <span className="text-zinc-900 font-medium">Checkout</span>
        </nav>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 mb-8">
          Checkout Pembelian
        </h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-zinc-200/80 p-12 text-center max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-zinc-900">Keranjang Belanja Kosong</h2>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1.5 leading-relaxed">
              Belum ada produk yang dipilih untuk proses checkout. Silakan jelajahi koleksi kami terlebih dahulu.
            </p>
            <Link
              href="/products"
              className="mt-6 inline-block bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-xs sm:text-sm px-6 py-3 rounded-xl transition-colors"
            >
              Kembali ke Katalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Customer & Shipping Details Form */}
            <div className="lg:col-span-7 space-y-6">
              {/* Section 1: Customer Information */}
              <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-7 space-y-4">
                <h2 className="text-base font-bold text-zinc-900 pb-3 border-b border-zinc-100">
                  1. Data Pembeli
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label htmlFor="name" className="block text-xs font-semibold text-zinc-700 mb-1">
                      Nama Lengkap
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 focus:outline-none focus:bg-white focus:border-zinc-900"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold text-zinc-700 mb-1">
                      Alamat Email (Untuk Tanda Terima)
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 focus:outline-none focus:bg-white focus:border-zinc-900"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-xs font-semibold text-zinc-700 mb-1">
                      Nomor WhatsApp / HP
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 focus:outline-none focus:bg-white focus:border-zinc-900"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Shipping Address */}
              <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-7 space-y-4">
                <h2 className="text-base font-bold text-zinc-900 pb-3 border-b border-zinc-100">
                  2. Alamat Pengiriman
                </h2>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="address" className="block text-xs font-semibold text-zinc-700 mb-1">
                      Alamat Lengkap (Nama Jalan, No. Rumah / Gedung)
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      rows={3}
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 focus:outline-none focus:bg-white focus:border-zinc-900"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-xs font-semibold text-zinc-700 mb-1">
                        Kota / Kabupaten
                      </label>
                      <input
                        id="city"
                        name="city"
                        type="text"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 focus:outline-none focus:bg-white focus:border-zinc-900"
                      />
                    </div>

                    <div>
                      <label htmlFor="postalCode" className="block text-xs font-semibold text-zinc-700 mb-1">
                        Kode Pos
                      </label>
                      <input
                        id="postalCode"
                        name="postalCode"
                        type="text"
                        required
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 focus:outline-none focus:bg-white focus:border-zinc-900"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Shipping Method */}
              <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-7 space-y-4">
                <h2 className="text-base font-bold text-zinc-900 pb-3 border-b border-zinc-100">
                  3. Layanan Pengiriman
                </h2>

                <div className="space-y-2.5">
                  {SHIPPING_OPTIONS.map((opt) => (
                    <label
                      key={opt.id}
                      className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                        selectedShipping === opt.id
                          ? "border-zinc-900 bg-zinc-50/80 ring-1 ring-zinc-900"
                          : "border-zinc-200 hover:border-zinc-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shippingOption"
                          value={opt.id}
                          checked={selectedShipping === opt.id}
                          onChange={() => setSelectedShipping(opt.id)}
                          className="w-4 h-4 text-zinc-900 border-zinc-300 focus:ring-zinc-900"
                        />
                        <div>
                          <div className="text-xs font-semibold text-zinc-900">{opt.name}</div>
                          <div className="text-[11px] text-zinc-500">{opt.courier}</div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-zinc-900 tabular-nums">
                        {formatRupiah(opt.price)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Section 4: Payment Gateway Info */}
              <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-7 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                  <h2 className="text-base font-bold text-zinc-900">
                    4. Metode Pembayaran
                  </h2>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-zinc-100 text-zinc-800 rounded-lg">
                    Xendit Gateway
                  </span>
                </div>

                <p className="text-xs text-zinc-600 leading-relaxed">
                  Setelah menekan tombol bayar, Anda akan diarahkan ke invoice pembayaran aman resmi Xendit dengan metode:
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs text-zinc-700">
                  <div className="p-2.5 rounded-lg border border-zinc-200 bg-zinc-50 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>QRIS (GoPay/OVO)</span>
                  </div>
                  <div className="p-2.5 rounded-lg border border-zinc-200 bg-zinc-50 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Virtual Account BCA</span>
                  </div>
                  <div className="p-2.5 rounded-lg border border-zinc-200 bg-zinc-50 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>VA Mandiri / BRI</span>
                  </div>
                  <div className="p-2.5 rounded-lg border border-zinc-200 bg-zinc-50 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Kartu Kredit / Debit</span>
                  </div>
                  <div className="p-2.5 rounded-lg border border-zinc-200 bg-zinc-50 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>ShopeePay</span>
                  </div>
                  <div className="p-2.5 rounded-lg border border-zinc-200 bg-zinc-50 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Alfamart / Indomaret</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary & Payment Triggers */}
            <div className="lg:col-span-5 sticky top-24 space-y-6">
              <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-7 space-y-5">
                <h2 className="text-base font-bold text-zinc-900 pb-3 border-b border-zinc-100 flex items-center justify-between">
                  <span>Ringkasan Pesanan</span>
                  <span className="text-xs font-medium text-zinc-500">{items.length} jenis item</span>
                </h2>

                {/* Items preview */}
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.variant.id} className="flex items-center gap-3 py-2 border-b border-zinc-100 last:border-b-0">
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-zinc-100 shrink-0 border border-zinc-100">
                        <Image
                          src={
                            (typeof item.product.images[0] === "string"
                              ? item.product.images[0]
                              : item.product.images[0]?.url) || ""
                          }
                          alt={item.product.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xs font-semibold text-zinc-900 truncate">
                          {item.product.title}
                        </h3>
                        <p className="text-[11px] text-zinc-500">
                          {item.variant.name} &times; {item.quantity}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-zinc-900 tabular-nums">
                        {formatRupiah(item.variant.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="pt-3 border-t border-zinc-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-zinc-600">
                    <span>Subtotal Produk</span>
                    <span className="font-semibold text-zinc-900 tabular-nums">{formatRupiah(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-600">
                    <span>Biaya Pengiriman</span>
                    <span className="font-semibold text-zinc-900 tabular-nums">{formatRupiah(shippingCost)}</span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-600">
                    <span>Biaya Layanan Gateway</span>
                    <span className="text-emerald-600 font-semibold">Gratis</span>
                  </div>
                  <div className="pt-3 mt-3 border-t border-zinc-100 flex items-baseline justify-between">
                    <span className="text-sm font-bold text-zinc-900">Total Tagihan</span>
                    <span className="text-lg font-bold text-zinc-900 tabular-nums">{formatRupiah(grandTotal)}</span>
                  </div>
                </div>

                {/* Action CTA Buttons */}
                <div className="pt-3 space-y-2.5">
                  <button
                    onClick={() => handlePaymentRedirect("success")}
                    disabled={isProcessing}
                    className="w-full py-3.5 px-4 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <span>Memproses Pembayaran...</span>
                    ) : (
                      <>
                        <span>Bayar Sekarang (Simulasi Sukses)</span>
                        <span>&rarr;</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handlePaymentRedirect("failed")}
                    disabled={isProcessing}
                    className="w-full py-2.5 px-4 bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-600 hover:text-zinc-900 rounded-xl text-xs font-medium transition-colors"
                  >
                    Simulasi Pembayaran Gagal / Batal
                  </button>
                </div>

                {/* Security info */}
                <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-zinc-400">
                  <svg className="w-3.5 h-3.5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Dukungan enkripsi transaksi PCI-DSS 256-bit</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
