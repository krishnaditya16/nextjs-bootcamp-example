"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ArrowLeft, Loader2, Save } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ConfirmDiscardDialog } from "@/components/admin/crud-primitives/confirm-discard-dialog"
import { categorySchema, type CategoryFormValues } from "@/lib/schemas/category"
import { createCategory, updateCategory } from "@/app/actions/category"
import { slugify } from "@/lib/utils"

export interface CategoryFormProps {
  mode: "create" | "edit"
  categoryId?: string
  initialData?: Partial<CategoryFormValues>
  backHref?: string
}

export function CategoryForm({
  mode,
  categoryId,
  initialData,
  backHref = "/admin/categories",
}: CategoryFormProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isDiscardOpen, setIsDiscardOpen] = useState(false)
  const [autoSlug, setAutoSlug] = useState(true)
  const [slug, setSlug] = useState(initialData?.slug ?? "")

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    control,
    formState: { errors, isDirty },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: initialData?.name ?? "",
      slug: initialData?.slug ?? "",
      description: initialData?.description ?? "",
      isActive: initialData?.isActive ?? true,
    },
  })

  const mutation = useMutation({
    mutationFn: async (values: CategoryFormValues) => {
      if (mode === "create") {
        return createCategory(values)
      } else {
        if (!categoryId) throw new Error("Category ID is required for editing")
        return updateCategory(categoryId, values)
      }
    },
    onSuccess: (res) => {
      if (res?.error) {
        toast.error(res.error)
        return
      }
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      toast.success(
        mode === "create"
          ? "Kategori berhasil dibuat!"
          : "Kategori berhasil diperbarui!"
      )
      router.push(backHref)
    },
    onError: (err: unknown) => {
      toast.error(
        err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan kategori"
      )
    },
  })

  const onSubmit = (values: CategoryFormValues) => {
    mutation.mutate(values)
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    if (autoSlug) {
      const generated = slugify(val)
      setSlug(generated)
      setValue("slug", generated, { shouldValidate: true, shouldDirty: true })
    }
  }

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAutoSlug(false)
    const val = slugify(e.target.value)
    setSlug(val)
    setValue("slug", val, { shouldValidate: true, shouldDirty: true })
  }

  const handleBack = () => {
    if (isDirty) {
      setIsDiscardOpen(true)
    } else {
      router.push(backHref)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Header / Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-8"
              onClick={handleBack}
            >
              <ArrowLeft className="size-4" />
              <span className="sr-only">Kembali</span>
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight">
                  {mode === "create" ? "Tambah Kategori Baru" : "Edit Kategori"}
                </h1>
                <Badge variant={mode === "create" ? "outline" : "secondary"}>
                  {mode === "create" ? "Draft" : "Edit Mode"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {mode === "create"
                  ? "Tambahkan kategori produk baru ke katalog TokoKita."
                  : "Ubah detail dan status visibilitas kategori produk."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={handleBack}
              disabled={mutation.isPending}
            >
              Batal
            </Button>
            <Button type="submit" disabled={mutation.isPending} className="gap-2">
              {mutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              {mode === "create" ? "Simpan Kategori" : "Perbarui Kategori"}
            </Button>
          </div>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Column */}
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Kategori</CardTitle>
                <CardDescription>
                  Nama dan slug URL unik untuk pengelompokan produk.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Kategori *</Label>
                  <Input
                    id="name"
                    placeholder="misal: Sepatu Pria"
                    {...register("name", {
                      onChange: handleNameChange,
                    })}
                  />
                  {errors.name && (
                    <p className="text-xs text-destructive">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="slug">Slug URL *</Label>
                    {autoSlug ? (
                      <span className="text-xs text-muted-foreground">
                        (Otomatis dibuat dari nama)
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setAutoSlug(true)
                          const currentName = getValues("name")
                          if (currentName) {
                            const generated = slugify(currentName)
                            setSlug(generated)
                            setValue("slug", generated, {
                              shouldValidate: true,
                              shouldDirty: true,
                            })
                          }
                        }}
                        className="text-xs text-primary hover:underline cursor-pointer"
                      >
                        Sinkronkan otomatis dari nama
                      </button>
                    )}
                  </div>
                  <Input
                    id="slug"
                    placeholder="misal: sepatu-pria"
                    value={slug}
                    onChange={handleSlugChange}
                  />
                  {errors.slug && (
                    <p className="text-xs text-destructive">
                      {errors.slug.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Format identifier URL, contoh: /kategori/sepatu-pria
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi (Opsional)</Label>
                  <Textarea
                    id="description"
                    rows={4}
                    placeholder="Deskripsi singkat mengenai kelompok kategori produk ini..."
                    {...register("description")}
                  />
                  {errors.description && (
                    <p className="text-xs text-destructive">
                      {errors.description.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Auxiliary Column */}
          <div className="space-y-6 lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Status Visibilitas</CardTitle>
                <CardDescription>
                  Atur apakah kategori aktif dan tampil pada storefront.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="isActive" className="flex flex-col space-y-1">
                    <span>Status Aktif</span>
                    <span className="font-normal text-xs text-muted-foreground">
                      Kategori yang tidak aktif akan disembunyikan dari katalog publik.
                    </span>
                  </Label>
                  <Controller
                    name="isActive"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        id="isActive"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>

      <ConfirmDiscardDialog
        open={isDiscardOpen}
        onOpenChange={setIsDiscardOpen}
        onConfirm={() => router.push(backHref)}
      />
    </>
  )
}
