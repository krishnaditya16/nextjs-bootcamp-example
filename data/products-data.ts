export interface Category {
  id: string
  name: string
  slug: string
  tag: string
  itemCount: number
  image: string
}

export interface ProductVariant {
  id: string
  name: string
  color: string
  price: number
  stock: number
}

export interface Product {
  id: string
  slug: string
  title: string
  category: string
  categorySlug: string
  price: number
  originalPrice?: number
  rating: number
  reviewsCount: number
  badge?: string
  images: string[]
  description: string
  specs: { label: string; value: string }[]
  variants: ProductVariant[]
}

export interface CartItem {
  product: Product
  variant: ProductVariant
  quantity: number
}

export const CATEGORIES: Category[] = [
  {
    id: "cat-1",
    name: "Audio Minimalis",
    slug: "audio-minimalis",
    tag: "Terlaris",
    itemCount: 24,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
  },
  {
    id: "cat-2",
    name: "Everyday Carry",
    slug: "everyday-carry",
    tag: "Rilisan Baru",
    itemCount: 18,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80",
  },
  {
    id: "cat-3",
    name: "Jam Tangan",
    slug: "jam-tangan",
    tag: "Trending",
    itemCount: 12,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
  },
  {
    id: "cat-4",
    name: "Kacamata Desain",
    slug: "kacamata-desain",
    tag: "Pilihan Editor",
    itemCount: 16,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80",
  },
]

export const PRODUCTS: Product[] = [
  {
    id: "prod-1",
    slug: "aura-studio-anc-headphones",
    title: "Aura Studio ANC 2.0 Wireless",
    category: "Audio Minimalis",
    categorySlug: "audio-minimalis",
    price: 3499000,
    originalPrice: 3999000,
    rating: 4.9,
    reviewsCount: 142,
    badge: "Pilihan Editor",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=1000&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=1000&q=80",
    ],
    description: "Headphone wireless kelas audiofil dengan driver Beryllium 40mm, Active Noise Cancellation hibrida tingkat lanjut, dan daya tahan baterai hingga 45 jam tanpa henti.",
    specs: [
      { label: "Driver", value: "40mm Beryllium Custom Audio" },
      { label: "Baterai", value: "45 Jam Playtime (ANC Off)" },
      { label: "Konektivitas", value: "Bluetooth 5.3 + AUX 3.5mm" },
      { label: "Berat", value: "248 gram" },
    ],
    variants: [
      { id: "var-1a", name: "Matte Black", color: "#18181b", price: 3499000, stock: 15 },
      { id: "var-1b", name: "Slate Grey", color: "#71717a", price: 3499000, stock: 8 },
      { id: "var-1c", name: "Warm Gold", color: "#d97706", price: 3699000, stock: 5 },
    ],
  },
  {
    id: "prod-2",
    slug: "chronos-slate-ceramic-watch",
    title: "Chronos Slate Ceramic Timepiece",
    category: "Jam Tangan",
    categorySlug: "jam-tangan",
    price: 4899000,
    originalPrice: 5499000,
    rating: 4.8,
    reviewsCount: 89,
    badge: "Terlaris",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1000&q=80",
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=1000&q=80",
    ],
    description: "Jam tangan presisi tinggi dengan bezel keramik matte anti-gores, kaca safir cembung anti-pantul, dan movement otomatis Jepang berkekuatan cadangan daya 42 jam.",
    specs: [
      { label: "Material Bezel", value: "High-Tech Matte Ceramic" },
      { label: "Kaca", value: "Sapphire Crystal Anti-Reflective" },
      { label: "Ketahanan Air", value: "5 ATM (50 Meter)" },
      { label: "Diameter", value: "40 mm" },
    ],
    variants: [
      { id: "var-2a", name: "Obsidian Black", color: "#09090b", price: 4899000, stock: 12 },
      { id: "var-2b", name: "Titanium Silver", color: "#a1a1aa", price: 4899000, stock: 6 },
    ],
  },
  {
    id: "prod-3",
    slug: "apex-carbon-minimalist-wallet",
    title: "Apex Carbon RFID Cardholder",
    category: "Everyday Carry",
    categorySlug: "everyday-carry",
    price: 899000,
    originalPrice: 1099000,
    rating: 4.9,
    reviewsCount: 210,
    badge: "Populer",
    images: [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=1000&q=80",
    ],
    description: "Dompet kartu ramping berbahan serat karbon 3K matte asli dilengkapi pelindung RFID untuk mengamankan data kartu kredit dari pencurian nirkabel.",
    specs: [
      { label: "Kapasitas", value: "1 hingga 12 Kartu + Uang Kertas" },
      { label: "Material", value: "3K Matte Real Carbon Fiber" },
      { label: "Fitur Keamanan", value: "RFID / NFC Blocking Shell" },
      { label: "Ketebalan", value: "Hanya 6 mm saat kosong" },
    ],
    variants: [
      { id: "var-3a", name: "Raw Carbon", color: "#18181b", price: 899000, stock: 25 },
      { id: "var-3b", name: "Forged Grey", color: "#3f3f46", price: 949000, stock: 14 },
    ],
  },
  {
    id: "prod-4",
    slug: "vantage-matte-titanium-sunglasses",
    title: "Vantage Matte Titanium Sunglasses",
    category: "Kacamata Desain",
    categorySlug: "kacamata-desain",
    price: 1999000,
    originalPrice: 2399000,
    rating: 4.7,
    reviewsCount: 64,
    badge: "Pilihan Desainer",
    images: [
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=1000&q=80",
    ],
    description: "Kacamata hitam dengan bingkai Grade 5 Titanium yang ekstra ringan dan lensa polarized UV400 untuk ketajaman optik maksimal di bawah terik matahari.",
    specs: [
      { label: "Material Bingkai", value: "Grade 5 Aerospace Titanium" },
      { label: "Perlindungan Lensa", value: "Polarized UV400 + Anti-Glare" },
      { label: "Bobot", value: "Hanya 18 gram" },
    ],
    variants: [
      { id: "var-4a", name: "Midnight Black", color: "#27272a", price: 1999000, stock: 9 },
      { id: "var-4b", name: "Amber Tortoise", color: "#d97706", price: 2099000, stock: 7 },
    ],
  },
  {
    id: "prod-5",
    slug: "pulse-hi-fi-wireless-earbuds",
    title: "Pulse Hi-Fi ANC Wireless Earbuds",
    category: "Audio Minimalis",
    categorySlug: "audio-minimalis",
    price: 2199000,
    originalPrice: 2599000,
    rating: 4.8,
    reviewsCount: 97,
    badge: "Trending",
    images: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=1000&q=80",
    ],
    description: "Earbuds nirkabel dengan arsitektur dual driver akustik, Active Noise Cancellation adaptif, dan casing pengisian nirkabel bersertifikasi tahan air IPX5.",
    specs: [
      { label: "Baterai", value: "8 Jam (Earbuds) + 24 Jam (Case)" },
      { label: "Water Resistance", value: "IPX5 Splash Resistant" },
      { label: "Pengisian Daya", value: "USB-C Fast Charge + Qi Wireless" },
    ],
    variants: [
      { id: "var-5a", name: "Ceramic White", color: "#f4f4f5", price: 2199000, stock: 18 },
      { id: "var-5b", name: "Matte Black", color: "#09090b", price: 2199000, stock: 22 },
    ],
  },
  {
    id: "prod-6",
    slug: "nomad-field-automatic-timepiece",
    title: "Nomad Field Automatic Timepiece",
    category: "Jam Tangan",
    categorySlug: "jam-tangan",
    price: 3899000,
    originalPrice: 4299000,
    rating: 5.0,
    reviewsCount: 43,
    badge: "Limited Edition",
    images: [
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=1000&q=80",
    ],
    description: "Jam tangan petualang dengan dial kontras tinggi bercahaya Super-LumiNova, tali kulit sapi Italia asli, dan casing baja tahan karat 316L.",
    specs: [
      { label: "Tali Jam", value: "Genuine Italian Saddle Leather" },
      { label: "Luminositas", value: "Swiss Super-LumiNova BGW9" },
      { label: "Ketahanan Air", value: "10 ATM (100 Meter)" },
    ],
    variants: [
      { id: "var-6a", name: "Vintage Saddle Brown", color: "#78350f", price: 3899000, stock: 4 },
      { id: "var-6b", name: "Tactical Black", color: "#18181b", price: 3899000, stock: 6 },
    ],
  },
]

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug)
}
