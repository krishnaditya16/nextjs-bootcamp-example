import Link from "next/link"
import Image from "next/image"
import { Navbar } from "@/components/storefront/navbar"
import { Footer } from "@/components/storefront/footer"
import { ProductCard } from "@/components/storefront/product-card"
import { CATEGORIES, PRODUCTS } from "@/data/products-data"

export default function Home() {
  const featuredProducts = PRODUCTS.slice(0, 4)

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">
      {/* Top Announcement Bar */}
      <div className="bg-zinc-900 text-white text-xs py-2 px-4 text-center font-medium">
        <span>Koleksi Baru 2026: Dapatkan potongan khusus untuk pesanan pertama dengan kode </span>
        <span className="font-bold underline tracking-wide">TOKOKITA26</span>
      </div>

      <Navbar />

      <main className="flex-1">
        {/* 1. Hero Section */}
        <section className="bg-white border-b border-zinc-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-xs font-semibold text-zinc-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Koleksi Eksklusif 2026 Tersedia
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-900 leading-[1.1]">
                  Dirancang untuk Kualitas.{" "}
                  <span className="text-zinc-600 block">Sempurna untuk Keseharian.</span>
                </h1>

                <p className="text-base sm:text-lg text-zinc-600 max-w-xl leading-relaxed">
                  Temukan perlengkapan audio presisi, aksesoris harian, dan timepieces berdesain minimalis yang dibuat dengan material premium berstandar internasional.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link
                    href="/products"
                    className="bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-sm px-7 py-3.5 rounded-xl transition-all shadow-sm active:scale-95"
                  >
                    Jelajahi Katalog
                  </Link>
                  <a
                    href="#categories"
                    className="bg-white hover:bg-zinc-100 border border-zinc-300 text-zinc-800 font-semibold text-sm px-6 py-3.5 rounded-xl transition-all active:scale-95"
                  >
                    Pilihan Kategori
                  </a>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-4 pt-8 border-t border-zinc-100 max-w-md">
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-zinc-900">4.9 / 5</div>
                    <div className="text-xs text-zinc-600 mt-0.5">Rating Pelanggan</div>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-zinc-900">100%</div>
                    <div className="text-xs text-zinc-600 mt-0.5">Garansi Resmi</div>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-zinc-900">Xendit</div>
                    <div className="text-xs text-zinc-600 mt-0.5">Pembayaran Aman</div>
                  </div>
                </div>
              </div>

              {/* Right Column: Featured Banner Image */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden shadow-xl border border-zinc-200 bg-zinc-100 group">
                  <Image
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&q=80"
                    alt="Aura Studio ANC Headphone"
                    fill
                    priority
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                    <span className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">
                      Produk Unggulan
                    </span>
                    <h2 className="text-xl font-bold">Aura Studio ANC 2.0</h2>
                    <p className="text-xs text-zinc-300 mt-1">Driver Beryllium 40mm • ANC Hibrida</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Value Propositions Row */}
        <section className="bg-zinc-50 border-b border-zinc-200 py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0 text-zinc-900">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-sm font-bold text-zinc-900">Kualitas Terjamin</h2>
                  <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                    Setiap produk melewati uji kendali mutu ketat dan bergaransi resmi 1 tahun.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0 text-zinc-900">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-sm font-bold text-zinc-900">Pengiriman Cepat</h2>
                  <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                    Pesanan diproses secara aman dengan pengemasan berlapis untuk menjamin keutuhan barang.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0 text-zinc-900">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-sm font-bold text-zinc-900">Pembayaran Otomatis</h2>
                  <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                    Didukung gateway pembayaran Xendit: QRIS, Virtual Account, dan E-Wallet real-time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Featured Categories */}
        <section id="categories" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                Eksplorasi
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 mt-1">
                Kategori Pilihan
              </h2>
            </div>
            <Link
              href="/products"
              className="text-xs sm:text-sm font-semibold text-zinc-900 hover:text-zinc-600 transition-colors"
            >
              Lihat Semua &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="group relative rounded-2xl overflow-hidden aspect-4/3 bg-zinc-100 border border-zinc-200 shadow-xs block"
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-5 text-white">
                  <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider">
                    {cat.tag}
                  </span>
                  <h3 className="text-lg font-bold mt-0.5">{cat.name}</h3>
                  <span className="text-xs text-zinc-300 mt-0.5">{cat.itemCount} Produk</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 4. Best Sellers / Featured Products */}
        <section className="bg-white border-y border-zinc-200 py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <span className="text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                  Katalog Unggulan
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 mt-1">
                  Produk Terlaris Minggu Ini
                </h2>
                <p className="text-xs sm:text-sm text-zinc-600 mt-1 max-w-lg">
                  Pilihan produk paling diminati oleh komunitas kreator dan profesional.
                </p>
              </div>
              <Link
                href="/products"
                className="bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-colors self-start sm:self-auto"
              >
                Buka Katalog Lengkap ({PRODUCTS.length} Produk)
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
