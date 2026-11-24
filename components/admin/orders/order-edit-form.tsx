"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { toast } from "sonner"
import {
  ArrowLeft,
  Save,
  Loader2,
  AlertTriangle,
  ExternalLink,
  Clock,
  CheckCircle2,
  XCircle,
  Package,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { updateAdminOrder } from "@/app/actions/order"
import { formatRupiah } from "@/data/products-data"

export interface OrderEditItem {
  id: string
  name: string
  variant: string
  quantity: number
  price: number
  image?: string
}

export interface OrderEditFormData {
  id: string
  status: string
  totalAmount: number
  xenditInvoiceId: string | null
  paymentUrl: string | null
  paymentMethod: string | null
  recipientName: string
  phone: string
  shippingAddress: string
  createdAt: string
  customerName: string
  customerEmail: string
  items: OrderEditItem[]
}

export function OrderEditForm({ order }: { order: OrderEditFormData }) {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)

  const [status, setStatus] = useState<"PENDING" | "PAID" | "CANCELLED">(
    order.status === "PAID" || order.status === "CANCELLED"
      ? order.status
      : "PENDING"
  )
  const [recipientName, setRecipientName] = useState(
    order.recipientName === "-" ? "" : order.recipientName
  )
  const [phone, setPhone] = useState(order.phone === "-" ? "" : order.phone)
  const [shippingAddress, setShippingAddress] = useState(
    order.shippingAddress === "-" ? "" : order.shippingAddress
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (recipientName.trim().length < 2) {
      toast.error("Recipient name must be at least 2 characters")
      return
    }
    if (phone.trim().length < 8) {
      toast.error("Phone number must be at least 8 digits")
      return
    }
    if (shippingAddress.trim().length < 10) {
      toast.error("Shipping address must be at least 10 characters")
      return
    }

    setIsPending(true)
    try {
      const res = await updateAdminOrder({
        orderId: order.id,
        status,
        recipientName: recipientName.trim(),
        phone: phone.trim(),
        shippingAddress: shippingAddress.trim(),
      })

      if (!res.success) {
        toast.error(res.error || "Failed to update order")
        setIsPending(false)
        return
      }

      toast.success(res.message || "Order updated successfully")
      router.push("/admin/orders")
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "An unexpected error occurred")
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => router.push("/admin/orders")}
            className="size-8 p-0"
          >
            <ArrowLeft className="size-4" />
            <span className="sr-only">Back</span>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight">
                Edit Order #{order.id.slice(0, 8).toUpperCase()}
              </h1>
              {order.status === "PAID" && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  <CheckCircle2 className="size-3" />
                  PAID
                </span>
              )}
              {order.status === "PENDING" && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                  <Clock className="size-3" />
                  PENDING
                </span>
              )}
              {order.status === "CANCELLED" && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-600 border border-rose-500/20">
                  <XCircle className="size-3" />
                  CANCELLED
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Placed on {new Date(order.createdAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => router.push("/admin/orders")}
            disabled={isPending}
            className="text-xs"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={isPending}
            className="text-xs gap-1.5"
          >
            {isPending ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="size-3.5" />
                <span>Save Changes</span>
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Editable Status & Shipping Details */}
        <div className="lg:col-span-7 space-y-6">
          {/* Order Status */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Order Status</CardTitle>
              <CardDescription className="text-xs">
                Update transaction status based on payment verification and store fulfillment.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="order-status" className="text-xs font-semibold">
                  Payment &amp; Fulfillment Status
                </Label>
                <Select
                  value={status}
                  onValueChange={(val) => {
                    if (val === "PENDING" || val === "PAID" || val === "CANCELLED") {
                      setStatus(val)
                    }
                  }}
                >
                  <SelectTrigger id="order-status" className="w-full text-xs">
                    <SelectValue placeholder="Select order status" />
                  </SelectTrigger>
                  <SelectContent className="w-[var(--anchor-width)]">
                    <SelectItem value="PENDING">Pending Payment (PENDING)</SelectItem>
                    <SelectItem value="PAID">Paid &amp; Verified (PAID)</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled (CANCELLED)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {status === "CANCELLED" && (
                <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs leading-relaxed">
                  <AlertTriangle className="size-4 shrink-0 mt-0.5" />
                  <span>
                    Warning: Setting status to <strong>CANCELLED</strong> will automatically restore variant inventory stock in the database.
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recipient & Shipping Details */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Recipient &amp; Shipping Details</CardTitle>
              <CardDescription className="text-xs">
                Correct delivery contact information and destination address.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="recipientName" className="text-xs font-semibold">
                  Recipient Name
                </Label>
                <Input
                  id="recipientName"
                  required
                  placeholder="Full recipient name"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-xs font-semibold">
                  Phone Number / WhatsApp
                </Label>
                <Input
                  id="phone"
                  required
                  type="tel"
                  placeholder="081234567890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="shippingAddress" className="text-xs font-semibold">
                  Full Shipping Address
                </Label>
                <Textarea
                  id="shippingAddress"
                  required
                  rows={4}
                  placeholder="Street name, building, district, city, postal code"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="text-xs resize-none"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Financial Summary & Purchased Items */}
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Financial Summary</CardTitle>
              <CardDescription className="text-xs">
                Payment data recorded from the payment gateway.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between py-1 border-b">
                <span className="text-muted-foreground">Total Bill</span>
                <span className="font-bold text-foreground text-sm tabular-nums">
                  {formatRupiah(order.totalAmount)}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b">
                <span className="text-muted-foreground">Payment Method</span>
                <span className="font-medium text-foreground">
                  {order.paymentMethod || "Not selected yet"}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b">
                <span className="text-muted-foreground">Customer Account</span>
                <div className="text-right">
                  <div className="font-medium text-foreground">{order.customerName}</div>
                  <div className="text-[11px] text-muted-foreground">{order.customerEmail}</div>
                </div>
              </div>

              <div className="py-1 border-b">
                <span className="text-muted-foreground block mb-1">Xendit Invoice ID</span>
                <span className="font-mono text-[11px] text-foreground break-all">
                  {order.xenditInvoiceId || "-"}
                </span>
              </div>

              {order.paymentUrl && (
                <div className="pt-1">
                  <a
                    href={order.paymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-amber-600 hover:text-amber-700 underline font-medium"
                  >
                    <span>Open Xendit Invoice</span>
                    <ExternalLink className="size-3" />
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Items Preview */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center justify-between">
                <span>Ordered Items ({order.items.length})</span>
                <Package className="size-4 text-muted-foreground" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y max-h-72 overflow-y-auto pr-1">
                {order.items.map((item) => (
                  <div key={item.id} className="py-2.5 flex items-center gap-3 first:pt-0 last:pb-0">
                    <div className="relative size-12 rounded-lg bg-muted shrink-0 overflow-hidden border">
                      <Image
                        src={item.image || "/placeholder/product.jpg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-foreground truncate">{item.name}</h4>
                      <p className="text-[11px] text-muted-foreground">
                        {item.variant} &times; {item.quantity}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-foreground tabular-nums">
                      {formatRupiah(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
