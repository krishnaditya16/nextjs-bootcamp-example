"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/admin/admin-shell/app-sidebar"
import { AdminHeader } from "@/components/admin/admin-shell/admin-header"
import { UserNav } from "@/components/admin/auth-guard/user-nav"
import { ProductForm, type ProductFormData } from "@/components/admin/products/product-form"
import { getCategories } from "@/app/actions/category"
import { createProduct } from "@/app/actions/product"
import type { ProductCategory } from "@/data/products-data"

export function NewProductClient() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data: dbCategories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  })

  const categories: ProductCategory[] = useMemo(() => {
    return dbCategories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description || "",
    }))
  }, [dbCategories])

  const handleCreate = async (data: ProductFormData) => {
    setIsSubmitting(true)
    const res = await createProduct({
      name: data.name,
      slug: data.slug,
      description: data.description,
      isActive: data.isActive,
      categoryId: data.categoryId || null,
      variants: data.variants.map((v) => ({
        sku: v.sku,
        size: v.size || undefined,
        color: v.color || undefined,
        price: Number(v.price) || 0,
        stock: Number(v.stock) || 0,
      })),
      images: data.images,
    })
    setIsSubmitting(false)

    if (res?.error) {
      toast.error(res.error)
      return
    }

    await queryClient.invalidateQueries({ queryKey: ["products"] })
    toast.success(`Produk "${data.name}" berhasil dibuat!`)
    router.push("/admin/products")
    router.refresh()
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AdminHeader
          breadcrumbs={[
            { label: "Dashboard", href: "/admin" },
            { label: "Products", href: "/admin/products" },
            { label: "Add Product" },
          ]}
          userNav={<UserNav onLogout={() => router.push("/login")} />}
        />

        <main className="flex-1 p-4 md:p-6">
          <ProductForm
            mode="create"
            categories={categories}
            onSubmit={handleCreate}
            isSubmitting={isSubmitting}
            backHref="/admin/products"
          />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
