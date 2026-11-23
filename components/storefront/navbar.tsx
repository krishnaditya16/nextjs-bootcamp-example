"use client"

import Link from "next/link"
import { useCart } from "./cart-context"

export function Navbar() {
  const { totalCount, setIsCartOpen } = useCart()

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-6">
        {/* Brand Logo & Navigation */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 text-white flex items-center justify-center font-bold text-base shadow-sm group-hover:scale-105 transition-transform">
              T
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold tracking-tight text-lg sm:text-xl text-zinc-900">
                TOKOKITA
              </span>
              <span className="text-[10px] text-zinc-600 font-medium tracking-wider uppercase -mt-1">
                Storefront
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-600">
            <Link href="/" className="hover:text-zinc-900 transition-colors">
              Beranda
            </Link>
            <Link href="/products" className="hover:text-zinc-900 transition-colors">
              Katalog Produk
            </Link>
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/products"
            className="p-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors hidden sm:flex items-center gap-1.5 text-xs font-medium"
            title="Cari Produk"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>Cari</span>
          </Link>

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-colors"
            title="Keranjang Belanja"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {totalCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 min-w-[20px] px-1 bg-zinc-900 text-white font-bold text-[10px] flex items-center justify-center rounded-full shadow-sm">
                {totalCount}
              </span>
            )}
          </button>

          {/* Dedicated Login Link */}
          <Link
            href="/login"
            className="bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs sm:text-sm px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl transition-all shadow-sm active:scale-95"
          >
            Masuk
          </Link>
        </div>
      </div>
    </header>
  )
}
