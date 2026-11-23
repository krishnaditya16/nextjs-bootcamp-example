export interface CategoryItem {
  id: string
  name: string
  slug: string
  description?: string | null
  isActive: boolean
  createdAt: string | Date
  updatedAt: string | Date
  _count?: {
    products: number
  }
}
