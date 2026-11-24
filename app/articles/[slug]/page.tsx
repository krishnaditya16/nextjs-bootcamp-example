import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/storefront/navbar"
import { Footer } from "@/components/storefront/footer"
import { prisma } from "@/lib/db"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await prisma.article.findUnique({
    where: { slug, published: true },
    select: { title: true, content: true },
  })

  if (!article) return { title: "Artikel Tidak Ditemukan" }
  return {
    title: `${article.title} | TOKOKITA`,
    description: article.content.slice(0, 155),
  }
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params

  const article = await prisma.article.findUnique({
    where: { slug, published: true },
  })

  if (!article) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 w-full">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-zinc-500 mb-8">
          <Link href="/" className="hover:text-zinc-900 transition-colors">
            Beranda
          </Link>
          <span>/</span>
          <Link href="/articles" className="hover:text-zinc-900 transition-colors">
            Artikel
          </Link>
          <span>/</span>
          <span className="text-zinc-900 font-medium truncate max-w-xs">
            {article.title}
          </span>
        </nav>

        {/* Article Container */}
        <article className="bg-white rounded-2xl border border-zinc-200/80 p-8 sm:p-12 shadow-xs">
          <header className="space-y-4 mb-8 pb-8 border-b border-zinc-100">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Dipublikasikan pada{" "}
              {new Date(article.createdAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 leading-tight [text-wrap:balance]">
              {article.title}
            </h1>
          </header>

          {/* Content */}
          <div className="prose prose-zinc max-w-none text-zinc-700 leading-relaxed space-y-4 text-sm sm:text-base">
            <p className="whitespace-pre-line">{article.content}</p>
          </div>

          {/* Footer Navigation */}
          <footer className="mt-12 pt-8 border-t border-zinc-100 flex items-center justify-between">
            <Link
              href="/articles"
              className="text-xs font-semibold text-zinc-700 hover:text-zinc-950 flex items-center gap-1.5"
            >
              <span>&larr;</span>
              <span>Kembali ke Daftar Artikel</span>
            </Link>

            <Link
              href="/products"
              className="text-xs font-semibold px-4 py-2 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-colors"
            >
              Jelajahi Produk
            </Link>
          </footer>
        </article>
      </main>

      <Footer />
    </div>
  )
}
