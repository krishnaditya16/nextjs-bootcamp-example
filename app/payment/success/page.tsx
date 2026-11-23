"use client"

import { Suspense, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/storefront/navbar"
import { Footer } from "@/components/storefront/footer"
import { useCart } from "@/components/storefront/cart-context"
import { formatRupiah } from "@/data/products-data"

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const { clearCart } = useCart()

  const orderId = searchParams.get("order_id") || "TK-2026-928104"
  const amountParam = searchParams.get("amount")
  const email = searchParams.get("email") || "pembeli@example.com"
  const amount = amountParam ? parseInt(amountParam, 10) : 1850000

  // Clear cart on successful mount
  useEffect(() => {
    clearCart()
  }, [clearCart])

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full">
        {/* Success Card */}
        <div className="bg-white rounded-3xl border border-zinc-200/80 p-8 sm:p-12 text-center shadow-xs">
          {/* Green Check Icon */}
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full mb-3 border border-emerald-200">
            Transaksi Lunas (PAID)
          </span>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 [text-wrap:balance]">
            Pembayaran Berhasil Dikonfirmasi
          </h1>

          <p className="text-xs sm:text-sm text-zinc-600 mt-2 max-w-lg mx-auto leading-relaxed [text-wrap:pretty]">
            Terima kasih atas pesanan Anda. Sistem Xendit Payment Gateway telah memverifikasi pembayaran Anda secara *real-time*.
          </p>

          {/* Receipt Breakdown */}
          <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-zinc-50 border border-zinc-200/80 text-left space-y-3 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200/80">
              <span className="text-zinc-500">Nomor Pesanan</span>
              <span className="font-bold text-zinc-900 font-mono tracking-wider">{orderId}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Waktu Pembayaran</span>
              <span className="font-medium text-zinc-800">
                {new Date().toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })} WIB
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Metode Pembayaran</span>
              <span className="font-medium text-zinc-800">Xendit Gateway (QRIS / VA)</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Kirim Bukti ke</span>
              <span className="font-medium text-zinc-800 truncate max-w-[200px]">{email}</span>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-zinc-200/80">
              <span className="text-sm font-bold text-zinc-900">Total Pembayaran</span>
              <span className="text-base font-bold text-emerald-600 tabular-nums">{formatRupiah(amount)}</span>
            </div>
          </div>

          {/* Next Steps Progress */}
          <div className="mt-8 text-left space-y-3">
            <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
              Langkah Selanjutnya
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl border border-zinc-200 bg-white">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center mb-1.5">
                  ✓
                </span>
                <div className="text-xs font-semibold text-zinc-900">Pembayaran Terverifikasi</div>
                <div className="text-[11px] text-zinc-500 mt-0.5">Selesai secara otomatis</div>
              </div>

              <div className="p-3.5 rounded-xl border border-zinc-200 bg-white">
                <span className="w-5 h-5 rounded-full bg-zinc-900 text-white font-bold text-[10px] flex items-center justify-center mb-1.5">
                  2
                </span>
                <div className="text-xs font-semibold text-zinc-900">Pengemasan Pesanan</div>
                <div className="text-[11px] text-zinc-500 mt-0.5">Sedang disiapkan di gudang</div>
              </div>

              <div className="p-3.5 rounded-xl border border-zinc-200 bg-white">
                <span className="w-5 h-5 rounded-full bg-zinc-200 text-zinc-700 font-bold text-[10px] flex items-center justify-center mb-1.5">
                  3
                </span>
                <div className="text-xs font-semibold text-zinc-900">Pengiriman &amp; Resi</div>
                <div className="text-[11px] text-zinc-500 mt-0.5">Nomor resi dikirim via email</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 pt-8 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors"
            >
              Kembali ke Beranda
            </Link>
            <Link
              href="/products"
              className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-zinc-100 border border-zinc-300 text-zinc-800 text-xs sm:text-sm font-semibold rounded-xl transition-colors"
            >
              Lihat Produk Lainnya
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-50" />}>
      <PaymentSuccessContent />
    </Suspense>
  )
}
