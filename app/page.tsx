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
      <Navbar />

      <main className="flex-1">
        {/* 1. Hero Section */}
        <section className="bg-white border-b border-zinc-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Left Column */}
              <div className="lg:col-span-7 space-y-6">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-900 leading-[1.08] [text-wrap:balance]">
                  Perlengkapan harian dengan rancangan presisi.
                </h1>

                <p className="text-base sm:text-lg text-zinc-600 leading-relaxed max-w-xl [text-wrap:pretty]">
                  Kurasi audio, jam tangan, dan perlengkapan kerja berstandar tinggi. Mengutamakan material tangguh dan kenyamanan penggunaan jangka panjang.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    href="/products"
                    className="bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-sm px-6 py-3 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2"
                  >
                    Lihat Semua Produk
                  </Link>
                  <a
                    href="#categories"
                    className="bg-white hover:bg-zinc-100 border border-zinc-300 text-zinc-800 font-medium text-sm px-6 py-3 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900"
                  >
                    Pilihan Kategori
                  </a>
                </div>
              </div>

              {/* Right Column: Editorial Product Focus */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden border border-zinc-200 bg-zinc-100 group">
                  <Image
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&q=80"
                    alt="Aura Studio ANC 2.0"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 500px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                    <h2 className="text-lg font-bold">Aura Studio ANC 2.0</h2>
                    <p className="text-xs text-zinc-300 mt-0.5">Driver Beryllium 40mm • Peredam Suara Aktif</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Featured Products Section */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
                Produk Unggulan
              </h2>
              <p className="text-sm text-zinc-600 mt-1">
                Koleksi paling diminati dengan material dan performa teruji.
              </p>
            </div>
            <Link
              href="/products"
              className="text-sm font-semibold text-zinc-900 hover:text-zinc-600 transition-colors"
            >
              Buka Katalog Lengkap ({PRODUCTS.length}) &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* 3. Categories Section (#categories) */}
        <section id="categories" className="py-20 bg-white border-y border-zinc-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
                  Kategori Pilihan
                </h2>
                <p className="text-sm text-zinc-600 mt-1">
                  Eksplorasi lini produk berdasarkan fungsi dan kebutuhan.
                </p>
              </div>
              <Link
                href="/products"
                className="text-sm font-semibold text-zinc-900 hover:text-zinc-600 transition-colors"
              >
                Lihat Semua &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className="group relative rounded-2xl overflow-hidden aspect-4/3 bg-zinc-100 border border-zinc-200 block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900"
                >
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-5 text-white">
                    <h3 className="text-lg font-bold">{cat.name}</h3>
                    <span className="text-xs text-zinc-300 mt-0.5">{cat.itemCount} Produk</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Brand Philosophy & Craftsmanship (#about) */}
        <section id="about" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-5">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 leading-tight">
                Standar Material Tanpa Kompromi
              </h2>
              <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
                Tokokita lahir dari kebutuhan akan perlengkapan harian yang tidak hanya nyaman dipandang, tetapi juga tahan dipakai bertahun-tahun.
              </p>
              <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
                Mulai dari rangka Titanium Grade 5, kaca kristal Safir anti-gores, hingga driver akustik Beryllium — kami mengutamakan integritas fisik dan fungsi di setiap produk.
              </p>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden aspect-16/10 bg-zinc-100 border border-zinc-200">
                <Image
                  src="https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=1000&q=80"
                  alt="Tokokita Craftsmanship"
                  fill
                  sizes="(max-width: 1024px) 100vw, 600px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 5. Help / FAQ Section (#help) */}
        <section id="help" className="py-20 bg-white border-t border-zinc-200/80">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
                Pertanyaan Umum
              </h2>
              <p className="text-sm text-zinc-600 mt-1">
                Informasi penting mengenai pemesanan, pembayaran, dan pengiriman.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl border border-zinc-200/80 bg-zinc-50/50">
                <h3 className="text-sm font-bold text-zinc-900">Bagaimana proses pembayaran pesanan?</h3>
                <p className="text-xs sm:text-sm text-zinc-600 mt-2 leading-relaxed">
                  Didukung aman melalui Xendit Payment Gateway menggunakan QRIS (GoPay, OVO, ShopeePay), Virtual Account Bank (BCA, Mandiri, BRI, BNI), dan Kartu Kredit.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-zinc-200/80 bg-zinc-50/50">
                <h3 className="text-sm font-bold text-zinc-900">Berapa lama estimasi pengiriman?</h3>
                <p className="text-xs sm:text-sm text-zinc-600 mt-2 leading-relaxed">
                  Pesanan sebelum pukul 15.00 WIB dikirim pada hari yang sama. Estimasi tiba wilayah Jabodetabek 1-2 hari kerja, dan wilayah lain 2-4 hari kerja.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-zinc-200/80 bg-zinc-50/50">
                <h3 className="text-sm font-bold text-zinc-900">Apakah seluruh produk bergaransi resmi?</h3>
                <p className="text-xs sm:text-sm text-zinc-600 mt-2 leading-relaxed">
                  Semua produk memiliki garansi resmi 1 tahun untuk kerusakan manufaktur dan suku cadang asli.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-zinc-200/80 bg-zinc-50/50">
                <h3 className="text-sm font-bold text-zinc-900">Bagaimana cara memantau pesanan?</h3>
                <p className="text-xs sm:text-sm text-zinc-600 mt-2 leading-relaxed">
                  Setelah pembayaran terverifikasi, konfirmasi otomatis dikirimkan ke email Anda beserta nomor resi untuk pelacakan langsung.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
