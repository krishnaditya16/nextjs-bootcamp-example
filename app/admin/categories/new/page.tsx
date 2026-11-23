import type { Metadata } from "next"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/admin/admin-shell/app-sidebar"
import { AdminHeader } from "@/components/admin/admin-shell/admin-header"
import { UserNav } from "@/components/admin/auth-guard/user-nav"
import { CategoryForm } from "@/components/admin/categories/category-form"

export const metadata: Metadata = {
  title: "Add Category",
  description: "Create a new product category in the catalog.",
}

export default function NewCategoryPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AdminHeader
          breadcrumbs={[
            { label: "Dashboard", href: "/admin" },
            { label: "Kategori", href: "/admin/categories" },
            { label: "Tambah Kategori" },
          ]}
          userNav={<UserNav />}
        />

        <main className="flex-1 p-4 md:p-6">
          <CategoryForm mode="create" backHref="/admin/categories" />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
