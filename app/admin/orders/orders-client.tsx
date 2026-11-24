"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import {
  ShoppingBag,
  CheckCircle2,
  Clock,
  XCircle,
  ExternalLink,
  Search,
  Loader2,
  DollarSign,
  MoreHorizontal,
  Pencil,
  Eye,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/admin/admin-shell/app-sidebar"
import { AdminHeader } from "@/components/admin/admin-shell/admin-header"
import { PageHeader } from "@/components/admin/admin-shell/page-header"
import { StatCard } from "@/components/admin/admin-shell/stat-card"
import { UserNav } from "@/components/admin/auth-guard/user-nav"
import { getAdminOrders, type AdminOrderItem } from "@/app/actions/order"
import { formatRupiah } from "@/data/products-data"

export function OrdersClient() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("ALL")

  const { data: orders = [], isLoading } = useQuery<AdminOrderItem[]>({
    queryKey: ["admin-orders"],
    queryFn: () => getAdminOrders(),
  })

  const totalRevenue = useMemo(
    () =>
      orders
        .filter((o) => o.status === "PAID")
        .reduce((sum, o) => sum + o.totalAmount, 0),
    [orders]
  )

  const paidCount = useMemo(
    () => orders.filter((o) => o.status === "PAID").length,
    [orders]
  )
  const pendingCount = useMemo(
    () => orders.filter((o) => o.status === "PENDING").length,
    [orders]
  )

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.recipientName.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus =
        statusFilter === "ALL" || order.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [orders, searchTerm, statusFilter])

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AdminHeader userNav={<UserNav />} />

        <div className="flex-1 space-y-6 p-6">
          <PageHeader
            title="Orders"
            description="Monitor sales transactions, customer delivery details, and real-time payment gateway statuses."
          />

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Orders"
              value={orders.length}
              description="All incoming orders"
              icon={ShoppingBag}
            />
            <StatCard
              title="Net Revenue"
              value={formatRupiah(totalRevenue)}
              description="Total verified orders (PAID)"
              icon={DollarSign}
            />
            <StatCard
              title="Pending Payment"
              value={pendingCount}
              description="Awaiting customer completion"
              icon={Clock}
            />
            <StatCard
              title="Completed Payments"
              value={paidCount}
              description="Verified via Xendit webhook"
              icon={CheckCircle2}
            />
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search order ID or customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>

            <div className="w-full sm:w-48">
              <Select
                value={statusFilter}
                onValueChange={(val) => setStatusFilter(val || "ALL")}
              >
                <SelectTrigger className="w-full h-9 text-xs">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent className="w-[var(--anchor-width)]">
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="PAID">Paid (PAID)</SelectItem>
                  <SelectItem value="PENDING">Pending (PENDING)</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled (CANCELLED)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            {isLoading ? (
              <div className="p-12 text-center text-muted-foreground flex flex-col items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-xs">Loading orders...</span>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground text-xs">
                No orders found matching your search or filter criteria.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/50 border-b border-border font-semibold text-muted-foreground">
                    <tr>
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Items</th>
                      <th className="py-3 px-4">Total</th>
                      <th className="py-3 px-4">Payment Method</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-medium">
                          <Link
                            href={`/admin/orders/${order.id}/edit`}
                            className="hover:underline text-primary"
                          >
                            #{order.id.slice(0, 8).toUpperCase()}
                          </Link>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-medium text-foreground">{order.recipientName}</div>
                          <div className="text-[11px] text-muted-foreground">{order.customerEmail}</div>
                        </td>
                        <td className="py-3.5 px-4 text-muted-foreground">
                          {order.itemCount} items
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-foreground tabular-nums">
                          {formatRupiah(order.totalAmount)}
                        </td>
                        <td className="py-3.5 px-4 text-muted-foreground">
                          {order.paymentMethod ? (
                            <span className="font-medium text-foreground">{order.paymentMethod}</span>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          {order.status === "PAID" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                              <CheckCircle2 className="w-3 h-3" />
                              PAID
                            </span>
                          )}
                          {order.status === "PENDING" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                              <Clock className="w-3 h-3" />
                              PENDING
                            </span>
                          )}
                          {order.status === "CANCELLED" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                              <XCircle className="w-3 h-3" />
                              CANCELLED
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-muted-foreground whitespace-nowrap">
                          {new Date(order.createdAt).toLocaleDateString("en-US", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              render={
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="size-8 p-0 data-[state=open]:bg-muted cursor-pointer"
                                >
                                  <MoreHorizontal className="size-4" />
                                  <span className="sr-only">Open order actions</span>
                                </Button>
                              }
                            />
                            <DropdownMenuContent align="end" className="w-44">
                              <DropdownMenuItem
                                onClick={() => router.push(`/orders/${order.id}`)}
                                className="text-xs cursor-pointer"
                              >
                                <Eye className="mr-2 size-3.5 text-muted-foreground" />
                                View Details
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() => router.push(`/admin/orders/${order.id}/edit`)}
                                className="text-xs cursor-pointer"
                              >
                                <Pencil className="mr-2 size-3.5 text-muted-foreground" />
                                Edit Order
                              </DropdownMenuItem>

                              {order.paymentUrl && order.status === "PENDING" && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => window.open(order.paymentUrl!, "_blank")}
                                    className="text-xs cursor-pointer text-amber-600 focus:text-amber-700 focus:bg-amber-500/10"
                                  >
                                    <ExternalLink className="mr-2 size-3.5" />
                                    Open Xendit Invoice
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
