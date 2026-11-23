"use client"

import { useCallback, useEffect, useMemo, useState, useTransition } from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
  Package,
  Plus,
  Search,
  XCircle,
} from "lucide-react"
import { toast } from "sonner"

import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

// Admin Shell
import { AppSidebar } from "@/components/admin/admin-shell/app-sidebar"
import { AdminHeader } from "@/components/admin/admin-shell/admin-header"
import { PageHeader } from "@/components/admin/admin-shell/page-header"
import { StatCard } from "@/components/admin/admin-shell/stat-card"

// Auth Guard
import { UserNav } from "@/components/admin/auth-guard/user-nav"

// Data Table
import { DataTable } from "@/components/admin/data-table/data-table"

// CRUD Primitives
import { ConfirmDeleteDialog } from "@/components/admin/crud-primitives/confirm-delete-dialog"
import {
  getProductTotalStock,
  initialProducts,
  type Product,
} from "@/data/products-data"
import { getProductColumns } from "./columns"
import { getPaginatedProducts } from "@/app/actions/product"
import { useDebounce } from "@/hooks/use-debounce"

export function ProductsClient() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()
  const [, startTransition] = useTransition()

  // 1. Baca state aktif dari parameter URL
  const page = Math.max(1, Number(searchParams.get("page")) || 1)
  const limit = Math.max(1, Number(searchParams.get("limit")) || 10)
  const searchFromUrl = searchParams.get("search") || ""

  // 2. State lokal untuk input teks pencarian agar responsif saat diketik
  const [searchInput, setSearchInput] = useState(searchFromUrl)
  const debouncedSearch = useDebounce(searchInput, 350)

  // 3. Fungsi pembantu untuk memperbarui parameter URL secara bersih
  const updateUrlParams = useCallback((updates: Record<string, string | number | null>) => {
    const params = new URLSearchParams(searchParams.toString())

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "" || value === undefined) {
        params.delete(key)
      } else {
        params.set(key, String(value))
      }
    })

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    })
  }, [pathname, router, searchParams])

  // 4. Sinkronkan nilai debounced search ke URL dan reset ke halaman 1
  useEffect(() => {
    if (debouncedSearch !== searchFromUrl) {
      updateUrlParams({
        search: debouncedSearch || null,
        page: 1,
      })
    }
  }, [debouncedSearch, searchFromUrl, updateUrlParams])

  // 5. Eksekusi query TanStack dengan cache keepPreviousData
  const { data, isFetching } = useQuery({
    queryKey: ["products", { page, limit, search: searchFromUrl }],
    queryFn: () =>
      getPaginatedProducts({
        page,
        limit,
        search: searchFromUrl,
      }),
    placeholderData: keepPreviousData,
  })

  const products = (data?.products && data.products.length > 0) ? data.products : (searchFromUrl ? [] : initialProducts)
  const metadata = data?.metadata ?? {
    total: products.length,
    totalPages: 1,
    currentPage: page,
    limit,
  }

  // Delete Dialog state
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleOpenDelete = (product: Product) => {
    setDeletingProduct(product)
    setIsDeleteOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!deletingProduct) return

    setIsDeleting(true)
    await new Promise((resolve) => setTimeout(resolve, 400))

    queryClient.invalidateQueries({ queryKey: ["products"] })
    toast.success(`Deleted "${deletingProduct.name}" from inventory.`)
    setIsDeleting(false)
    setIsDeleteOpen(false)
  }

  const inStockCount = products.filter((p) => getProductTotalStock(p) > 10).length
  const lowStockCount = products.filter((p) => {
    const stock = getProductTotalStock(p)
    return stock > 0 && stock <= 10
  }).length
  const outOfStockCount = products.filter((p) => getProductTotalStock(p) === 0).length

  const columns = useMemo(
    () =>
      getProductColumns({
        onEdit: (product) => router.push(`/admin/products/${product.id}/edit`),
        onDelete: (product) => handleOpenDelete(product),
      }),
    [router]
  )

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AdminHeader
          breadcrumbs={[
            { label: "Dashboard", href: "/admin" },
            { label: "Products" },
          ]}
          userNav={<UserNav onLogout={() => router.push("/login")} />}
        />

        <main className="flex-1 p-4 md:p-6 space-y-6">
          <PageHeader
            title="Products"
            description="Manage your product catalog, inventory levels, and pricing with fast server-side processing."
          >
            <Link
              href="/admin/products/new"
              className={cn(buttonVariants({ size: "sm" }), "gap-1.5")}
            >
              <Plus className="size-3.5" />
              Add Product
            </Link>
          </PageHeader>

          {/* 4 Inventory Metric Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Products"
              value={metadata.total.toString()}
              description="items in active catalog"
              icon={Package}
            />
            <StatCard
              title="In Stock"
              value={inStockCount.toString()}
              description="ready for immediate shipment"
              icon={CheckCircle2}
              trend={{
                value: `${Math.round(
                  (inStockCount / (products.length || 1)) * 100
                )}%`,
                positive: true,
              }}
            />
            <StatCard
              title="Low Stock"
              value={lowStockCount.toString()}
              description="re-order threshold reached"
              icon={AlertTriangle}
            />
            <StatCard
              title="Out of Stock"
              value={outOfStockCount.toString()}
              description="currently unavailable"
              icon={XCircle}
            />
          </div>

          {/* Server-Side Search Filter */}
          <div className="flex items-center justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products by name or description..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-9 pr-9"
              />
              {isFetching && (
                <Loader2 className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
              )}
            </div>
          </div>

          {/* Data Table */}
          <DataTable
            columns={columns}
            data={products}
            hideToolbar
            hidePagination
          />

          {/* Server-Side Pagination Bar */}
          <div className="flex flex-col items-center justify-between gap-4 py-2 sm:flex-row">
            {/* Info Total Data & Pilihan Baris per Halaman */}
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>
                Showing{" "}
                <strong className="text-foreground">
                  {metadata.total === 0
                    ? 0
                    : (metadata.currentPage - 1) * metadata.limit + 1}
                </strong>
                -
                <strong className="text-foreground">
                  {Math.min(metadata.currentPage * metadata.limit, metadata.total)}
                </strong>{" "}
                of <strong className="text-foreground">{metadata.total}</strong>{" "}
                products
              </span>

              <div className="flex items-center gap-1.5">
                <span className="text-xs">Per page:</span>
                <Select
                  value={String(limit)}
                  onValueChange={(val) => {
                    updateUrlParams({ limit: Number(val), page: 1 })
                  }}
                >
                  <SelectTrigger className="h-8 w-18 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tombol Navigasi Halaman */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground mr-2">
                Page {metadata.currentPage} of {metadata.totalPages}
              </span>

              <Button
                variant="outline"
                size="icon"
                className="size-8"
                disabled={metadata.currentPage <= 1 || isFetching}
                onClick={() => updateUrlParams({ page: 1 })}
              >
                <ChevronsLeft className="size-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="size-8"
                disabled={metadata.currentPage <= 1 || isFetching}
                onClick={() => updateUrlParams({ page: metadata.currentPage - 1 })}
              >
                <ChevronLeft className="size-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="size-8"
                disabled={metadata.currentPage >= metadata.totalPages || isFetching}
                onClick={() => updateUrlParams({ page: metadata.currentPage + 1 })}
              >
                <ChevronRight className="size-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="size-8"
                disabled={metadata.currentPage >= metadata.totalPages || isFetching}
                onClick={() => updateUrlParams({ page: metadata.totalPages })}
              >
                <ChevronsRight className="size-4" />
              </Button>
            </div>
          </div>
        </main>
      </SidebarInset>

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title={deletingProduct ? `Delete "${deletingProduct.name}"?` : "Delete item?"}
        description="Are you sure you want to permanently delete this product? This will remove all associated stock and pricing records."
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </SidebarProvider>
  )
}
