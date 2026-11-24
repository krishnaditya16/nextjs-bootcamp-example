"use client"

import { useState } from "react"
import { useCart } from "./cart-context"
import { formatRupiah } from "@/data/products-data"

export interface AddToCartWidgetVariant {
  id: string
  sku?: string
  size?: string | null
  color?: string | null
  price: number
  stock: number
  name?: string
}

export interface AddToCartWidgetProps {
  productId: string
  variants: AddToCartWidgetVariant[]
}

export function AddToCartWidget({ productId, variants }: AddToCartWidgetProps) {
  const { addItem, isLoading } = useCart()
  const [selectedVariant, setSelectedVariant] = useState<AddToCartWidgetVariant>(
    variants[0] || { id: "", price: 0, stock: 0, name: "Standar" }
  )
  const [quantity, setQuantity] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const inStock = selectedVariant.stock > 0

  const handleAddToCart = async () => {
    if (!inStock) return
    setIsSubmitting(true)
    try {
      await addItem({
        productId,
        variantId: selectedVariant.id || null,
        quantity,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const variantLabel = (v: AddToCartWidgetVariant) => {
    return (
      [v.size, v.color].filter(Boolean).join(" / ") ||
      v.sku ||
      v.name ||
      "Standar"
    )
  }

  return (
    <div className="space-y-4">
      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-zinc-900 tabular-nums">
          {formatRupiah(selectedVariant.price)}
        </span>
        <span className="text-xs text-zinc-500 font-medium">
          {inStock ? `Stok: ${selectedVariant.stock} unit` : "Stok Habis"}
        </span>
      </div>

      {/* Variant Selector */}
      {variants.length > 0 && (
        <div className="pt-4 border-t border-zinc-100 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-zinc-900">Pilihan Varian:</span>
            <span className="text-zinc-500 font-medium">
              {variantLabel(selectedVariant)}
            </span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {variants.map((v) => {
              const isSelected = selectedVariant.id === v.id
              const hasStock = v.stock > 0
              return (
                <button
                  key={v.id}
                  onClick={() => {
                    setSelectedVariant(v)
                    setQuantity(1)
                  }}
                  disabled={!hasStock}
                  className={`px-4 py-2 rounded-xl text-xs font-medium border transition-colors ${
                    isSelected
                      ? "bg-zinc-900 text-white border-zinc-900"
                      : hasStock
                      ? "bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300"
                      : "bg-zinc-50 text-zinc-400 border-zinc-200 cursor-not-allowed line-through"
                  }`}
                >
                  {variantLabel(v)}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Quantity & CTA */}
      <div className="pt-4 border-t border-zinc-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex items-center border border-zinc-200 rounded-xl bg-zinc-50 self-start sm:self-auto">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1 || !inStock || isSubmitting}
            className="px-3 py-2 text-zinc-600 hover:text-zinc-900 disabled:opacity-30 disabled:cursor-not-allowed font-bold"
            aria-label="Kurangi kuantitas"
          >
            -
          </button>
          <span className="px-4 py-2 text-xs font-semibold text-zinc-900 tabular-nums">
            {quantity}
          </span>
          <button
            onClick={() =>
              setQuantity(Math.min(selectedVariant.stock, quantity + 1))
            }
            disabled={
              quantity >= selectedVariant.stock || !inStock || isSubmitting
            }
            className="px-3 py-2 text-zinc-600 hover:text-zinc-900 disabled:opacity-30 disabled:cursor-not-allowed font-bold"
            aria-label="Tambah kuantitas"
          >
            +
          </button>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={!inStock || isSubmitting || isLoading}
          className="flex-1 bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-300 text-white font-semibold text-xs sm:text-sm py-3 px-6 rounded-xl transition-all shadow-sm"
        >
          {isSubmitting
            ? "Menambahkan..."
            : inStock
            ? "+ Tambah ke Keranjang"
            : "Stok Habis"}
        </button>
      </div>
    </div>
  )
}
