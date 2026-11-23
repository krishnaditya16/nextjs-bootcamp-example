import type { Metadata } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import { CartProvider } from "@/components/storefront/cart-context"
import { CartDrawer } from "@/components/storefront/cart-drawer"
import "./globals.css"

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Tokokita — Perlengkapan Harian Berkualitas",
  description:
    "Kurasi audio presisi, jam tangan, dan perlengkapan harian dengan rancangan presisi dan material tahan lama.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" className={`${plusJakartaSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white">
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  )
}
