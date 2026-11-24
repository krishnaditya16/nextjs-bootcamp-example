import type { Metadata } from "next"
import Link from "next/link"
import { Navbar } from "@/components/storefront/navbar"
import { Footer } from "@/components/storefront/footer"
import { prisma } from "@/lib/db"

export const metadata: Metadata = {
  title: "Artikel & Panduan | TOKOKITA",
  description: "Kumpulan artikel, tips, dan panduan teknis belanja di Tokokita.",
}

export default async function ArticlesPage() {
  const articles = await prisma.article.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  })

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
          <span className="text-zinc-900 font-medium">Artikel</span>
        </nav>

        {/* Header */}
        <div className="max-w-3xl mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900">
            Artikel & Panduan
          </h1>
          <p className="text-sm sm:text-base text-zinc-600 mt-2 leading-relaxed">
            Eksplorasi wawasan seputar teknologi, panduan perawatan produk, dan
            pembaruan sistem Tokokita.
          </p>
        </div>

        {/* Articles Grid */}
        {articles.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-zinc-200/80">
            <p className="text-sm font-semibold text-zinc-900">
              Belum ada artikel yang dipublikasikan.
            </p>
            <Link
              href="/"
              className="inline-block mt-4 text-xs font-semibold px-4 py-2 bg-zinc-900 text-white rounded-xl"
            >
              Kembali ke Beranda
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <article
                key={article.id}
                className="bg-white rounded-2xl border border-zinc-200/80 p-6 flex flex-col justify-between hover:border-zinc-300 transition-all"
              >
                <div>
                  <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                    {new Date(article.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>

                  <h2 className="text-lg font-bold text-zinc-900 mt-2 hover:text-zinc-600 transition-colors">
                    <Link href={`/articles/${article.slug}`}>
                      {article.title}
                    </Link>
                  </h2>

                  <p className="text-xs sm:text-sm text-zinc-600 mt-3 line-clamp-3 leading-relaxed">
                    {article.content}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-zinc-100 flex items-center justify-between">
                  <Link
                    href={`/articles/${article.slug}`}
                    className="text-xs font-semibold text-zinc-900 hover:text-zinc-600 flex items-center gap-1 group"
                  >
                    <span>Baca Selengkapnya</span>
                    <span className="transition-transform group-hover:translate-x-1">
                      &rarr;
                    </span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
