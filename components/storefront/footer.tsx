import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white py-14 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-5 flex flex-col gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center font-bold text-sm">
              T
            </div>
            <span className="font-extrabold tracking-tight text-lg text-zinc-900">
              TOKOKITA
            </span>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed max-w-sm">
            Platform e-commerce referensi fullstack modern: menghadirkan produk audio hi-fi, timepieces, dan aksesoris gaya hidup pilihan dengan standar rekayasa terbaik.
          </p>
        </div>

        <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">
              Katalog
            </span>
            <ul className="flex flex-col gap-2 text-xs text-zinc-600">
              <li><Link href="/products" className="hover:text-zinc-900 transition-colors">Semua Produk</Link></li>
              <li><Link href="/products?category=audio-minimalis" className="hover:text-zinc-900 transition-colors">Audio Minimalis</Link></li>
              <li><Link href="/products?category=everyday-carry" className="hover:text-zinc-900 transition-colors">Everyday Carry</Link></li>
              <li><Link href="/products?category=jam-tangan" className="hover:text-zinc-900 transition-colors">Jam Tangan</Link></li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">
              Layanan
            </span>
            <ul className="flex flex-col gap-2 text-xs text-zinc-600">
              <li><span className="text-zinc-600">Garansi Resmi 1 Tahun</span></li>
              <li><span className="text-zinc-600">Pengiriman Seluruh Indonesia</span></li>
              <li><span className="text-zinc-600">Pembayaran Xendit Aman</span></li>
            </ul>
          </div>

          <div className="flex flex-col gap-3 col-span-2 sm:col-span-1">
            <span className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">
              Bantuan
            </span>
            <p className="text-xs text-zinc-600">
              Pertanyaan atau konfirmasi pesanan:
            </p>
            <span className="text-xs font-medium text-zinc-800">
              support@tokokita.id
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 mt-10 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-600 gap-3">
        <p>© 2026 Tokokita Store Inc. Seluruh Hak Cipta Dilindungi.</p>
        <p className="text-zinc-600">Kurikulum Bootcamp Fullstack Web</p>
      </div>
    </footer>
  )
}
