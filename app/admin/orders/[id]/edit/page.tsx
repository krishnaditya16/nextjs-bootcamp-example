import { Suspense } from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/admin/admin-shell/app-sidebar"
import { AdminHeader } from "@/components/admin/admin-shell/admin-header"
import { UserNav } from "@/components/admin/auth-guard/user-nav"
import { OrderEditForm } from "@/components/admin/orders/order-edit-form"
import { getAdminOrderById } from "@/app/actions/order"

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params
  const order = await getAdminOrderById(id)
  return {
    title: order
      ? `Edit Pesanan #${order.id.slice(0, 8).toUpperCase()} - Tokokita Admin`
      : `Edit Pesanan - Tokokita Admin`,
    description: `Perbarui status transaksi dan data pengiriman pesanan ${id}.`,
  }
}

async function EditOrderContent({ params }: PageProps) {
  const { id } = await params
  const order = await getAdminOrderById(id)

  if (!order) {
    notFound()
  }

  return <OrderEditForm order={order} />
}

export default function EditOrderPage({ params }: PageProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AdminHeader
          breadcrumbs={[
            { label: "Dashboard", href: "/admin" },
            { label: "Orders", href: "/admin/orders" },
            { label: "Edit Order" },
          ]}
          userNav={<UserNav />}
        />

        <main className="flex-1 p-4 md:p-6">
          <Suspense fallback={<div className="min-h-screen bg-background" />}>
            <EditOrderContent params={params} />
          </Suspense>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
