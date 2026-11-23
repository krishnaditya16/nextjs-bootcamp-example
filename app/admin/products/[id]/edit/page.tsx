import { Suspense } from "react"
import type { Metadata } from "next"

import { EditProductClient } from "./edit-product-client"
import { getProductById } from "@/app/actions/product"
import { initialProducts } from "@/data/products-data"

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params
  const product = (await getProductById(id)) ?? initialProducts.find((p) => p.id === id)
  return {
    title: product ? `Edit ${product.name}` : `Edit ${id}`,
    description: `Update details and inventory for product ${id}.`,
  }
}

async function EditProductContent({ params }: PageProps) {
  const { id } = await params
  const initialData = (await getProductById(id)) ?? initialProducts.find((p) => p.id === id)
  return <EditProductClient productId={id} initialProduct={initialData ?? undefined} />
}

export default function EditProductPage({ params }: PageProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <EditProductContent params={params} />
    </Suspense>
  )
}
