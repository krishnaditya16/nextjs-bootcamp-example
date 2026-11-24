"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"
import { useCart } from "@/components/storefront/cart-context"
import { authClient } from "@/lib/auth-client"
import { formatRupiah } from "@/data/products-data"
import { createCheckoutOrder } from "@/app/actions/checkout"
import { Loader2, ShieldCheck } from "lucide-react"

export function CheckoutForm() {
  const { data: session } = authClient.useSession()
  const { items, subtotal, clearCart } = useCart()

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  })

  const [isProcessing, setIsProcessing] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!session?.user) {
      toast.error("Silakan login terlebih dahulu untuk melanjutkan checkout.")
      return
    }

    const recipientName = formData.name.trim() || session.user.name || ""
    const phone = formData.phone.trim()
    const fullAddress = `${formData.address.trim()}, ${formData.city.trim()}, ${formData.postalCode.trim()}`.replace(/^[,\s]+|[,\s]+$/g, "")

    if (!recipientName) {
      toast.error("Nama penerima wajib diisi")
      return
    }
    if (phone.length < 8) {
      toast.error("Nomor telepon minimal 8 digit")
      return
    }
    if (fullAddress.length < 10) {
      toast.error("Mohon lengkapi alamat pengiriman, kota, dan kode pos")
      return
    }

    setIsProcessing(true)

    try {
      const res = await createCheckoutOrder({
        recipientName,
        phone,
        shippingAddress: fullAddress,
      })

      if (!res.success || !res.invoiceUrl) {
        toast.error(res.error || "Gagal memproses checkout")
        setIsProcessing(false)
        return
      }

      toast.success("Pesanan berhasil dibuat! Mengarahkan ke halaman pembayaran...")
      clearCart()
      window.location.assign(res.invoiceUrl)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan sistem")
      setIsProcessing(false)
    }
  }

  return (
    <div>
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
        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Customer & Shipping Details Form */}
          <div className="lg:col-span-7 space-y-6">
            {!session?.user && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xs font-semibold text-amber-900">Anda belum masuk (Login)</h3>
                  <p className="text-[11px] text-amber-700 mt-0.5">
                    Silakan masuk ke akun Anda agar pesanan tersimpan ke riwayat transaksi dan dapat dipantau statusnya.
                  </p>
                </div>
                <Link
                  href="/login?callbackUrl=/checkout"
                  className="shrink-0 px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  Masuk Sekarang
                </Link>
              </div>
            )}

            {/* Section 1: Customer Information */}
            <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-7 space-y-4">
              <h2 className="text-base font-bold text-zinc-900 pb-3 border-b border-zinc-100">
                1. Data Pembeli
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label htmlFor="name" className="block text-xs font-semibold text-zinc-700 mb-1">
                    Nama Penerima
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder={session?.user?.name || "Nama lengkap penerima"}
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 focus:outline-none focus:bg-white focus:border-zinc-900"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-zinc-700 mb-1">
                    Alamat Email (Akun)
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    disabled
                    value={session?.user?.email || "Belum login"}
                    className="w-full bg-zinc-100 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-500 cursor-not-allowed"
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
                    placeholder="Contoh: 081234567890"
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
                    placeholder="Jl. Sudirman No. 45, Gedung Plaza Central Lt. 8"
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
                      placeholder="Jakarta Selatan"
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
                      placeholder="12190"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 focus:outline-none focus:bg-white focus:border-zinc-900"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Redirection Notice */}
            <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 sm:p-6 flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-zinc-900">Pembayaran Aman & Terenkripsi</h3>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  Setelah menekan tombol bayar, Anda akan dialihkan secara otomatis ke halaman pembayaran aman resmi untuk memilih metode pembayaran (QRIS, Virtual Account, atau E-Wallet) dan menyelesaikan transaksi.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Payment Button */}
          <div className="lg:col-span-5 sticky top-24 space-y-6">
            <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-7 space-y-5">
              <h2 className="text-base font-bold text-zinc-900 pb-3 border-b border-zinc-100 flex items-center justify-between">
                <span>Ringkasan Pesanan</span>
                <span className="text-xs font-medium text-zinc-500">{items.length} jenis item</span>
              </h2>

              {/* Items preview */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 py-2 border-b border-zinc-100 last:border-b-0">
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-zinc-100 shrink-0 border border-zinc-100">
                      <Image
                        src={
                          (typeof item.product.images[0] === "string"
                            ? item.product.images[0]
                            : item.product.images[0]?.url) || "/placeholder/product.jpg"
                        }
                        alt={item.product.name || item.product.title || "Produk"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs font-semibold text-zinc-900 truncate">
                        {item.product.name || item.product.title}
                      </h3>
                      <p className="text-[11px] text-zinc-500">
                        {item.variant?.name || "Standar"} &times; {item.quantity}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-zinc-900 tabular-nums">
                      {formatRupiah((item.variant?.price || 0) * item.quantity)}
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
                  <span>Biaya Layanan Gateway</span>
                  <span className="text-emerald-600 font-semibold">Gratis</span>
                </div>
                <div className="pt-3 mt-3 border-t border-zinc-100 flex items-baseline justify-between">
                  <span className="text-sm font-bold text-zinc-900">Total Tagihan</span>
                  <span className="text-lg font-bold text-zinc-900 tabular-nums">{formatRupiah(subtotal)}</span>
                </div>
              </div>

              {/* Action CTA Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isProcessing || !session?.user}
                  className="w-full py-3.5 px-4 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Memproses Pembayaran...</span>
                    </>
                  ) : (
                    <>
                      <span>Bayar Sekarang</span>
                      <span>&rarr;</span>
                    </>
                  )}
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
        </form>
      )}
    </div>
  )
}
