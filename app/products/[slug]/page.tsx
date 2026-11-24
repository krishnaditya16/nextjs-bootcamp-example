import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Navbar } from "@/components/storefront/navbar"
import { Footer } from "@/components/storefront/footer"
import { ProductCard } from "@/components/storefront/product-card"
import { AddToCartWidget } from "@/components/storefront/add-to-cart-widget"
import { prisma } from "@/lib/db"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await prisma.product.findUnique({
    where: { slug, isActive: true },
    select: { name: true, description: true },
  })

  if (!product) return { title: "Produk Tidak Ditemukan" }
  return {
    title: `${product.name} | TOKOKITA`,
    description: product.description?.slice(0, 155) || undefined,
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params

  const product = await prisma.product.findUnique({
    where: { slug, isActive: true },
    include: {
      category: true,
      variants: { orderBy: { sku: "asc" } },
      images: { orderBy: { order: "asc" } },
    },
  })

  if (!product) {
    notFound()
  }

  const relatedProducts = product.categoryId
    ? await prisma.product.findMany({
        where: {
          isActive: true,
          categoryId: product.categoryId,
          id: { not: product.id },
        },
        take: 4,
        orderBy: { createdAt: "desc" },
        include: {
          category: true,
          images: { orderBy: { order: "asc" }, take: 1 },
          variants: { select: { id: true, price: true, stock: true } },
        },
      })
    : []

  const coverImage = product.images[0]?.url || "/placeholder/product.jpg"
  const serializedVariants = product.variants.map((v) => ({
    id: v.id,
    sku: v.sku,
    size: v.size,
    color: v.color,
    price: Number(v.price),
    stock: v.stock,
  }))

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
          {product.category && (
            <>
              <Link
                href={`/products?category=${product.category.slug}`}
                className="hover:text-zinc-900 transition-colors"
              >
                {product.category.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-zinc-900 font-medium truncate max-w-xs">
            {product.name}
          </span>
        </nav>

        {/* Product Overview Section */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-10 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            {/* Left: Gallery Column */}
            <div className="lg:col-span-7 space-y-4">
              <div className="relative aspect-4/3 w-full rounded-xl overflow-hidden bg-zinc-50 border border-zinc-100">
                <Image
                  src={coverImage}
                  alt={product.name}
                  fill
                  priority
                  className="object-cover"
                />
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {product.images.map((img, idx) => (
                    <div
                      key={img.id}
                      className={`relative w-20 h-20 rounded-lg overflow-hidden border shrink-0 ${
                        idx === 0
                          ? "border-zinc-900 ring-1 ring-zinc-900"
                          : "border-zinc-200"
                      }`}
                    >
                      <Image
                        src={img.url}
                        alt={img.altText || `${product.name} ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Info Column */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-500 uppercase tracking-wider">
                    {product.category?.name || "Koleksi Tokokita"}
                  </span>
                  <div className="flex items-center gap-1 font-semibold text-zinc-700">
                    <svg
                      className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span>4.9</span>
                    <span className="text-zinc-400 font-normal">(Ulasan Terverifikasi)</span>
                  </div>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 [text-wrap:balance]">
                  {product.name}
                </h1>

                {product.description && (
                  <p className="text-sm text-zinc-600 leading-relaxed [text-wrap:pretty]">
                    {product.description}
                  </p>
                )}

                {/* Interactive Add To Cart Widget */}
                <AddToCartWidget
                  productId={product.id}
                  variants={serializedVariants}
                />
              </div>

              {/* Guarantees */}
              <div className="pt-6 border-t border-zinc-100 grid grid-cols-2 gap-3 text-xs text-zinc-600">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Garansi Resmi 1 Tahun</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Pengiriman Seluruh Indonesia</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Produk 100% Original</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Pembayaran Aman (Xendit)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold tracking-tight text-zinc-900">
              Produk Terkait
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard
                  key={rel.id}
                  product={{
                    ...rel,
                    variants: rel.variants.map((v) => ({
                      ...v,
                      price: Number(v.price),
                    })),
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
