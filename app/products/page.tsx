import Link from "next/link"
import { Navbar } from "@/components/storefront/navbar"
import { Footer } from "@/components/storefront/footer"
import { ProductCard } from "@/components/storefront/product-card"
import { prisma } from "@/lib/db"

type StorefrontSearchParams = Promise<{
  q?: string
  category?: string
  page?: string
}>

export async function getStorefrontCatalog(
  searchParams: StorefrontSearchParams
) {
  const params = await searchParams
  const q = params.q?.trim() ?? ""
  const categorySlug = params.category?.trim() ?? ""
  const page = Math.max(1, Number(params.page ?? 1))
  const limit = 12

  const where = {
    isActive: true,
    ...(q
      ? {
          OR: [
            { name: { contains: q } },
            { description: { contains: q } },
          ],
        }
      : {}),
    ...(categorySlug ? { category: { slug: categorySlug } } : {}),
  }

  const [products, total, categories, latestArticles] =
    await prisma.$transaction([
      prisma.product.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          category: true,
          images: { orderBy: { order: "asc" }, take: 1 },
          variants: { select: { id: true, price: true, stock: true } },
        },
      }),
      prisma.product.count({ where }),
      prisma.category.findMany({
        orderBy: { name: "asc" },
        include: {
          _count: { select: { products: { where: { isActive: true } } } },
        },
      }),
      prisma.article.findMany({
        where: { published: true },
        orderBy: { createdAt: "desc" },
        take: 3,
      }),
    ])

  return {
    products,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    categories,
    latestArticles,
    q,
    categorySlug,
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: StorefrontSearchParams
}) {
  const {
    products,
    total,
    page,
    totalPages,
    categories,
    q,
    categorySlug,
  } = await getStorefrontCatalog(searchParams)

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-zinc-500 mb-6">
          <Link href="/" className="hover:text-zinc-900 transition-colors">
            Beranda
          </Link>
          <span>/</span>
          <span className="text-zinc-900 font-medium">Katalog</span>
        </nav>

        {/* Page Title & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
              Katalog Produk
            </h1>
            <p className="text-sm text-zinc-600 mt-1">
              Menampilkan {products.length} dari {total} produk aktif di database.
            </p>
          </div>

          {/* Search Form */}
          <form method="GET" action="/products" className="w-full md:w-80">
            <div className="relative">
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder="Cari nama atau deskripsi..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
              <svg
                className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5 pointer-events-none"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {categorySlug && (
                <input type="hidden" name="category" value={categorySlug} />
              )}
            </div>
          </form>
        </div>

        {/* Main Grid: Sidebar Filters & Product Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-zinc-200/80">
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-3">
                Kategori
              </h2>
              <div className="space-y-1">
                <Link
                  href={q ? `/products?q=${encodeURIComponent(q)}` : "/products"}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    !categorySlug
                      ? "bg-zinc-900 text-white font-semibold"
                      : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
                  }`}
                >
                  <span>Semua Kategori</span>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full ${
                      !categorySlug
                        ? "bg-zinc-800 text-zinc-200"
                        : "bg-zinc-100 text-zinc-500"
                    }`}
                  >
                    {total}
                  </span>
                </Link>

                {categories.map((cat) => {
                  const isSelected = categorySlug === cat.slug
                  const href = `/products?category=${cat.slug}${
                    q ? `&q=${encodeURIComponent(q)}` : ""
                  }`
                  return (
                    <Link
                      key={cat.id}
                      href={href}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                        isSelected
                          ? "bg-zinc-900 text-white font-semibold"
                          : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded-full ${
                          isSelected
                            ? "bg-zinc-800 text-zinc-200"
                            : "bg-zinc-100 text-zinc-500"
                        }`}
                      >
                        {cat._count.products}
                      </span>
                    </Link>
                  )
                })}
              </div>

              {(q || categorySlug) && (
                <div className="pt-4 mt-4 border-t border-zinc-100">
                  <Link
                    href="/products"
                    className="text-xs text-red-600 hover:text-red-700 font-medium block text-center"
                  >
                    Reset Semua Filter
                  </Link>
                </div>
              )}
            </div>
          </aside>

          {/* Product Cards Grid */}
          <div className="lg:col-span-3 space-y-8">
            {products.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-2xl border border-zinc-200/80">
                <p className="text-base font-semibold text-zinc-900">
                  Tidak ada produk ditemukan
                </p>
                <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                  Coba ubah kata kunci pencarian atau pilih kategori lain untuk
                  melihat produk yang tersedia.
                </p>
                <Link
                  href="/products"
                  className="inline-block mt-4 text-xs font-semibold px-4 py-2 bg-zinc-900 text-white rounded-xl"
                >
                  Kembali ke Semua Produk
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={{
                      ...product,
                      variants: product.variants.map((v) => ({
                        ...v,
                        price: Number(v.price),
                      })),
                    }}
                  />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-6 border-t border-zinc-200/80">
                <p className="text-xs text-zinc-500">
                  Halaman <span className="font-semibold text-zinc-900">{page}</span>{" "}
                  dari <span className="font-semibold text-zinc-900">{totalPages}</span>
                </p>

                <div className="flex items-center gap-2">
                  {page > 1 && (
                    <Link
                      href={`/products?page=${page - 1}${
                        categorySlug ? `&category=${categorySlug}` : ""
                      }${q ? `&q=${encodeURIComponent(q)}` : ""}`}
                      className="px-3 py-1.5 text-xs font-medium border border-zinc-200 rounded-lg hover:bg-zinc-100 transition-colors"
                    >
                      Sebelumnya
                    </Link>
                  )}
                  {page < totalPages && (
                    <Link
                      href={`/products?page=${page + 1}${
                        categorySlug ? `&category=${categorySlug}` : ""
                      }${q ? `&q=${encodeURIComponent(q)}` : ""}`}
                      className="px-3 py-1.5 text-xs font-medium border border-zinc-200 rounded-lg hover:bg-zinc-100 transition-colors"
                    >
                      Selanjutnya
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
