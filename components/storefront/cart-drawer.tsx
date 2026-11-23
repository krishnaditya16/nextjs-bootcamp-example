"use client"

import Image from "next/image"
import Link from "next/link"
import { useCart } from "./cart-context"
import { formatRupiah } from "@/data/products-data"

export function CartDrawer() {
  const { items, isCartOpen, setIsCartOpen, removeItem, updateQuantity, subtotal } = useCart()

  if (!isCartOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10">
        {/* Header */}
        <div className="p-5 border-b border-zinc-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-zinc-900">Keranjang Belanja</h2>
            <span className="bg-zinc-100 text-zinc-700 text-xs font-semibold px-2 py-0.5 rounded-full">
              {items.length} item
            </span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-zinc-400 hover:text-zinc-600 rounded-lg hover:bg-zinc-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="text-zinc-900 font-semibold mb-1">Keranjang masih kosong</p>
              <p className="text-xs text-zinc-500 max-w-xs mb-6">
                Jelajahi produk berkualitas kami dan tambahkan barang ke dalam keranjang.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="bg-zinc-900 text-white text-xs font-medium px-5 py-2.5 rounded-xl hover:bg-zinc-800 transition-colors"
              >
                Mulai Belanja
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.variant.id}
                className="flex gap-4 p-3 rounded-xl border border-zinc-100 hover:border-zinc-200 transition-colors bg-white"
              >
                {/* Thumbnail */}
                <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-zinc-50 shrink-0 border border-zinc-100">
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

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900 truncate">
                      {item.product.title}
                    </h3>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Varian: <span className="font-medium text-zinc-700">{item.variant.name}</span>
                    </p>
                    <p className="text-xs font-bold text-zinc-900 mt-1">
                      {formatRupiah(item.variant.price)}
                    </p>
                  </div>

                  {/* Quantity Stepper & Remove */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center border border-zinc-200 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.variant.id, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center text-zinc-600 hover:bg-zinc-100 rounded-l-lg transition-colors text-xs font-bold"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xs font-semibold text-zinc-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.variant.id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center text-zinc-600 hover:bg-zinc-100 rounded-r-lg transition-colors text-xs font-bold"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.variant.id)}
                      className="text-xs text-red-500 hover:text-red-700 font-medium"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Checkout */}
        {items.length > 0 && (
          <div className="p-5 border-t border-zinc-200 bg-zinc-50/70 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-600">Subtotal</span>
              <span className="text-base font-bold text-zinc-900">{formatRupiah(subtotal)}</span>
            </div>
            <p className="text-[11px] text-zinc-500">
              Pajak dan biaya pengiriman akan dihitung saat checkout pembayaran.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-full py-3 px-4 rounded-xl border border-zinc-300 text-zinc-700 hover:bg-zinc-100 font-semibold text-xs text-center transition-colors"
              >
                Lanjut Belanja
              </button>
              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs text-center transition-colors shadow-sm"
              >
                Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
