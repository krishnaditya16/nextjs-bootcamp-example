"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/storefront/navbar"
import { Footer } from "@/components/storefront/footer"

function PaymentFailedContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("order_id") || "TK-2026-441029"

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">
      <Navbar />

      <main className="flex-1 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full">
        {/* Failed Card */}
        <div className="bg-white rounded-3xl border border-zinc-200/80 p-8 sm:p-12 text-center shadow-xs">
          {/* Amber/Red Alert Icon */}
          <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 border border-red-200 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>

          <span className="inline-block px-3 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded-full mb-3 border border-red-200">
            Transaksi Belum Berhasil
          </span>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 [text-wrap:balance]">
            Pembayaran Gagal atau Dibatalkan
          </h1>

          <p className="text-xs sm:text-sm text-zinc-600 mt-2 max-w-md mx-auto leading-relaxed [text-wrap:pretty]">
            Kami belum dapat memproses pembayaran pesanan Anda. Sesi transaksi mungkin telah kedaluwarsa atau terjadi pembatalan dari pihak pembayaran.
          </p>

          {/* Details Card */}
          <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-zinc-50 border border-zinc-200/80 text-left space-y-3 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200/80">
              <span className="text-zinc-500">Nomor Pesanan</span>
              <span className="font-bold text-zinc-900 font-mono tracking-wider">{orderId}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Status Gateway</span>
              <span className="font-semibold text-red-600">FAILED / EXPIRED</span>
            </div>

            <div className="pt-2">
              <span className="text-zinc-700 font-semibold block mb-1.5">Kemungkinan penyebab kendala:</span>
              <ul className="list-disc list-inside space-y-1 text-zinc-500 text-[11px]">
                <li>Batas waktu pembayaran (invoice expired) telah terlewati.</li>
                <li>Transaksi dibatalkan sebelum kode QRIS atau Virtual Account dibayar.</li>
                <li>Saldo e-wallet atau limit transaksi kartu kredit tidak mencukupi.</li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 pt-8 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/checkout"
              className="w-full sm:w-auto px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors"
            >
              Ulangi Pembayaran
            </Link>
            <Link
              href="/products"
              className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-zinc-100 border border-zinc-300 text-zinc-800 text-xs sm:text-sm font-semibold rounded-xl transition-colors"
            >
              Kembali ke Katalog
            </Link>
          </div>

          <p className="text-[11px] text-zinc-400 mt-6">
            Mengalami masalah pembayaran berulang? Hubungi tim kami di{" "}
            <a href="mailto:support@tokokita.id" className="underline hover:text-zinc-700">
              support@tokokita.id
            </a>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-50" />}>
      <PaymentFailedContent />
    </Suspense>
  )
}
