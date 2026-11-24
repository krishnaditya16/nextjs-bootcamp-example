import { z } from "zod"

export const productImageSchema = z.object({
  id: z.string().optional(),
  url: z.string().min(1, "URL gambar tidak boleh kosong"),
  altText: z.string().optional().nullable(),
  order: z.number().int().min(0).default(0),
})

export const productVariantSchema = z.object({
  id: z.string().optional(),
  sku: z.string().trim().min(3, "SKU minimal 3 karakter"),
  size: z.string().trim().optional(),
  color: z.string().trim().optional(),
  price: z.coerce.number().min(1000, "Harga minimal Rp 1.000"),
  stock: z.coerce.number().int().min(0, "Stok minimal 0"),
})

export const productSchema = z.object({
  name: z.string().trim().min(3, "Nama produk minimal 3 karakter").max(120),
  slug: z
    .string()
    .trim()
    .min(3, "Slug minimal 3 karakter")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug tidak valid"),
  description: z.string().trim().optional(),
  isActive: z.boolean(),
  categoryId: z.string().min(1, "Pilih salah satu kategori").optional().nullable(),
  variants: z
    .array(productVariantSchema)
    .min(1, "Minimal harus ada 1 varian produk"),
  images: z.array(productImageSchema).optional().default([]),
})

export type ProductImageFormValues = z.infer<typeof productImageSchema>
export type ProductVariantFormValues = z.infer<typeof productVariantSchema>
export type ProductFormValues = z.infer<typeof productSchema>
