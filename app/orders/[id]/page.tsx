import { headers } from "next/headers"
import { notFound, redirect } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { Navbar } from "@/components/storefront/navbar"
import { Footer } from "@/components/storefront/footer"
import { formatRupiah } from "@/data/products-data"
import { CheckCircle2, Clock, XCircle, ArrowLeft, ExternalLink, Pencil } from "lucide-react"

export const metadata: Metadata = {
  title: "Detail Pesanan - Tokokita",
  description: "Rincian status pesanan dan konfirmasi pembayaran Xendit.",
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=/orders/${id}`)
  }

  const userRole = (session.user as { role?: string })?.role
  const isAdmin = userRole === "admin"

  const order = await prisma.order.findFirst({
    where: isAdmin ? { id } : { id, userId: session.user.id },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      items: {
        include: {
          variant: {
            include: {
              product: {
                include: {
                  images: true,
                },
              },
            },
          },
        },
      },
    },
  })

  if (!order) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        <div className="mb-6">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Katalog</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-xs overflow-hidden">
          {/* Header banner */}
          <div className="p-6 sm:p-8 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs text-zinc-400 font-mono mb-1">
                ORDER ID: {order.id}
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
                Pesanan #{order.id.slice(0, 8).toUpperCase()}
              </h1>
              <p className="text-xs text-zinc-500 mt-1">
                Dibuat pada {new Date(order.createdAt).toLocaleString("id-ID", {
                  dateStyle: "long",
                  timeStyle: "short",
                })}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {userRole === "admin" && (
                <Link
                  href={`/admin/orders/${order.id}/edit`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200 transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Edit Order (Admin)</span>
                </Link>
              )}
              {order.status === "PAID" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Pembayaran Lunas</span>
                </span>
              )}
              {order.status === "PENDING" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Menunggu Pembayaran</span>
                </span>
              )}
              {order.status === "CANCELLED" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>Pesanan Dibatalkan</span>
                </span>
              )}
            </div>
          </div>

          {/* Pending Payment Alert & CTA */}
          {order.status === "PENDING" && order.paymentUrl && (
            <div className="bg-amber-50/70 border-b border-amber-100 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xs font-bold text-amber-900">Selesaikan Pembayaran Anda</h2>
                <p className="text-xs text-amber-700 mt-0.5">
                  Invoice Xendit Sandbox telah aktif. Silakan lakukan simulasi pembayaran melalui tautan berikut.
                </p>
              </div>
              <a
                href={order.paymentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs transition-colors shrink-0"
              >
                <span>Buka Xendit Invoice</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Order Details Grid */}
          <div className="p-6 sm:p-8 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-xl bg-zinc-50 border border-zinc-100 text-xs">
              <div>
                <h3 className="font-semibold text-zinc-900 mb-1.5">Informasi Penerima</h3>
                <p className="text-zinc-700 font-medium">{order.recipientName || "-"}</p>
                <p className="text-zinc-500 mt-0.5">Telepon: {order.phone || "-"}</p>
              </div>

              <div>
                <h3 className="font-semibold text-zinc-900 mb-1.5">Alamat Pengiriman</h3>
                <p className="text-zinc-600 leading-relaxed">{order.shippingAddress || "-"}</p>
              </div>

              <div>
                <h3 className="font-semibold text-zinc-900 mb-1.5">Metode Pembayaran</h3>
                <p className="text-zinc-700">
                  {order.paymentMethod ? (
                    <span className="font-medium text-emerald-700">{order.paymentMethod}</span>
                  ) : (
                    <span className="text-zinc-500">Xendit Invoice (Belum dipilih)</span>
                  )}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-zinc-900 mb-1.5">Xendit Invoice ID</h3>
                <p className="text-zinc-500 font-mono text-[11px] truncate">
                  {order.xenditInvoiceId || "-"}
                </p>
              </div>
            </div>

            {/* Items Purchased */}
            <div>
              <h2 className="text-sm font-bold text-zinc-900 mb-4 pb-2 border-b border-zinc-100">
                Daftar Produk ({order.items.length})
              </h2>

              <div className="divide-y divide-zinc-100">
                {order.items.map((item) => {
                  const product = item.variant?.product
                  const imageSrc =
                    product?.images?.[0]?.url || "/placeholder/product.jpg"
                  const variantLabel =
                    [item.variant?.size, item.variant?.color]
                      .filter(Boolean)
                      .join(" / ") ||
                    item.variant?.sku ||
                    "Standar"

                  return (
                    <div key={item.id} className="py-3.5 flex items-center gap-4">
                      <div className="relative w-14 h-14 rounded-lg bg-zinc-100 shrink-0 overflow-hidden border border-zinc-100">
                        <Image
                          src={imageSrc}
                          alt={product?.name || "Produk"}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-xs font-semibold text-zinc-900 truncate">
                          {product?.name || "Produk"}
                        </h3>
                        <p className="text-[11px] text-zinc-500">
                          Varian: {variantLabel} &times; {item.quantity}
                        </p>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-bold text-zinc-900 tabular-nums">
                          {formatRupiah(Number(item.price) * item.quantity)}
                        </div>
                        <div className="text-[11px] text-zinc-400 tabular-nums">
                          @{formatRupiah(Number(item.price))}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Total Summary */}
            <div className="pt-4 border-t border-zinc-100 flex items-baseline justify-between">
              <span className="text-sm font-bold text-zinc-900">Total Pembayaran</span>
              <span className="text-xl font-bold text-zinc-900 tabular-nums">
                {formatRupiah(Number(order.totalAmount))}
              </span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
