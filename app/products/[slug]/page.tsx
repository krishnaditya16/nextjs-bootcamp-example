"use client"

import { useState, use } from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Navbar } from "@/components/storefront/navbar"
import { Footer } from "@/components/storefront/footer"
import { ProductCard } from "@/components/storefront/product-card"
import { useCart } from "@/components/storefront/cart-context"
import { getProductBySlug, PRODUCTS, formatRupiah, type ProductVariant } from "@/data/products-data"

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const product = getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  return <ProductDetailContent product={product} />
}

function ProductDetailContent({ product }: { product: NonNullable<ReturnType<typeof getProductBySlug>> }) {
  const { addItem } = useCart()
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0])
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)

  const relatedProducts = PRODUCTS.filter(
    (p) => p.categorySlug === product.categorySlug && p.id !== product.id
  ).slice(0, 4)

  const handleAddToCart = () => {
    addItem(product, selectedVariant, quantity)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-8">
          <Link href="/" className="hover:text-zinc-900 transition-colors">
            Beranda
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-zinc-900 transition-colors">
            Katalog
          </Link>
          <span>/</span>
          <Link href={`/products?category=${product.categorySlug}`} className="hover:text-zinc-900 transition-colors">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-zinc-900 font-semibold truncate max-w-xs">{product.title}</span>
        </nav>

        {/* Product Overview Section */}
        <div className="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            {/* Left: Gallery Column */}
            <div className="lg:col-span-7 space-y-4">
              {/* Main Image View */}
              <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-zinc-50 border border-zinc-100">
                <Image
                  src={product.images[selectedImageIndex] || product.images[0]}
                  alt={product.title}
                  fill
                  priority
                  className="object-cover transition-all duration-300"
                />
                {product.badge && (
                  <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs text-zinc-900 font-bold text-xs px-3 py-1 rounded-full shadow-xs border border-zinc-100">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex items-center gap-3">
                  {product.images.map((img, idx) => (
                    <button
                      key={img}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImageIndex === idx
                          ? "border-zinc-900 shadow-xs"
                          : "border-zinc-200 hover:border-zinc-300 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Info & Purchase Column */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                    {product.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700 bg-zinc-100 px-2.5 py-1 rounded-full">
                    <span className="text-amber-500">★</span>
                    <span>{product.rating}</span>
                    <span className="text-zinc-600">({product.reviewsCount} Ulasan)</span>
                  </div>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
                  {product.title}
                </h1>

                {/* Price */}
                <div className="flex items-baseline gap-3 pt-1">
                  <span className="text-3xl font-extrabold text-zinc-900">
                    {formatRupiah(selectedVariant.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-zinc-600 line-through">
                      {formatRupiah(product.originalPrice)}
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed pt-2">
                  {product.description}
                </p>

                {/* Variant Selector */}
                <div className="pt-4 border-t border-zinc-100 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-zinc-900">Pilih Varian:</span>
                    <span className="text-zinc-600 font-medium">{selectedVariant.name}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 ${
                          selectedVariant.id === v.id
                            ? "border-zinc-900 bg-zinc-900 text-white shadow-xs"
                            : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300"
                        }`}
                      >
                        <span
                          className="w-3 h-3 rounded-full border border-black/10 shrink-0"
                          style={{ backgroundColor: v.color }}
                        />
                        <span>{v.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity Stepper */}
                <div className="pt-4 border-t border-zinc-100 space-y-2">
                  <span className="text-xs font-semibold text-zinc-900 block">Jumlah:</span>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-zinc-200 rounded-xl bg-zinc-50">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="w-10 h-10 flex items-center justify-center text-zinc-600 hover:bg-zinc-100 rounded-l-xl font-bold transition-colors text-sm"
                      >
                        -
                      </button>
                      <span className="w-12 text-center text-sm font-bold text-zinc-900">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity((q) => Math.min(selectedVariant.stock, q + 1))}
                        className="w-10 h-10 flex items-center justify-center text-zinc-600 hover:bg-zinc-100 rounded-r-xl font-bold transition-colors text-sm"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-xs text-zinc-600">
                      Stok tersedia: <span className="font-semibold text-zinc-800">{selectedVariant.stock} unit</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-zinc-100 space-y-3">
                <button
                  onClick={handleAddToCart}
                  disabled={selectedVariant.stock === 0}
                  className={`w-full py-4 px-6 rounded-2xl font-bold text-sm text-center transition-all shadow-sm active:scale-98 flex items-center justify-center gap-2 ${
                    isAdded
                      ? "bg-emerald-600 text-white"
                      : "bg-zinc-900 hover:bg-zinc-800 text-white"
                  }`}
                >
                  {isAdded ? (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Berhasil Ditambahkan ke Keranjang</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      <span>Tambah ke Keranjang</span>
                    </>
                  )}
                </button>

                <p className="text-[11px] text-zinc-600 text-center">
                  Garansi resmi 1 tahun • Bebas pengembalian 14 hari • Pembayaran aman via Xendit
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications Table Section */}
        <div className="mt-12 bg-white rounded-3xl border border-zinc-200 p-6 sm:p-10 shadow-xs">
          <h2 className="text-xl font-bold text-zinc-900 mb-6">Spesifikasi Teknis</h2>
          <div className="divide-y divide-zinc-100">
            {product.specs.map((spec) => (
              <div key={spec.label} className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <span className="font-semibold text-zinc-600">{spec.label}</span>
                <span className="sm:col-span-2 text-zinc-800 font-medium">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 mb-6">
              Produk Terkait yang Mungkin Kamu Suka
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
