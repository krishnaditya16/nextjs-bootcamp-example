import { Suspense } from "react"
import type { Metadata } from "next"

import { CategoriesClient } from "./categories-client"

export const metadata: Metadata = {
  title: "Categories",
  description: "Manage your product categories catalog and taxonomy.",
}

export default function CategoriesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <CategoriesClient />
    </Suspense>
  )
}
