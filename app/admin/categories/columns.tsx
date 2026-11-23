"use client"

import Link from "next/link"
import type { ColumnDef } from "@tanstack/react-table"
import { FolderTree } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { DataTableColumnHeader } from "@/components/admin/data-table/data-table-column-header"
import { DataTableRowActions } from "@/components/admin/data-table/data-table-row-actions"
import type { CategoryItem } from "@/components/admin/categories/types"

export interface CategoryColumnsOptions {
  onEdit?: (item: CategoryItem) => void
  onDelete: (item: CategoryItem) => void
}

export function getCategoryColumns({
  onEdit,
  onDelete,
}: CategoryColumnsOptions): ColumnDef<CategoryItem>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nama Kategori" />
      ),
      cell: ({ row }) => {
        const category = row.original
        return (
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-muted/40 text-muted-foreground">
              <FolderTree className="size-4" />
            </div>
            <div className="flex flex-col">
              <Link
                href={`/admin/categories/${category.id}/edit`}
                className="font-medium text-foreground hover:underline transition-all line-clamp-1"
              >
                {category.name}
              </Link>
              <span className="font-mono text-xs text-muted-foreground">
                /{category.slug}
              </span>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Deskripsi" />
      ),
      cell: ({ row }) => {
        const desc = row.getValue<string | null>("description")
        return (
          <span className="text-sm text-muted-foreground line-clamp-2 max-w-[320px]">
            {desc || "-"}
          </span>
        )
      },
    },
    {
      id: "productsCount",
      accessorFn: (row) => row._count?.products ?? 0,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Jumlah Produk" />
      ),
      cell: ({ row }) => {
        const count = row.original._count?.products ?? 0
        return (
          <span className="text-sm font-medium tabular-nums">
            {count} produk
          </span>
        )
      },
    },
    {
      accessorKey: "isActive",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const isActive = row.getValue<boolean>("isActive")
        return (
          <Badge
            variant={isActive ? "default" : "secondary"}
            className="text-[11px] font-medium"
          >
            {isActive ? "Aktif" : "Nonaktif"}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DataTableRowActions
          onEdit={onEdit ? () => onEdit(row.original) : undefined}
          onDelete={onDelete ? () => onDelete(row.original) : undefined}
        />
      ),
    },
  ]
}
