import type { Metadata } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import { CartProvider } from "@/components/storefront/cart-context"
import { CartDrawer } from "@/components/storefront/cart-drawer"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { QueryProvider } from "@/components/query-provider"
import "./globals.css"

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "Tokokita — Modern Storefront & Admin Portal",
    template: "%s | Tokokita",
  },
  description:
    "Kurasi audio presisi, jam tangan, dan perlengkapan harian dengan rancangan presisi dan material tahan lama.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" suppressHydrationWarning className={`${plusJakartaSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans selection:bg-zinc-900 selection:text-white">
        <QueryProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
            <CartProvider>
              {children}
              <CartDrawer />
            </CartProvider>
            <Toaster richColors position="top-right" />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
