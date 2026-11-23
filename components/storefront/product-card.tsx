import Image from "next/image"
import Link from "next/link"
import { type Product, formatRupiah } from "@/data/products-data"

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group bg-white rounded-2xl border border-zinc-200/80 hover:border-zinc-300 transition-all flex flex-col overflow-hidden focus-within:ring-2 focus-within:ring-zinc-900">
      {/* Product Image */}
      <Link href={`/products/${product.slug}`} className="relative aspect-4/3 overflow-hidden bg-zinc-100 block focus:outline-none">
        <Image
          src={product.images[0]}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
        />
        {product.badge && (
          <span className="absolute top-3 left-3 bg-white/95 text-zinc-900 font-medium text-[11px] px-2.5 py-0.5 rounded-md border border-zinc-200">
            {product.badge}
          </span>
        )}
      </Link>

      {/* Product Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-zinc-500 mb-2">
            <span>{product.category}</span>
            <div className="flex items-center gap-1 font-medium text-zinc-700">
              <svg className="w-3.5 h-3.5 fill-amber-400 text-amber-400" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>{product.rating}</span>
            </div>
          </div>

          <Link href={`/products/${product.slug}`} className="focus:outline-none">
            <h3 className="font-semibold text-zinc-900 group-hover:text-zinc-600 transition-colors text-base line-clamp-1">
              {product.title}
            </h3>
          </Link>

          <p className="text-xs text-zinc-500 line-clamp-2 mt-1.5 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Action Link */}
        <div className="pt-4 mt-4 border-t border-zinc-100 flex items-center justify-between">
          <div>
            <div className="text-base font-bold text-zinc-900 tabular-nums">
              {formatRupiah(product.price)}
            </div>
            {product.originalPrice && (
              <div className="text-xs text-zinc-400 line-through tabular-nums">
                {formatRupiah(product.originalPrice)}
              </div>
            )}
          </div>

          <Link
            href={`/products/${product.slug}`}
            className="text-xs font-medium text-zinc-700 hover:text-zinc-950 flex items-center gap-1 group/link"
          >
            <span>Detail</span>
            <span className="transition-transform group-hover/link:translate-x-0.5">&rarr;</span>
          </Link>
        </div>
      </div>
    </article>
  )
}
