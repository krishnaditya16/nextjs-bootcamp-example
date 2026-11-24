import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-zinc-200/80 bg-white py-14 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-5 flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-zinc-900 text-white flex items-center justify-center font-bold text-xs">
              T
            </span>
            <span className="font-bold tracking-tight text-base text-zinc-900">
              TOKOKITA
            </span>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed max-w-sm">
            Kurasi audio, jam tangan, dan perlengkapan kerja berstandar tinggi. Dibuat dengan material tangguh untuk kenyamanan mobilitas harian.
          </p>
        </div>

        <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">
              Navigasi
            </span>
            <ul className="flex flex-col gap-2 text-xs text-zinc-600">
              <li><Link href="/products" className="hover:text-zinc-900 transition-colors">Katalog Produk</Link></li>
              <li><Link href="/#categories" className="hover:text-zinc-900 transition-colors">Kategori</Link></li>
              <li><Link href="/articles" className="hover:text-zinc-900 transition-colors">Artikel &amp; Panduan</Link></li>
              <li><Link href="/#about" className="hover:text-zinc-900 transition-colors">Tentang Kami</Link></li>
              <li><Link href="/#help" className="hover:text-zinc-900 transition-colors">Bantuan &amp; FAQ</Link></li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">
              Layanan
            </span>
            <ul className="flex flex-col gap-2 text-xs text-zinc-600">
              <li><span>Garansi Resmi 1 Tahun</span></li>
              <li><span>Pengiriman Seluruh Indonesia</span></li>
              <li><span>Pembayaran Aman Xendit</span></li>
            </ul>
          </div>

          <div className="flex flex-col gap-3 col-span-2 sm:col-span-1">
            <span className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">
              Kontak
            </span>
            <p className="text-xs text-zinc-500">
              Pertanyaan atau bantuan pesanan:
            </p>
            <span className="text-xs font-medium text-zinc-800">
              support@tokokita.id
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 mt-10 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-3">
        <p>© 2026 Tokokita Store. Seluruh Hak Cipta Dilindungi.</p>
        <p>Kurikulum Bootcamp Fullstack Web</p>
      </div>
    </footer>
  )
}
