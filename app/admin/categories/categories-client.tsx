"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { FolderTree, CheckCircle2, XCircle, Plus, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { buttonVariants } from "@/components/ui/button"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/admin/admin-shell/app-sidebar"
import { AdminHeader } from "@/components/admin/admin-shell/admin-header"
import { PageHeader } from "@/components/admin/admin-shell/page-header"
import { StatCard } from "@/components/admin/admin-shell/stat-card"
import { UserNav } from "@/components/admin/auth-guard/user-nav"
import { DataTable } from "@/components/admin/data-table/data-table"
import { ConfirmDeleteDialog } from "@/components/admin/crud-primitives/confirm-delete-dialog"
import { getCategories, deleteCategory } from "@/app/actions/category"
import { getCategoryColumns } from "./columns"
import type { CategoryItem } from "@/components/admin/categories/types"
import { cn } from "@/lib/utils"

export function CategoriesClient() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data: categories = [], isLoading } = useQuery<CategoryItem[]>({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  })

  // Delete Dialog state
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deletingCategory, setDeletingCategory] = useState<CategoryItem | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleOpenDelete = (category: CategoryItem) => {
    setDeletingCategory(category)
    setIsDeleteOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!deletingCategory) return

    setIsDeleting(true)
    const res = await deleteCategory(deletingCategory.id)
    setIsDeleting(false)

    if (res?.error) {
      toast.error(res.error)
      return
    }

    queryClient.invalidateQueries({ queryKey: ["categories"] })
    toast.success(`Kategori "${deletingCategory.name}" berhasil dihapus.`)
    setIsDeleteOpen(false)
  }

  const activeCount = categories.filter((c) => c.isActive).length
  const inactiveCount = categories.length - activeCount
  const totalProducts = categories.reduce(
    (acc, curr) => acc + (curr._count?.products ?? 0),
    0
  )

  const columns = useMemo(
    () =>
      getCategoryColumns({
        onEdit: (cat) => router.push(`/admin/categories/${cat.id}/edit`),
        onDelete: (cat) => handleOpenDelete(cat),
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
            { label: "Kategori" },
          ]}
          userNav={<UserNav onLogout={() => router.push("/login")} />}
        />

        <main className="flex-1 p-4 md:p-6 space-y-6">
          <PageHeader
            title="Kategori Produk"
            description="Kelola kategori produk untuk mempermudah navigasi pembeli di storefront TokoKita."
          >
            <Link
              href="/admin/categories/new"
              className={cn(buttonVariants({ variant: "default" }), "gap-1.5")}
            >
              <Plus className="size-4" />
              Tambah Kategori
            </Link>
          </PageHeader>

          {/* Metric KPI Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard
              title="Total Kategori"
              value={categories.length}
              description={`${totalProducts} produk terkait`}
              icon={FolderTree}
            />
            <StatCard
              title="Kategori Aktif"
              value={activeCount}
              description="Ditampilkan pada katalog publik"
              icon={CheckCircle2}
            />
            <StatCard
              title="Kategori Nonaktif"
              value={inactiveCount}
              description="Disembunyikan dari storefront"
              icon={XCircle}
            />
          </div>

          {/* TanStack Data Table */}
          {isLoading ? (
            <div className="flex h-64 items-center justify-center rounded-lg border bg-card">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={categories}
              searchKey="name"
              searchPlaceholder="Cari kategori..."
            />
          )}
        </main>
      </SidebarInset>

      <ConfirmDeleteDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Hapus Kategori?"
        description={`Apakah Anda yakin ingin menghapus kategori "${deletingCategory?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus Kategori"
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </SidebarProvider>
  )
}
