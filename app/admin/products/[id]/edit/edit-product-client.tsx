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
import { updateProduct } from "@/app/actions/product"
import { initialProducts, type Product, type ProductCategory } from "@/data/products-data"

export function EditProductClient({
  productId,
  initialProduct,
}: {
  productId: string
  initialProduct?: Product
}) {
  const router = useRouter()
  const queryClient = useQueryClient()

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

  const existingProduct: Product = useMemo(() => {
    return (
      initialProduct ??
      initialProducts.find((p) => p.id === productId) ?? {
        id: productId,
        name: "Sony WH-1000XM5 Wireless Headphones",
        title: "Sony WH-1000XM5 Wireless Headphones",
        slug: "sony-wh-1000xm5",
        categoryId: "cat-electronics",
        category: { id: "cat-electronics", name: "Electronics", slug: "electronics" },
        isActive: true,
        price: 399.99,
        rating: 4.9,
        reviewsCount: 120,
        createdAt: "2025-01-15T08:00:00Z",
        updatedAt: "2025-02-01T14:30:00Z",
        description: "Industry-leading noise cancellation with dual processors.",
        specs: [],
        variants: [
          {
            id: `var-${productId}-1`,
            sku: "SNY-WH1000XM5-BLK",
            name: "Standard Black",
            size: "Standard",
            color: "Black",
            price: 399.99,
            stock: 42,
            productId,
          },
        ],
        images: [
          {
            id: `img-${productId}-1`,
            url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
            altText: "Sony WH-1000XM5 Black Front Profile",
            order: 0,
            productId,
          },
        ],
      }
    )
  }, [initialProduct, productId])

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleUpdate = async (data: ProductFormData) => {
    setIsSubmitting(true)
    const res = await updateProduct(productId, {
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
    toast.success(`Produk "${data.name}" berhasil diperbarui!`)
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
            { label: `Edit ${productId}` },
          ]}
          userNav={<UserNav onLogout={() => router.push("/login")} />}
        />

        <main className="flex-1 p-4 md:p-6">
          <ProductForm
            mode="edit"
            categories={categories}
            initialData={existingProduct}
            onSubmit={handleUpdate}
            isSubmitting={isSubmitting}
            backHref="/admin/products"
          />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
