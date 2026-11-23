"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

interface Category {
  name: string;
  tag: string;
  items: string;
  image: string;
}

interface Product {
  id: number;
  title: string;
  category: string;
  price: string;
  priceNum: number;
  originalPrice: string;
  rating: string;
  reviews: number;
  badge: string;
  image: string;
  colorOptions: string[];
  specs: string;
}

interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: string;
}

export default function Home() {
  const categories: Category[] = [
    {
      name: "Minimalist Audio",
      tag: "Best Sellers",
      items: "24 items",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    },
    {
      name: "Everyday Carry",
      tag: "New Arrivals",
      items: "18 items",
      image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80",
    },
    {
      name: "Timepieces",
      tag: "Trending",
      items: "12 items",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    },
    {
      name: "Design Eyewear",
      tag: "Featured",
      items: "30 items",
      image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80",
    },
  ];

  const products: Product[] = useMemo(
    () => [
      {
        id: 1,
        title: "Aura Studio ANC 2.0",
        category: "Minimalist Audio",
        price: "$299.00",
        priceNum: 299,
        originalPrice: "$349.00",
        rating: "4.9",
        reviews: 142,
        badge: "Featured Release",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700&q=80",
        colorOptions: ["#18181b", "#e4e4e7", "#b45309"],
        specs: "40mm Beryllium Drivers • 45h Playtime • Hybrid ANC",
      },
      {
        id: 2,
        title: "Chronos Slate Ceramic Watch",
        category: "Timepieces",
        price: "$420.00",
        priceNum: 420,
        originalPrice: "$480.00",
        rating: "4.8",
        reviews: 89,
        badge: "Best Seller",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&q=80",
        colorOptions: ["#09090b", "#71717a"],
        specs: "Automatic Movement • Sapphire Glass • 50m Water Resistant",
      },
      {
        id: 3,
        title: "Apex Carbon Minimalist Wallet",
        category: "Everyday Carry",
        price: "$79.00",
        priceNum: 79,
        originalPrice: "$95.00",
        rating: "4.9",
        reviews: 210,
        badge: "Trending",
        image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=700&q=80",
        colorOptions: ["#18181b", "#3f3f46"],
        specs: "3K Matte Carbon • RFID Blocking • 12-Card Capacity",
      },
      {
        id: 4,
        title: "Vantage Matte Titanium Sunglasses",
        category: "Design Eyewear",
        price: "$185.00",
        priceNum: 185,
        originalPrice: "$220.00",
        rating: "4.7",
        reviews: 64,
        badge: "Featured",
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=700&q=80",
        colorOptions: ["#27272a", "#d97706"],
        specs: "Grade 5 Titanium • Polarized UV400 • Anti-Glare Coating",
      },
      {
        id: 5,
        title: "Pulse Hi-Fi ANC Wireless Earbuds",
        category: "Minimalist Audio",
        price: "$189.00",
        priceNum: 189,
        originalPrice: "$219.00",
        rating: "4.8",
        reviews: 97,
        badge: "Popular",
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=700&q=80",
        colorOptions: ["#09090b", "#f4f4f5"],
        specs: "Adaptive Noise Cancelling • Qi Wireless Charging • IPX5",
      },
      {
        id: 6,
        title: "Nomad Precision Field Timepiece",
        category: "Timepieces",
        price: "$340.00",
        priceNum: 340,
        originalPrice: "$395.00",
        rating: "5.0",
        reviews: 43,
        badge: "Limited Edition",
        image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=700&q=80",
        colorOptions: ["#18181b", "#78350f"],
        specs: "Italian Leather Strap • Super-LumiNova • Anti-Magnetic",
      },
      {
        id: 7,
        title: "Optic Architectural Blue-Light Frames",
        category: "Design Eyewear",
        price: "$145.00",
        priceNum: 145,
        originalPrice: "$175.00",
        rating: "4.6",
        reviews: 52,
        badge: "Staff Pick",
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=700&q=80",
        colorOptions: ["#18181b", "#a1a1aa"],
        specs: "Handcrafted Acetate • 420nm Blue Filter • Lightweight 19g",
      },
      {
        id: 8,
        title: "Orbit Anodized Key Organiser",
        category: "Everyday Carry",
        price: "$48.00",
        priceNum: 48,
        originalPrice: "$60.00",
        rating: "4.9",
        reviews: 178,
        badge: "Essential",
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=700&q=80",
        colorOptions: ["#18181b", "#475569"],
        specs: "Aerospace 6061 Aluminum • D-Ring Clasp • Anti-Rattle",
      },
    ],
    []
  );

  // State Management
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isSignInOpen, setIsSignInOpen] = useState<boolean>(false);
  const [cart, setCart] = useState<CartItem[]>([
    {
      product: products[0],
      quantity: 1,
      selectedColor: products[0].colorOptions[0],
    },
    {
      product: products[2],
      quantity: 1,
      selectedColor: products[2].colorOptions[0],
    },
  ]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [wishlist, setWishlist] = useState<number[]>([1, 4]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState<string>("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState<boolean>(false);

  const filterCategories = [
    "All",
    "Minimalist Audio",
    "Everyday Carry",
    "Timepieces",
    "Design Eyewear",
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        activeCategory === "All" || p.category === activeCategory;
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.specs.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery, products]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const toggleWishlist = (id: number) => {
    setWishlist((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        showToast("Removed from wishlist");
        return prev.filter((item) => item !== id);
      } else {
        showToast("Added to your wishlist");
        return [...prev, id];
      }
    });
  };

  const addToCart = (product: Product, color?: string) => {
    const selectedColor = color || product.colorOptions[0];
    setCart((prev) => {
      const existing = prev.find(
        (item) =>
          item.product.id === product.id && item.selectedColor === selectedColor
      );
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.selectedColor === selectedColor
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1, selectedColor }];
    });
    showToast(`Added "${product.title}" to bag`);
    setIsCartOpen(true);
  };

  const updateCartQuantity = (
    productId: number,
    color: string,
    delta: number
  ) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId && item.selectedColor === color) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (productId: number, color: string) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(item.product.id === productId && item.selectedColor === color)
      )
    );
    showToast("Item removed from bag");
  };

  const cartTotal = useMemo(() => {
    return cart.reduce(
      (acc, item) => acc + item.product.priceNum * item.quantity,
      0
    );
  }, [cart]);

  const cartCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  const freeShippingThreshold = 150;
  const shippingProgress = Math.min(
    100,
    Math.round((cartTotal / freeShippingThreshold) * 100)
  );

  return (
    <div className="min-h-screen bg-[#000000] text-zinc-100 selection:bg-white selection:text-black font-sans relative overflow-x-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-zinc-900/95 border border-zinc-700 text-zinc-100 px-5 py-3.5 rounded-xl shadow-2xl backdrop-blur-xl">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* 1. Announcement Bar */}
      <div className="w-full bg-[#050505] border-b border-zinc-900 px-4 py-2 text-center text-xs tracking-wide text-zinc-400">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <span>Spring Season Launch: Enjoy 15% off orders with code</span>
          <span className="px-2 py-0.5 rounded bg-zinc-800/90 text-zinc-200 font-mono text-[11px] font-semibold tracking-wider">
            SPRING26
          </span>
        </div>
      </div>

      {/* 2. Navigation Bar */}
      <header className="sticky top-0 z-40 w-full bg-[#000000]/95 backdrop-blur-md border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 h-20 flex items-center justify-between gap-6">
          {/* Left: Logo & Links */}
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="h-9 w-9 rounded-lg bg-white flex items-center justify-center shadow-md">
                <span className="text-black font-black text-lg tracking-tighter">T</span>
              </div>
              <span className="font-bold tracking-tight text-xl text-white">
                TOKOKITA
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
              <a href="#products" className="hover:text-white transition-colors">
                Products
              </a>
              <a href="#categories" className="hover:text-white transition-colors">
                Categories
              </a>
              <a href="#story" className="hover:text-white transition-colors">
                Story
              </a>
              <a href="#reviews" className="hover:text-white transition-colors">
                Reviews
              </a>
            </nav>
          </div>

          {/* Right: Search, Bag, Sign In */}
          <div className="flex items-center gap-5">
            {/* Search Toggle */}
            <div className="relative">
              {isSearchOpen ? (
                <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-full px-3 py-1.5">
                  <input
                    type="text"
                    autoFocus
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none w-36 sm:w-48"
                  />
                  <button
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery("");
                    }}
                    className="text-zinc-400 hover:text-white text-xs ml-1"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="text-zinc-300 hover:text-white transition-colors p-1"
                  title="Search"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              )}
            </div>

            {/* Shopping Bag Icon with count badge */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative text-zinc-300 hover:text-white transition-colors p-1"
              title="Shopping Bag"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 h-4 w-4 bg-white text-black font-bold text-[10px] flex items-center justify-center rounded-full shadow">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Sign In Button */}
            <button
              onClick={() => setIsSignInOpen(true)}
              className="bg-white hover:bg-zinc-200 text-black font-semibold text-xs sm:text-sm px-4 sm:px-5 py-2 rounded-lg transition-all shadow-sm active:scale-95"
            >
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* 3. Hero Section (Exact Match to Reference Image) */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 flex flex-col items-start gap-7">
            {/* Status Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 text-xs font-medium text-zinc-300">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>New 2026 Collection Available Now</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-[76px] font-bold tracking-tight text-white leading-[1.05]">
              Designed for life.
              <span className="block text-zinc-500 font-bold mt-1">
                Refined for everyday.
              </span>
            </h1>

            {/* Subtitle Description */}
            <p className="text-base sm:text-lg text-zinc-400 max-w-xl leading-relaxed">
              Explore meticulously engineered essentials—from ultra-fidelity audio to bespoke everyday carry, created to enhance your daily rituals.
            </p>

            {/* Dual Action Buttons */}
            <div className="flex items-center gap-4 pt-1 w-full sm:w-auto">
              <a
                href="#products"
                className="bg-white hover:bg-zinc-200 text-black font-semibold text-sm px-6 py-3.5 rounded-xl transition-all shadow-sm active:scale-95 text-center"
              >
                Shop Collection
              </a>
              <a
                href="#categories"
                className="bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-white font-semibold text-sm px-6 py-3.5 rounded-xl transition-all active:scale-95 text-center"
              >
                Explore Categories
              </a>
            </div>

            {/* Metrics Row */}
            <div className="flex items-center gap-8 sm:gap-12 pt-8 border-t border-zinc-900 w-full max-w-lg">
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  4.9 / 5
                </div>
                <div className="text-xs text-zinc-500 mt-1">
                  Over 12,000+ Reviews
                </div>
              </div>
              <div className="h-8 w-px bg-zinc-800/80" />
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  50k+
                </div>
                <div className="text-xs text-zinc-500 mt-1">
                  Curated Customers
                </div>
              </div>
              <div className="h-8 w-px bg-zinc-800/80" />
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  100%
                </div>
                <div className="text-xs text-zinc-500 mt-1">
                  Carbon Neutral
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Signature Yellow Headphones Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[500px] aspect-square rounded-[36px] overflow-hidden bg-[#fabf2c] shadow-2xl flex flex-col justify-end group">
              {/* Product Visual */}
              <Image
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&q=80"
                alt="Aura Studio ANC 2.0"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />

              {/* Floating Bottom Info Pill Bar */}
              <div className="relative z-10 m-4 sm:m-6 p-4 rounded-2xl bg-[#141414]/90 backdrop-blur-md border border-white/10 flex items-center justify-between shadow-xl">
                <div>
                  <div className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase font-semibold">
                    FEATURED RELEASE
                  </div>
                  <div className="text-sm sm:text-base font-bold text-white mt-0.5">
                    Aura Studio ANC 2.0
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs line-through text-zinc-500 font-mono">
                    $349
                  </div>
                  <div className="text-sm sm:text-base font-bold text-emerald-400 font-mono">
                    $299.00
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Disciplines / Categories Section */}
      <section id="categories" className="py-20 px-6 sm:px-8 max-w-7xl mx-auto border-t border-zinc-900">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
              Curated Series
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
              Explore Disciplines
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-sm">
            Engineered hardware categories designed with acoustic rigor and everyday utility.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              onClick={() => {
                setActiveCategory(cat.name);
                const el = document.getElementById("products");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="group relative h-80 rounded-2xl overflow-hidden border border-zinc-800/80 bg-zinc-900 cursor-pointer shadow-lg hover:border-zinc-500 transition-all duration-300"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-70 group-hover:opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

              <div className="absolute top-4 left-4">
                <span className="text-[11px] font-mono tracking-wider font-semibold text-white bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                  {cat.tag}
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div>
                  <h3 className="font-bold text-lg text-white group-hover:text-zinc-200 transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-xs text-zinc-400">{cat.items}</span>
                </div>
                <div className="h-8 w-8 rounded-full bg-white/10 group-hover:bg-white group-hover:text-black flex items-center justify-center backdrop-blur-md transition-colors text-white">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Product Catalog Section */}
      <section id="products" className="py-20 px-6 sm:px-8 max-w-7xl mx-auto border-t border-zinc-900">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
              The Catalog
            </span>
            <h2 className="text-3xl font-extrabold text-white mt-1">
              Select Instruments
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {filterCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-white text-black font-bold shadow-md"
                    : "bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-zinc-600 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-zinc-950 rounded-2xl border border-zinc-900">
            <p className="text-base text-zinc-400">
              No instruments found matching &quot;{searchQuery}&quot;.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("All");
              }}
              className="mt-4 text-xs font-mono text-white underline underline-offset-4"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const isSaved = wishlist.includes(product.id);
              return (
                <div
                  key={product.id}
                  className="group rounded-2xl bg-zinc-950 border border-zinc-900 hover:border-zinc-700 p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl relative"
                >
                  {/* Card Header Tags */}
                  <div className="flex items-center justify-between z-10">
                    <span className="text-[10px] font-mono tracking-wider font-semibold uppercase px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800">
                      {product.badge}
                    </span>
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className={`p-1.5 rounded-full transition-colors ${
                        isSaved
                          ? "text-red-500 bg-red-500/10"
                          : "text-zinc-500 hover:text-white bg-zinc-900/80"
                      }`}
                      title={isSaved ? "Saved" : "Save to wishlist"}
                    >
                      <svg
                        className="w-4 h-4"
                        fill={isSaved ? "currentColor" : "none"}
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Product Image */}
                  <div className="relative w-full h-56 my-3 overflow-hidden rounded-xl bg-zinc-900/40">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex flex-col gap-2 mt-2">
                    <div className="flex items-center justify-between text-xs text-zinc-400">
                      <span>{product.category}</span>
                      <span className="flex items-center gap-1 text-zinc-200 font-mono">
                        ★ {product.rating}{" "}
                        <span className="text-zinc-500 font-sans">
                          ({product.reviews})
                        </span>
                      </span>
                    </div>

                    <h3 className="font-semibold text-sm text-white line-clamp-1 group-hover:text-zinc-300 transition-colors">
                      {product.title}
                    </h3>

                    <p className="text-[11px] text-zinc-400 line-clamp-1">
                      {product.specs}
                    </p>

                    {/* Color swatches */}
                    <div className="flex items-center gap-1.5 pt-1">
                      {product.colorOptions.map((c, i) => (
                        <span
                          key={i}
                          className="h-3 w-3 rounded-full border border-zinc-700"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>

                    {/* Price and Add to Bag */}
                    <div className="flex items-center justify-between pt-3 border-t border-zinc-900 mt-1">
                      <div>
                        <span className="text-base font-bold font-mono text-white">
                          {product.price}
                        </span>
                        <span className="text-xs line-through text-zinc-500 ml-2 font-mono">
                          {product.originalPrice}
                        </span>
                      </div>

                      <button
                        onClick={() => addToCart(product)}
                        className="bg-white hover:bg-zinc-200 text-black px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all active:scale-95 flex items-center gap-1.5"
                      >
                        <span>Add</span>
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 6. Brand Story Section */}
      <section id="story" className="py-24 px-6 sm:px-8 max-w-7xl mx-auto border-t border-zinc-900">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 flex flex-col gap-6">
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
              Our Philosophy
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
              Acoustic Rigor.
              <span className="block text-zinc-500">Enduring Materials.</span>
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
              We design tools that resist the obsolescence of modern consumer electronics. Every hinge is machined from aerospace alloys, every acoustic driver tuned by hand, and every material selected for tactile longevity.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-zinc-900">
              <div>
                <h4 className="font-bold text-white text-base">Zero Synthetics</h4>
                <p className="text-xs text-zinc-400 mt-1">Grade 5 titanium, machined aluminum, and natural organic acoustics.</p>
              </div>
              <div>
                <h4 className="font-bold text-white text-base">Lifetime Service</h4>
                <p className="text-xs text-zinc-400 mt-1">Modular component architecture designed to be repaired, never discarded.</p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-6 relative aspect-video rounded-3xl overflow-hidden border border-zinc-800">
            <Image
              src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=900&q=80"
              alt="Engineering Precision"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* 7. Reviews Section */}
      <section id="reviews" className="py-20 px-6 sm:px-8 max-w-7xl mx-auto border-t border-zinc-900">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
            Verified Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
            Praise from Producers
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-2">
            Engineers, sound designers, and minimalists worldwide rely on Velocity gear daily.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-900 flex flex-col justify-between">
            <div>
              <div className="text-zinc-200 font-mono text-sm tracking-wider mb-3">
                ★★★★★
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed italic">
                &ldquo;The low-end clarity on the Aura Studio is startling. I can pinpoint sub-bass rumble without the mud usually found in wireless closed-backs.&rdquo;
              </p>
            </div>
            <div className="flex items-center gap-3 pt-6 mt-4 border-t border-zinc-900">
              <div className="h-10 w-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-xs text-white">
                MK
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Marcus King</h4>
                <p className="text-[11px] text-zinc-400">Mastering Engineer, Berlin</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-900 flex flex-col justify-between">
            <div>
              <div className="text-zinc-200 font-mono text-sm tracking-wider mb-3">
                ★★★★★
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed italic">
                &ldquo;The Chronos watch and Apex wallet are pure industrial perfection. Clean geometry, tactile weight, and zero superfluous branding.&rdquo;
              </p>
            </div>
            <div className="flex items-center gap-3 pt-6 mt-4 border-t border-zinc-900">
              <div className="h-10 w-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-xs text-white">
                SL
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Sophie Laurent</h4>
                <p className="text-[11px] text-zinc-400">Architectural Lead, Zurich</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-900 flex flex-col justify-between">
            <div>
              <div className="text-zinc-200 font-mono text-sm tracking-wider mb-3">
                ★★★★★
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed italic">
                &ldquo;From unboxing the plastic-free pulp packaging to the first listening session, Velocity delivers an experience on par with bespoke boutique ateliers.&rdquo;
              </p>
            </div>
            <div className="flex items-center gap-3 pt-6 mt-4 border-t border-zinc-900">
              <div className="h-10 w-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-xs text-white">
                DT
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">David Tan</h4>
                <p className="text-[11px] text-zinc-400">Electronic Producer, Tokyo</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Newsletter */}
      <section className="py-20 px-6 sm:px-8 max-w-7xl mx-auto border-t border-zinc-900">
        <div className="rounded-3xl p-8 sm:p-14 bg-zinc-950 border border-zinc-900 text-center">
          <div className="max-w-xl mx-auto flex flex-col items-center gap-4">
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
              Exclusive Registry
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Join the Velocity Registry
            </h2>
            <p className="text-sm text-zinc-400">
              Access early serial allocations, studio logs, and private member releases.
            </p>

            {newsletterSubscribed ? (
              <div className="mt-4 p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm font-medium">
                ✓ You have been subscribed. Use code <span className="font-mono font-bold">SPRING26</span> for 15% off.
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (newsletterEmail.trim()) {
                    setNewsletterSubscribed(true);
                    showToast("Subscribed to the Velocity Registry");
                  }
                }}
                className="flex flex-col sm:flex-row items-center gap-3 w-full mt-4"
              >
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto shrink-0 bg-white hover:bg-zinc-200 text-black font-semibold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition-all"
                >
                  Join
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 9. Footer */}
      <footer className="border-t border-zinc-900 bg-black py-16 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-4 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center font-black text-black text-sm">
                T
              </div>
              <span className="font-bold tracking-tight text-lg text-white">
                TOKOKITA
              </span>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed max-w-sm">
              Designing acoustic instruments, field timepieces, and daily utility hardware of enduring character and mechanical integrity.
            </p>
          </div>

          <div className="md:col-span-2 flex flex-col gap-3 text-xs">
            <span className="font-mono uppercase text-zinc-300 font-semibold tracking-wider">
              Products
            </span>
            <a href="#products" className="text-zinc-500 hover:text-white transition-colors">
              Aura Studio ANC 2.0
            </a>
            <a href="#products" className="text-zinc-500 hover:text-white transition-colors">
              Pulse Hi-Fi Earbuds
            </a>
            <a href="#products" className="text-zinc-500 hover:text-white transition-colors">
              Chronos Watch
            </a>
            <a href="#products" className="text-zinc-500 hover:text-white transition-colors">
              Apex Wallet
            </a>
          </div>

          <div className="md:col-span-2 flex flex-col gap-3 text-xs">
            <span className="font-mono uppercase text-zinc-300 font-semibold tracking-wider">
              Disciplines
            </span>
            <a href="#categories" className="text-zinc-500 hover:text-white transition-colors">
              Minimalist Audio
            </a>
            <a href="#categories" className="text-zinc-500 hover:text-white transition-colors">
              Everyday Carry
            </a>
            <a href="#categories" className="text-zinc-500 hover:text-white transition-colors">
              Timepieces
            </a>
            <a href="#categories" className="text-zinc-500 hover:text-white transition-colors">
              Design Eyewear
            </a>
          </div>

          <div className="md:col-span-2 flex flex-col gap-3 text-xs">
            <span className="font-mono uppercase text-zinc-300 font-semibold tracking-wider">
              Company
            </span>
            <a href="#story" className="text-zinc-500 hover:text-white transition-colors">
              Our Story
            </a>
            <a href="#reviews" className="text-zinc-500 hover:text-white transition-colors">
              Reviews
            </a>
            <a href="#warranty" className="text-zinc-500 hover:text-white transition-colors">
              2-Year Warranty
            </a>
          </div>

          <div className="md:col-span-2 flex flex-col gap-3 text-xs">
            <span className="font-mono uppercase text-zinc-300 font-semibold tracking-wider">
              Support
            </span>
            <a href="#support" className="text-zinc-500 hover:text-white transition-colors">
              Help Center
            </a>
            <a href="#support" className="text-zinc-500 hover:text-white transition-colors">
              Order Status
            </a>
            <a href="#support" className="text-zinc-500 hover:text-white transition-colors">
              Contact
            </a>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-10 mt-10 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-600 font-mono gap-4">
          <p>© 2026 TOKOKITA STORE INC. ALL RIGHTS RESERVED.</p>
          <p>CARBON NEUTRAL CERTIFIED</p>
        </div>
      </footer>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-zinc-950 border-l border-zinc-900 text-zinc-100 flex flex-col shadow-2xl">
              <div className="p-6 border-b border-zinc-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">Your Shopping Bag</h3>
                  <span className="text-xs font-mono bg-zinc-800 px-2 py-0.5 rounded text-white">
                    {cartCount} items
                  </span>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900"
                >
                  ✕
                </button>
              </div>

              {/* Free Shipping Milestone */}
              <div className="px-6 py-4 bg-zinc-900/60 border-b border-zinc-900">
                <div className="flex justify-between text-xs mb-1.5 font-medium">
                  {cartTotal >= freeShippingThreshold ? (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                      <span>🎉</span> Free Worldwide Express Shipping Unlocked!
                    </span>
                  ) : (
                    <span className="text-zinc-300">
                      Add <strong className="text-white font-mono">${freeShippingThreshold - cartTotal}</strong> more for Free Shipping
                    </span>
                  )}
                  <span className="font-mono text-zinc-400">{shippingProgress}%</span>
                </div>
                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-500"
                    style={{ width: `${shippingProgress}%` }}
                  />
                </div>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto p-6 divide-y divide-zinc-900">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center gap-3">
                    <p className="text-sm text-zinc-400">Your shopping bag is empty.</p>
                  </div>
                ) : (
                  cart.map((item, idx) => (
                    <div key={idx} className="py-4 flex gap-4">
                      <div className="relative h-20 w-20 rounded-xl bg-zinc-900 overflow-hidden shrink-0 border border-zinc-800">
                        <Image
                          src={item.product.image}
                          alt={item.product.title}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-xs font-bold text-white line-clamp-1">
                              {item.product.title}
                            </h4>
                            <button
                              onClick={() =>
                                removeFromCart(item.product.id, item.selectedColor)
                              }
                              className="text-zinc-500 hover:text-white text-xs"
                            >
                              ✕
                            </button>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className="h-2.5 w-2.5 rounded-full border border-zinc-600"
                              style={{ backgroundColor: item.selectedColor }}
                            />
                            <span className="text-[10px] text-zinc-400 font-mono">
                              {item.product.category}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <span className="text-xs font-mono font-bold text-white">
                            ${item.product.priceNum * item.quantity}.00
                          </span>

                          <div className="flex items-center border border-zinc-800 rounded-lg bg-zinc-900">
                            <button
                              onClick={() =>
                                updateCartQuantity(
                                  item.product.id,
                                  item.selectedColor,
                                  -1
                                )
                              }
                              className="px-2 py-0.5 text-zinc-400 hover:text-white text-xs font-mono"
                            >
                              -
                            </button>
                            <span className="px-2 py-0.5 text-xs font-mono text-zinc-200">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateCartQuantity(
                                  item.product.id,
                                  item.selectedColor,
                                  1
                                )
                              }
                              className="px-2 py-0.5 text-zinc-400 hover:text-white text-xs font-mono"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Checkout */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-zinc-900 bg-zinc-950 flex flex-col gap-3">
                  <div className="flex justify-between text-xs text-zinc-400">
                    <span>Subtotal</span>
                    <span className="font-mono text-white">${cartTotal}.00</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-zinc-900">
                    <span>Total Due</span>
                    <span className="font-mono text-white text-base">
                      ${cartTotal}.00
                    </span>
                  </div>

                  <button
                    onClick={() => showToast("Checkout initialized...")}
                    className="w-full bg-white hover:bg-zinc-200 text-black py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all active:scale-98 mt-2"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sign In Modal */}
      {isSignInOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsSignInOpen(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <div className="relative bg-zinc-950 border border-zinc-800 rounded-3xl p-8 w-full max-w-md text-center shadow-2xl z-10">
            <button
              onClick={() => setIsSignInOpen(false)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white"
            >
              ✕
            </button>
            <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center font-black text-black text-lg mx-auto mb-4">
              V
            </div>
            <h3 className="text-xl font-bold text-white">Welcome to Velocity</h3>
            <p className="text-xs text-zinc-400 mt-1 mb-6">
              Sign in to manage your orders, saved wishlists, and studio warranty registrations.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                showToast("Signed in successfully!");
                setIsSignInOpen(false);
              }}
              className="flex flex-col gap-3 text-left"
            >
              <div>
                <label className="text-[11px] font-mono text-zinc-400 uppercase">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@studio.com"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 mt-1"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-zinc-400 uppercase">
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 mt-1"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-white hover:bg-zinc-200 text-black font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-all mt-3"
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
