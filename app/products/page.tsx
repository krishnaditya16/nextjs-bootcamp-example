"use client"

import { useState, useMemo, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/storefront/navbar"
import { Footer } from "@/components/storefront/footer"
import { ProductCard } from "@/components/storefront/product-card"
import { CATEGORIES, PRODUCTS } from "@/data/products-data"

type PriceRangeKey = "all" | "under-1m" | "1m-2.5m" | "above-2.5m" | "custom"

function CatalogContent() {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get("category") || "all"

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory)
  const [searchQuery, setSearchQuery] = useState("")
  const [priceRange, setPriceRange] = useState<PriceRangeKey>("all")
  const [customMinPrice, setCustomMinPrice] = useState<string>("")
  const [customMaxPrice, setCustomMaxPrice] = useState<string>("")
  const [minRating, setMinRating] = useState<number>(0)
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false)
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "rating">("featured")

  // Mobile filter drawer state
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (selectedCategory !== "all") count++
    if (priceRange !== "all") count++
    if (minRating > 0) count++
    if (onlyInStock) count++
    if (searchQuery.trim().length > 0) count++
    return count
  }, [selectedCategory, priceRange, minRating, onlyInStock, searchQuery])

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategory("all")
    setSearchQuery("")
    setPriceRange("all")
    setCustomMinPrice("")
    setCustomMaxPrice("")
    setMinRating(0)
    setOnlyInStock(false)
    setSortBy("featured")
  }

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Category filter
      const matchesCategory =
        selectedCategory === "all" || product.categorySlug === selectedCategory

      // Search query filter
      const query = searchQuery.toLowerCase().trim()
      const categoryName = typeof product.category === "object" && product.category !== null ? product.category.name : (product.category || "")
      const matchesSearch =
        query === "" ||
        product.title.toLowerCase().includes(query) ||
        (product.description || "").toLowerCase().includes(query) ||
        categoryName.toLowerCase().includes(query)

      // Price range filter
      let matchesPrice = true
      if (priceRange === "under-1m") {
        matchesPrice = product.price < 1000000
      } else if (priceRange === "1m-2.5m") {
        matchesPrice = product.price >= 1000000 && product.price <= 2500000
      } else if (priceRange === "above-2.5m") {
        matchesPrice = product.price > 2500000
      } else if (priceRange === "custom") {
        const min = customMinPrice ? parseFloat(customMinPrice) : 0
        const max = customMaxPrice ? parseFloat(customMaxPrice) : Infinity
        matchesPrice = product.price >= min && product.price <= max
      }

      // Rating filter
      const matchesRating = minRating === 0 || product.rating >= minRating

      // In stock filter
      const hasStock = product.variants.some((v) => v.stock > 0)
      const matchesStock = !onlyInStock || hasStock

      return matchesCategory && matchesSearch && matchesPrice && matchesRating && matchesStock
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price
      if (sortBy === "price-desc") return b.price - a.price
      if (sortBy === "rating") return b.rating - a.rating
      return 0
    })
  }, [
    selectedCategory,
    searchQuery,
    priceRange,
    customMinPrice,
    customMaxPrice,
    minRating,
    onlyInStock,
    sortBy,
  ])

  // Sidebar filter JSX used in both desktop sidebar and mobile drawer
  const filterControls = (
    <div className="space-y-6 text-sm">
      {/* Category Section */}
      <div>
        <h3 className="font-semibold text-zinc-900 text-xs uppercase tracking-wider mb-3">
          Kategori
        </h3>
        <div className="space-y-1.5">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left ${
              selectedCategory === "all"
                ? "bg-zinc-900 text-white font-semibold"
                : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
            }`}
          >
            <span>Semua Kategori</span>
            <span
              className={`text-[11px] px-2 py-0.5 rounded-full ${
                selectedCategory === "all" ? "bg-zinc-800 text-zinc-200" : "bg-zinc-100 text-zinc-500"
              }`}
            >
              {PRODUCTS.length}
            </span>
          </button>
          {CATEGORIES.map((cat) => {
            const count = PRODUCTS.filter((p) => p.categorySlug === cat.slug).length
            const isSelected = selectedCategory === cat.slug
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left ${
                  isSelected
                    ? "bg-zinc-900 text-white font-semibold"
                    : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full ${
                    isSelected ? "bg-zinc-800 text-zinc-200" : "bg-zinc-100 text-zinc-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="h-px bg-zinc-200/80" />

      {/* Price Range Section */}
      <div>
        <h3 className="font-semibold text-zinc-900 text-xs uppercase tracking-wider mb-3">
          Rentang Harga
        </h3>
        <div className="space-y-2 text-xs">
          {[
            { id: "all", label: "Semua Harga" },
            { id: "under-1m", label: "Di bawah Rp 1.000.000" },
            { id: "1m-2.5m", label: "Rp 1.000.000 – Rp 2.500.000" },
            { id: "above-2.5m", label: "Di atas Rp 2.500.000" },
            { id: "custom", label: "Kustom" },
          ].map((item) => (
            <label
              key={item.id}
              className="flex items-center gap-2.5 text-zinc-700 hover:text-zinc-950 cursor-pointer"
            >
              <input
                type="radio"
                name="priceRange"
                value={item.id}
                checked={priceRange === item.id}
                onChange={() => setPriceRange(item.id as PriceRangeKey)}
                className="w-4 h-4 text-zinc-900 border-zinc-300 focus:ring-zinc-900"
              />
              <span>{item.label}</span>
            </label>
          ))}

          {/* Custom Price Inputs */}
          {priceRange === "custom" && (
            <div className="pt-3 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-zinc-500 block mb-1">Min (Rp)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={customMinPrice}
                    onChange={(e) => setCustomMinPrice(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-zinc-300 rounded-lg focus:outline-none focus:border-zinc-900"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-zinc-500 block mb-1">Maks (Rp)</label>
                  <input
                    type="number"
                    placeholder="Maks"
                    value={customMaxPrice}
                    onChange={(e) => setCustomMaxPrice(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-zinc-300 rounded-lg focus:outline-none focus:border-zinc-900"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="h-px bg-zinc-200/80" />

      {/* Minimum Rating */}
      <div>
        <h3 className="font-semibold text-zinc-900 text-xs uppercase tracking-wider mb-3">
          Rating Pembeli
        </h3>
        <div className="space-y-2 text-xs">
          {[
            { value: 0, label: "Semua Rating" },
            { value: 4.8, label: "4.8★ ke atas" },
            { value: 4.5, label: "4.5★ ke atas" },
          ].map((item) => (
            <label
              key={item.value}
              className="flex items-center gap-2.5 text-zinc-700 hover:text-zinc-950 cursor-pointer"
            >
              <input
                type="radio"
                name="ratingFilter"
                value={item.value}
                checked={minRating === item.value}
                onChange={() => setMinRating(item.value)}
                className="w-4 h-4 text-zinc-900 border-zinc-300 focus:ring-zinc-900"
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="h-px bg-zinc-200/80" />

      {/* Availability Toggle */}
      <div>
        <h3 className="font-semibold text-zinc-900 text-xs uppercase tracking-wider mb-3">
          Ketersediaan
        </h3>
        <label className="flex items-center gap-2.5 text-xs text-zinc-700 hover:text-zinc-950 cursor-pointer">
          <input
            type="checkbox"
            checked={onlyInStock}
            onChange={(e) => setOnlyInStock(e.target.checked)}
            className="w-4 h-4 text-zinc-900 rounded border-zinc-300 focus:ring-zinc-900"
          />
          <span>Hanya stok tersedia</span>
        </label>
      </div>

      {/* Reset Filter Button */}
      {activeFiltersCount > 0 && (
        <div className="pt-2">
          <button
            onClick={resetFilters}
            className="w-full py-2.5 px-3 rounded-xl border border-zinc-300 text-zinc-700 hover:bg-zinc-100 text-xs font-medium transition-colors text-center"
          >
            Reset Semua Filter ({activeFiltersCount})
          </button>
        </div>
      )}
    </div>
  )

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
          <span className="text-zinc-900 font-medium">Katalog Produk</span>
        </nav>

        {/* Catalog Main Layout: Left Sidebar + Right Products */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-start">
          {/* Desktop Left Sidebar Filter */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-24 bg-white rounded-2xl border border-zinc-200/80 p-6">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-100">
              <h2 className="text-sm font-bold text-zinc-900">Filter Produk</h2>
              {activeFiltersCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-zinc-500 hover:text-zinc-900 font-medium"
                >
                  Hapus Filter
                </button>
              )}
            </div>
            {filterControls}
          </aside>

          {/* Right Product Grid Column */}
          <section className="lg:col-span-9 space-y-6">
            {/* Header Toolbar: Search + Controls */}
            <div className="bg-white rounded-2xl border border-zinc-200/80 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Cari nama produk, kategori, atau fitur..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-9 pr-8 py-2 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:bg-white focus:border-zinc-900 transition-all"
                />
                <svg
                  className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-zinc-700 text-xs"
                    aria-label="Hapus kata kunci pencarian"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Mobile Filter Button & Sort Selector */}
              <div className="flex items-center gap-3 justify-between sm:justify-end">
                {/* Mobile Filter Trigger */}
                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-800 hover:bg-zinc-50 transition-colors"
                >
                  <svg className="w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  <span>Filter</span>
                  {activeFiltersCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-zinc-900 text-white text-[10px] flex items-center justify-center font-bold">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>

                {/* Sort Selector */}
                <div className="flex items-center gap-2">
                  <label htmlFor="sort-by" className="text-xs text-zinc-500 font-medium hidden sm:inline">
                    Urutkan:
                  </label>
                  <select
                    id="sort-by"
                    aria-label="Urutkan produk"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                    className="bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs font-medium text-zinc-800 focus:outline-none focus:border-zinc-900"
                  >
                    <option value="featured">Unggulan</option>
                    <option value="price-asc">Harga: Rendah ke Tinggi</option>
                    <option value="price-desc">Harga: Tinggi ke Rendah</option>
                    <option value="rating">Rating Tertinggi</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Active Filters Badges & Result Count */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-zinc-500">
                Menampilkan <strong className="text-zinc-900 font-semibold">{filteredProducts.length}</strong> dari {PRODUCTS.length} produk
              </span>

              {/* Active Filter Badges */}
              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  {selectedCategory !== "all" && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-200/80 text-zinc-800 font-medium">
                      <span>{CATEGORIES.find((c) => c.slug === selectedCategory)?.name || selectedCategory}</span>
                      <button onClick={() => setSelectedCategory("all")} className="hover:text-black">×</button>
                    </span>
                  )}
                  {priceRange !== "all" && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-200/80 text-zinc-800 font-medium">
                      <span>Harga disaring</span>
                      <button onClick={() => setPriceRange("all")} className="hover:text-black">×</button>
                    </span>
                  )}
                  {minRating > 0 && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-200/80 text-zinc-800 font-medium">
                      <span>&ge; {minRating}★</span>
                      <button onClick={() => setMinRating(0)} className="hover:text-black">×</button>
                    </span>
                  )}
                  {onlyInStock && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-200/80 text-zinc-800 font-medium">
                      <span>Stok Tersedia</span>
                      <button onClick={() => setOnlyInStock(false)} className="hover:text-black">×</button>
                    </span>
                  )}
                  {searchQuery && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-200/80 text-zinc-800 font-medium">
                      <span>&quot;{searchQuery}&quot;</span>
                      <button onClick={() => setSearchQuery("")} className="hover:text-black">×</button>
                    </span>
                  )}
                  <button
                    onClick={resetFilters}
                    className="text-zinc-500 hover:text-zinc-900 font-medium underline underline-offset-2 ml-1"
                  >
                    Hapus Semua
                  </button>
                </div>
              )}
            </div>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
              <div className="py-20 text-center bg-white rounded-2xl border border-zinc-200/80 p-8">
                <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mx-auto mb-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-zinc-900">Produk Tidak Ditemukan</h3>
                <p className="text-xs sm:text-sm text-zinc-500 mt-1 max-w-sm mx-auto">
                  Kriteria filter atau pencarian Anda tidak cocok dengan produk yang tersedia.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-4 px-4 py-2 bg-zinc-900 text-white rounded-xl text-xs font-medium hover:bg-zinc-800 transition-colors"
                >
                  Reset Semua Filter
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Mobile Filter Slide-over Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileFilterOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-full max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 p-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-100">
              <h2 className="text-base font-bold text-zinc-900">Filter Katalog</h2>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-zinc-600 rounded-lg"
                aria-label="Tutup filter"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {filterControls}

            <div className="pt-6 mt-6 border-t border-zinc-100">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-3 bg-zinc-900 text-white rounded-xl text-xs font-semibold hover:bg-zinc-800 transition-colors"
              >
                Tampilkan {filteredProducts.length} Produk
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-50" />}>
      <CatalogContent />
    </Suspense>
  )
}
