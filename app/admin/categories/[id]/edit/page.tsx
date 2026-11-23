import { Suspense } from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/admin/admin-shell/app-sidebar"
import { AdminHeader } from "@/components/admin/admin-shell/admin-header"
import { UserNav } from "@/components/admin/auth-guard/user-nav"
import { CategoryForm } from "@/components/admin/categories/category-form"
import { getCategoryById } from "@/app/actions/category"

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params
  const category = await getCategoryById(id)
  return {
    title: category ? `Edit ${category.name}` : `Edit Category`,
    description: `Update details for category ${id}.`,
  }
}

async function EditCategoryContent({ params }: PageProps) {
  const { id } = await params
  const category = await getCategoryById(id)

  if (!category) {
    notFound()
  }

  return (
    <CategoryForm
      mode="edit"
      categoryId={category.id}
      initialData={{
        name: category.name,
        slug: category.slug,
        description: category.description || "",
        isActive: category.isActive,
      }}
      backHref="/admin/categories"
    />
  )
}

export default function EditCategoryPage({ params }: PageProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AdminHeader
          breadcrumbs={[
            { label: "Dashboard", href: "/admin" },
            { label: "Kategori", href: "/admin/categories" },
            { label: "Edit Kategori" },
          ]}
          userNav={<UserNav />}
        />

        <main className="flex-1 p-4 md:p-6">
          <Suspense fallback={<div className="min-h-screen bg-background" />}>
            <EditCategoryContent params={params} />
          </Suspense>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
