import Image from "next/image"
import Link from "next/link"
import { type Product, formatRupiah } from "@/data/products-data"

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group bg-white rounded-2xl border border-zinc-200 overflow-hidden hover:border-zinc-300 hover:shadow-md transition-all flex flex-col">
      {/* Product Image */}
      <Link href={`/products/${product.slug}`} className="relative aspect-4/3 overflow-hidden bg-zinc-50 block">
        <Image
          src={product.images[0]}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.badge && (
          <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-zinc-900 font-bold text-[11px] px-2.5 py-1 rounded-full shadow-xs border border-zinc-100">
            {product.badge}
          </span>
        )}
      </Link>

      {/* Product Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-zinc-600 mb-1.5">
            <span>{product.category}</span>
            <div className="flex items-center gap-1 text-amber-500 font-semibold">
              <span>★</span>
              <span>{product.rating}</span>
            </div>
          </div>

          <Link href={`/products/${product.slug}`}>
            <h3 className="font-bold text-zinc-900 group-hover:text-zinc-600 transition-colors text-base line-clamp-1">
              {product.title}
            </h3>
          </Link>

          <p className="text-xs text-zinc-600 line-clamp-2 mt-1.5 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Action */}
        <div className="pt-4 mt-4 border-t border-zinc-100 flex items-center justify-between">
          <div>
            <div className="text-base font-extrabold text-zinc-900">
              {formatRupiah(product.price)}
            </div>
            {product.originalPrice && (
              <div className="text-xs text-zinc-600 line-through">
                {formatRupiah(product.originalPrice)}
              </div>
            )}
          </div>

          <Link
            href={`/products/${product.slug}`}
            className="text-xs font-semibold px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-900 hover:text-white text-zinc-800 transition-all active:scale-95"
          >
            Lihat Detail
          </Link>
        </div>
      </div>
    </div>
  )
}
