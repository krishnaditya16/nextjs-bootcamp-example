import { z } from "zod"

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Nama kategori minimal 2 karakter")
    .max(80, "Nama kategori maksimal 80 karakter"),
  slug: z
    .string()
    .trim()
    .min(2, "Slug minimal 2 karakter")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug hanya boleh huruf kecil, angka, dan tanda hubung (-)"
    ),
  description: z.string().trim().max(500, "Deskripsi maksimal 500 karakter").optional(),
  isActive: z.boolean(),
})

export type CategoryFormValues = z.infer<typeof categorySchema>
