export interface ProductVariant {
  id: string
  name?: string
  sku?: string
  color?: string | null
  size?: string | null
  price: number
  stock: number
  productId?: string
}

export interface ProductImage {
  id: string
  url: string
  altText?: string | null
  order: number
  productId?: string
  createdAt?: string
}

export interface ProductCategory {
  id: string
  name: string
  slug: string
}

export interface Category {
  id: string
  name: string
  slug: string
  tag: string
  itemCount: number
  image: string
}

export interface Product {
  id: string
  name: string
  title: string
  slug: string
  description?: string | null
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
  categoryId?: string | null
  category?: string | ProductCategory | null
  categorySlug?: string
  price: number
  originalPrice?: number
  rating: number
  reviewsCount: number
  badge?: string
  images: (ProductImage | string)[]
  specs: { label: string; value: string }[]
  variants: ProductVariant[]
}

export interface CartItem {
  product: Product
  variant: ProductVariant
  quantity: number
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function getProductTotalStock(product: Product): number {
  return product.variants.reduce((acc, v) => acc + (v.stock || 0), 0)
}

export function getProductPriceRange(product: Product): string {
  if (!product.variants || product.variants.length === 0) return "Rp 0"
  const prices = product.variants.map((v) => Number(v.price) || 0)
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  if (min === max) {
    return formatRupiah(min)
  }
  return `${formatRupiah(min)} – ${formatRupiah(max)}`
}

export function getProductCoverImage(product: Product): ProductImage | undefined {
  if (!product.images || product.images.length === 0) return undefined
  const first = product.images[0]
  if (typeof first === "string") {
    return { id: "img-0", url: first, altText: product.name || product.title, order: 0 }
  }
  const imageObjects = product.images.filter(
    (img): img is ProductImage => typeof img !== "string"
  )
  if (imageObjects.length === 0) {
    return { id: "img-0", url: String(first), altText: product.name || product.title, order: 0 }
  }
  return [...imageObjects].sort((a, b) => a.order - b.order)[0]
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
    tag: "Presisi",
    itemCount: 12,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
  },
  {
    id: "cat-4",
    name: "Kacamata Desain",
    slug: "kacamata-desain",
    tag: "Eksklusif",
    itemCount: 15,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80",
  },
]

export const DEFAULT_CATEGORIES: ProductCategory[] = [
  { id: "cat-audio", name: "Audio Minimalis", slug: "audio-minimalis" },
  { id: "cat-edc", name: "Everyday Carry", slug: "everyday-carry" },
  { id: "cat-watches", name: "Jam Tangan", slug: "jam-tangan" },
  { id: "cat-eyewear", name: "Kacamata Desain", slug: "kacamata-desain" },
]

export const PRODUCTS: Product[] = [
  {
    id: "prd-1",
    name: "Aura Studio ANC 2.0",
    title: "Aura Studio ANC 2.0",
    slug: "aura-studio-anc-2",
    category: "Audio Minimalis",
    categorySlug: "audio-minimalis",
    price: 1850000,
    originalPrice: 2200000,
    rating: 4.9,
    reviewsCount: 128,
    badge: "Pilihan Editor",
    isActive: true,
    createdAt: "2025-01-15T08:00:00Z",
    updatedAt: "2025-02-10T11:30:00Z",
    images: [
      {
        id: "img-1a",
        url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&q=80",
        altText: "Aura Studio ANC Black",
        order: 0,
      },
      {
        id: "img-1b",
        url: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=1000&q=80",
        altText: "Aura Studio ANC Side View",
        order: 1,
      },
    ],
    description:
      "Headphone nirkabel dengan Active Noise Cancellation hibrida, driver akustik Beryllium 40mm, dan daya tahan baterai hingga 45 jam pemakaian nonstop.",
    specs: [
      { label: "Driver Akustik", value: "40mm Beryllium Diaphragm" },
      { label: "Konektivitas", value: "Bluetooth 5.3 & AUX 3.5mm" },
      { label: "Daya Tahan Baterai", value: "45 Jam (ANC On)" },
      { label: "Bobot", value: "245 gram" },
    ],
    variants: [
      { id: "v1-1", name: "Matte Black", sku: "AUR-ANC-BLK", color: "Hitam", price: 1850000, stock: 15 },
      { id: "v1-2", name: "Silver Ash", sku: "AUR-ANC-SLV", color: "Abu-abu", price: 1850000, stock: 8 },
    ],
  },
  {
    id: "prd-2",
    name: "Vanguard Minimalist Backpack",
    title: "Vanguard Minimalist Backpack",
    slug: "vanguard-minimalist-backpack",
    category: "Everyday Carry",
    categorySlug: "everyday-carry",
    price: 950000,
    rating: 4.8,
    reviewsCount: 94,
    badge: "Terlaris",
    isActive: true,
    createdAt: "2025-01-20T09:00:00Z",
    updatedAt: "2025-02-01T14:15:00Z",
    images: [
      {
        id: "img-2a",
        url: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=1000&q=80",
        altText: "Vanguard Backpack Front",
        order: 0,
      },
    ],
    description:
      "Tas punggung tahan air dengan kompartemen laptop hingga 16 inci, saku tersembunyi berfitur RFID blocking, dan ritsleting YKK Aquaguard.",
    specs: [
      { label: "Material Luar", value: "Cordura 500D Waterproof" },
      { label: "Kapasitas", value: "20 Liter" },
      { label: "Slot Laptop", value: "Hingga MacBook Pro 16 inci" },
      { label: "Ritsleting", value: "YKK Aquaguard Seal" },
    ],
    variants: [
      { id: "v2-1", name: "Charcoal Grey", sku: "VNG-BPK-GRY", color: "Abu-abu", price: 950000, stock: 20 },
      { id: "v2-2", name: "Deep Navy", sku: "VNG-BPK-NVY", color: "Biru Gelap", price: 950000, stock: 12 },
    ],
  },
  {
    id: "prd-3",
    name: "Chronos Automatic Sapphire",
    title: "Chronos Automatic Sapphire",
    slug: "chronos-automatic-sapphire",
    category: "Jam Tangan",
    categorySlug: "jam-tangan",
    price: 3400000,
    originalPrice: 3800000,
    rating: 5.0,
    reviewsCount: 41,
    badge: "Eksklusif",
    isActive: true,
    createdAt: "2025-01-25T11:00:00Z",
    updatedAt: "2025-02-08T18:20:00Z",
    images: [
      {
        id: "img-3a",
        url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1000&q=80",
        altText: "Chronos Watch Sapphire",
        order: 0,
      },
    ],
    description:
      "Jam tangan mekanis otomatis dengan kaca kristal safir anti gores, movement otomatis Jepang berkekuatan cadangan 42 jam, dan bodi stainless steel 316L.",
    specs: [
      { label: "Movement", value: "Automatic Caliber NH35A" },
      { label: "Kaca", value: "Sapphire Crystal AR Coated" },
      { label: "Water Resistance", value: "10 ATM / 100 Meter" },
      { label: "Diameter Case", value: "40mm" },
    ],
    variants: [
      { id: "v3-1", name: "Steel Silver", sku: "CHR-AUT-SLV", color: "Perak", price: 3400000, stock: 5 },
      { id: "v3-2", name: "Gunmetal", sku: "CHR-AUT-GUN", color: "Gunmetal", price: 3600000, stock: 3 },
    ],
  },
  {
    id: "prd-4",
    name: "Optica Titanium Frame",
    title: "Optica Titanium Frame",
    slug: "optica-titanium-frame",
    category: "Kacamata Desain",
    categorySlug: "kacamata-desain",
    price: 1250000,
    rating: 4.7,
    reviewsCount: 63,
    isActive: true,
    createdAt: "2025-01-28T12:00:00Z",
    updatedAt: "2025-02-09T09:40:00Z",
    images: [
      {
        id: "img-4a",
        url: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=1000&q=80",
        altText: "Optica Titanium Glasses",
        order: 0,
      },
    ],
    description:
      "Bingkai kacamata ultraringat berbahan murni Titanium Grade 5 seberat hanya 14 gram. Tahan korosi, fleksibel, dan sangat nyaman dipakai seharian.",
    specs: [
      { label: "Material Rangka", value: "Titanium Grade 5" },
      { label: "Bobot Total", value: "14 gram" },
      { label: "Tipe Engsel", value: "Screwless Precision Hinge" },
      { label: "Nosepad", value: "Medical Grade Silicone" },
    ],
    variants: [
      { id: "v4-1", name: "Raw Titanium", sku: "OPT-TIT-RAW", color: "Titanium", price: 1250000, stock: 10 },
      { id: "v4-2", name: "Midnight Black", sku: "OPT-TIT-BLK", color: "Hitam", price: 1250000, stock: 7 },
    ],
  },
  {
    id: "prd-5",
    name: "Pulse Portable Hi-Fi DAC",
    title: "Pulse Portable Hi-Fi DAC",
    slug: "pulse-portable-hifi-dac",
    category: "Audio Minimalis",
    categorySlug: "audio-minimalis",
    price: 820000,
    originalPrice: 950000,
    rating: 4.9,
    reviewsCount: 88,
    badge: "Audiofil",
    isActive: true,
    createdAt: "2025-02-01T13:00:00Z",
    updatedAt: "2025-02-10T10:10:00Z",
    images: [
      {
        id: "img-5a",
        url: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=1000&q=80",
        altText: "Pulse DAC Device",
        order: 0,
      },
    ],
    description:
      "Penguat audio DAC portabel berkemampuan decoding audio hingga 32-bit/384kHz DSD256. Kompatibel dengan iPhone, Android, Mac, dan Windows tanpa driver tambahan.",
    specs: [
      { label: "Chipset DAC", value: "Dual CS43131 High-Res" },
      { label: "Output Port", value: "3.5mm SE & 4.4mm Balanced" },
      { label: "Daya Output", value: "240mW @ 32 Ohm" },
      { label: "Konektor Input", value: "USB Type-C" },
    ],
    variants: [
      { id: "v5-1", name: "Anodized Grey", sku: "PLS-DAC-GRY", color: "Abu-abu", price: 820000, stock: 14 },
    ],
  },
  {
    id: "prd-6",
    name: "Strata Leather Cardholder",
    title: "Strata Leather Cardholder",
    slug: "strata-leather-cardholder",
    category: "Everyday Carry",
    categorySlug: "everyday-carry",
    price: 420000,
    rating: 4.6,
    reviewsCount: 52,
    isActive: true,
    createdAt: "2025-02-05T15:00:00Z",
    updatedAt: "2025-02-11T15:30:00Z",
    images: [
      {
        id: "img-6a",
        url: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=1000&q=80",
        altText: "Strata Leather Cardholder",
        order: 0,
      },
    ],
    description:
      "Dompet kartu ringkas terbuat dari kulit sapi nabati Italia (Vegetable Tanned Leather) yang menghasilkan patina indah seiring pemakaian waktu.",
    specs: [
      { label: "Material", value: "Italian Vegetable Tanned Leather" },
      { label: "Kapasitas Kartu", value: "6 Kartu + 1 Slot Uang Kertas" },
      { label: "Dimensi", value: "10 cm x 7 cm x 0.4 cm" },
      { label: "Jahitan", value: "Waxed Linen Hand-stitched" },
    ],
    variants: [
      { id: "v6-1", name: "Cognac Tan", sku: "STR-CRD-TAN", color: "Cokelat Tan", price: 420000, stock: 25 },
      { id: "v6-2", name: "Espresso Brown", sku: "STR-CRD-BRN", color: "Cokelat Tua", price: 420000, stock: 18 },
    ],
  },
]

export const initialProducts: Product[] = PRODUCTS

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug)
}
