import Link from "next/link"
import Image from "next/image"
import { Navbar } from "@/components/storefront/navbar"
import { Footer } from "@/components/storefront/footer"
import { ProductCard } from "@/components/storefront/product-card"
import { CATEGORIES, PRODUCTS } from "@/data/products-data"

export default function Home() {
  const featuredProducts = PRODUCTS.slice(0, 4)
  const newArrivals = PRODUCTS.slice(2, 6)

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">
      <Navbar />

      <main className="flex-1">
        {/* 1. Hero Section */}
        <section className="bg-white border-b border-zinc-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-xs font-semibold text-zinc-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Koleksi Pilihan 2026 Tersedia Sekarang
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
                    className="bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-sm px-7 py-3.5 rounded-xl transition-all shadow-xs active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2"
                  >
                    Jelajahi Katalog
                  </Link>
                  <a
                    href="#categories"
                    className="bg-white hover:bg-zinc-100 border border-zinc-300 text-zinc-800 font-semibold text-sm px-6 py-3.5 rounded-xl transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900"
                  >
                    Pilihan Kategori
                  </a>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-6 pt-8 border-t border-zinc-100 max-w-md">
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-zinc-900 tabular-nums">4.9 / 5</div>
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
                    sizes="(max-width: 1024px) 100vw, 500px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                    <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider">
                      Rekomendasi Utama
                    </span>
                    <h2 className="text-xl font-bold">Aura Studio ANC 2.0</h2>
                    <p className="text-xs text-zinc-300 mt-1">Driver Beryllium 40mm • ANC Hibrida</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Promo Banner Section (#promo) */}
        <section id="promo" className="py-12 bg-zinc-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 rounded-3xl bg-linear-to-r from-zinc-900 to-zinc-800 border border-zinc-800">
              <div className="space-y-2 text-center md:text-left">
                <span className="bg-amber-400 text-zinc-950 font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                  Promo Terbatas
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Diskon 15% untuk Transaksi Pertamamu
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 max-w-lg leading-relaxed">
                  Gunakan kode voucher saat checkout dan nikmati perlengkapan kerja impianmu dengan harga spesial.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-3 text-center">
                  <div className="text-[10px] text-zinc-400 uppercase tracking-widest font-semibold">Kode Voucher</div>
                  <div className="text-base font-bold text-amber-300 tracking-wider">TOKOKITA26</div>
                </div>
                <Link
                  href="/products"
                  className="bg-white hover:bg-zinc-100 text-zinc-900 font-bold text-xs sm:text-sm px-6 py-3.5 rounded-2xl transition-all shadow-sm active:scale-95"
                >
                  Belanja Sekarang
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Featured Categories (#categories) */}
        <section id="categories" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900">
                Pilihan Kategori
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 mt-1">
                Koleksi produk terbagi dalam kategori esensial harian.
              </p>
            </div>
            <Link
              href="/products"
              className="text-xs sm:text-sm font-semibold text-zinc-900 hover:text-zinc-600 transition-colors"
            >
              Lihat Semua Katalog &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="group relative rounded-2xl overflow-hidden aspect-4/3 bg-zinc-100 border border-zinc-200 shadow-xs block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900"
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent flex flex-col justify-end p-5 text-white">
                  <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider">
                    {cat.tag}
                  </span>
                  <h3 className="text-lg font-bold mt-0.5">{cat.name}</h3>
                  <span className="text-xs text-zinc-300 mt-0.5">{cat.itemCount} Pilihan Produk</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 4. Best Sellers */}
        <section className="bg-white border-y border-zinc-200 py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900">
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

        {/* 5. Koleksi Baru (#new-arrivals) */}
        <section id="new-arrivals" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900">
                Rilisan &amp; Koleksi Baru
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 mt-1">
                Eksplorasi lini produk terbaru dengan spesifikasi dan material terdepan.
              </p>
            </div>
            <Link
              href="/products"
              className="text-xs sm:text-sm font-semibold text-zinc-900 hover:text-zinc-600 transition-colors"
            >
              Lihat Selengkapnya &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* 6. Brand Story & Craftsmanship (#about) */}
        <section id="about" className="bg-white border-t border-zinc-200 py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 space-y-5">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight leading-tight">
                  Kualitas Material Tanpa Kompromi
                </h2>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  Tokokita lahir dari kebutuhan akan perlengkapan harian yang tidak hanya indah secara visual, tetapi juga tangguh dan memiliki integritas mekanik tinggi.
                </p>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  Dari Grade 5 Titanium pada kacamata hingga Beryllium acoustic driver pada seri audio, kami kurasi setiap produk dengan ketelitian penuh agar tahan digunakan bertahun-tahun.
                </p>
                <div className="pt-2 flex items-center gap-8">
                  <div>
                    <div className="text-2xl font-bold text-zinc-900">100%</div>
                    <div className="text-xs text-zinc-600">Material Teruji</div>
                  </div>
                  <div className="h-8 w-px bg-zinc-200" />
                  <div>
                    <div className="text-2xl font-bold text-zinc-900">14 Hari</div>
                    <div className="text-xs text-zinc-600">Garansi Kepuasan</div>
                  </div>
                  <div className="h-8 w-px bg-zinc-200" />
                  <div>
                    <div className="text-2xl font-bold text-zinc-900">24/7</div>
                    <div className="text-xs text-zinc-600">Layanan Pelanggan</div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="relative rounded-3xl overflow-hidden aspect-16/10 bg-zinc-100 border border-zinc-200 shadow-sm">
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
          </div>
        </section>

        {/* 7. Help & FAQ Section (#help) */}
        <section id="help" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900">
              Pusat Bantuan &amp; FAQ
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 mt-1">
              Jawaban cepat untuk pertanyaan yang sering diajukan pembeli.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-xs">
              <h3 className="text-sm font-bold text-zinc-900">Bagaimana proses pembayaran pesanan?</h3>
              <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
                Pembayaran didukung otomatis oleh Xendit Payment Gateway melalui QRIS (GoPay, OVO, ShopeePay), Virtual Account Bank (BCA, Mandiri, BRI, BNI), dan Kartu Kredit.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-xs">
              <h3 className="text-sm font-bold text-zinc-900">Berapa lama estimasi pengiriman?</h3>
              <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
                Pesanan yang dikonfirmasi sebelum jam 15.00 WIB akan dikirim pada hari yang sama. Estimasi tiba di wilayah Jabodetabek 1-2 hari kerja, dan kota lain 2-4 hari kerja.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-xs">
              <h3 className="text-sm font-bold text-zinc-900">Apakah seluruh produk bergaransi resmi?</h3>
              <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
                Ya, seluruh produk Tokokita memiliki garansi resmi minimal 1 tahun untuk kerusakan manufaktur dan penggantian komponen asli.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-xs">
              <h3 className="text-sm font-bold text-zinc-900">Bagaimana cara melacak pesanan?</h3>
              <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
                Setelah transaksi berstatus lunas, kamu akan menerima bukti pembayaran melalui email dan nomor resi pengiriman dapat dipantau langsung di halaman rincian pesanan.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
