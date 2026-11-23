"use client"

import { useState, use } from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Navbar } from "@/components/storefront/navbar"
import { Footer } from "@/components/storefront/footer"
import { ProductCard } from "@/components/storefront/product-card"
import { useCart } from "@/components/storefront/cart-context"
import { getProductBySlug, PRODUCTS, formatRupiah, type ProductVariant, type ProductImage } from "@/data/products-data"

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
        <nav className="flex items-center gap-2 text-xs text-zinc-500 mb-8">
          <Link href="/" className="hover:text-zinc-900 transition-colors">
            Beranda
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-zinc-900 transition-colors">
            Katalog
          </Link>
          <span>/</span>
          <span className="text-zinc-900 font-medium truncate max-w-xs">{product.title}</span>
        </nav>

        {/* Product Overview Section */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            {/* Left: Gallery Column */}
            <div className="lg:col-span-7 space-y-4">
              <div className="relative aspect-4/3 w-full rounded-xl overflow-hidden bg-zinc-50 border border-zinc-100">
                <Image
                  src={
                    typeof (product.images[selectedImageIndex] || product.images[0]) === "string"
                      ? ((product.images[selectedImageIndex] || product.images[0]) as string)
                      : ((product.images[selectedImageIndex] || product.images[0]) as ProductImage)?.url || ""
                  }
                  alt={product.title}
                  fill
                  priority
                  className="object-cover transition-all duration-300"
                />
                {product.badge && (
                  <span className="absolute top-4 left-4 bg-white/95 text-zinc-900 font-medium text-xs px-3 py-1 rounded-md border border-zinc-200">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex items-center gap-3">
                  {product.images.map((img, idx) => {
                    const imgUrl = typeof img === "string" ? img : img.url
                    return (
                      <button
                        key={`${imgUrl}-${idx}`}
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`relative w-20 h-20 rounded-lg overflow-hidden border transition-all ${
                          selectedImageIndex === idx
                            ? "border-zinc-900 ring-1 ring-zinc-900"
                            : "border-zinc-200 hover:border-zinc-300 opacity-70 hover:opacity-100"
                        }`}
                      >
                        <Image src={imgUrl} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Right: Info & Purchase Column */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    {typeof product.category === "object" && product.category !== null ? product.category.name : (product.category || "")}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-700 bg-zinc-100 px-2.5 py-1 rounded-full">
                    <svg className="w-3.5 h-3.5 fill-amber-400 text-amber-400" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span>{product.rating}</span>
                    <span className="text-zinc-400">({product.reviewsCount} Ulasan)</span>
                  </div>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 [text-wrap:balance]">
                  {product.title}
                </h1>

                {/* Price */}
                <div className="flex items-baseline gap-3 pt-1">
                  <span className="text-3xl font-bold text-zinc-900 tabular-nums">
                    {formatRupiah(selectedVariant.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-zinc-400 line-through tabular-nums">
                      {formatRupiah(product.originalPrice)}
                    </span>
                  )}
                </div>

                <p className="text-sm text-zinc-600 leading-relaxed pt-2 [text-wrap:pretty]">
                  {product.description}
                </p>

                {/* Variant Selector */}
                <div className="pt-4 border-t border-zinc-100 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-zinc-900">Varian:</span>
                    <span className="text-zinc-500 font-medium">{selectedVariant.name}</span>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {product.variants.map((v) => {
                      const isSelected = selectedVariant.id === v.id
                      const inStock = v.stock > 0
                      return (
                        <button
                          key={v.id}
                          onClick={() => setSelectedVariant(v)}
                          disabled={!inStock}
                          className={`px-4 py-2 rounded-xl text-xs font-medium border transition-colors ${
                            isSelected
                              ? "bg-zinc-900 text-white border-zinc-900"
                              : inStock
                              ? "bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300"
                              : "bg-zinc-50 text-zinc-400 border-zinc-200 cursor-not-allowed line-through"
                          }`}
                        >
                          {v.name}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Quantity and Add to Cart */}
                <div className="pt-4 border-t border-zinc-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="flex items-center border border-zinc-200 rounded-xl bg-zinc-50 self-start sm:self-auto">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="px-3 py-2 text-zinc-600 hover:text-zinc-900 disabled:opacity-30 disabled:cursor-not-allowed"
                      aria-label="Kurangi kuantitas"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 text-xs font-semibold text-zinc-900 tabular-nums">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 text-zinc-600 hover:text-zinc-900"
                      aria-label="Tambah kuantitas"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className={`flex-1 font-semibold text-xs sm:text-sm py-3 px-6 rounded-xl transition-all ${
                      isAdded
                        ? "bg-emerald-600 text-white"
                        : "bg-zinc-900 hover:bg-zinc-800 text-white"
                    }`}
                  >
                    {isAdded ? "✓ Ditambahkan ke Keranjang" : "+ Tambah ke Keranjang"}
                  </button>
                </div>
              </div>

              {/* Highlights & Guarantees */}
              <div className="pt-6 border-t border-zinc-100 grid grid-cols-2 gap-3 text-xs text-zinc-600">
                <div className="flex items-center gap-2">
                  <span className="text-zinc-900">✓</span>
                  <span>Garansi Resmi 1 Tahun</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-900">✓</span>
                  <span>Pengiriman Cepat</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-900">✓</span>
                  <span>Material Terverifikasi</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-900">✓</span>
                  <span>Pembayaran Aman</span>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="mt-14 pt-10 border-t border-zinc-100">
            <h2 className="text-lg font-bold text-zinc-900 mb-6">
              Spesifikasi Detail
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {product.specs.map((spec) => (
                <div key={spec.label} className="p-4 rounded-xl border border-zinc-200/80 bg-zinc-50/50">
                  <div className="text-xs text-zinc-500 font-medium">{spec.label}</div>
                  <div className="text-xs sm:text-sm font-semibold text-zinc-900 mt-1">{spec.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 mb-6">
              Produk Terkait
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
