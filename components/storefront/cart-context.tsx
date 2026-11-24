"use client"

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react"
import { useRouter } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  getCart,
  addToCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart as serverClearCart,
} from "@/app/actions/cart"

export interface CartContextItem {
  id: string
  cartId: string
  productId: string
  variantId: string | null
  quantity: number
  product: {
    id: string
    name: string
    title?: string
    slug: string
    description?: string | null
    images: { url: string; altText?: string | null; order: number }[]
  }
  variant: {
    id: string
    sku: string
    size?: string | null
    color?: string | null
    price: number
    stock: number
    name?: string
  } | null
}

interface CartContextType {
  items: CartContextItem[]
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
  totalCount: number
  subtotal: number
  isLoading: boolean
  addItem: (input: {
    productId: string
    variantId?: string | null
    quantity?: number
  }) => Promise<void>
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>
  removeItem: (cartItemId: string) => Promise<void>
  clearCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isCartOpen, setIsCartOpen] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await getCart()
      return res
    },
  })

  const addMutation = useMutation({
    mutationFn: addToCart,
    onSuccess: (res) => {
      if (res.requiresAuth) {
        toast.info("Silakan login untuk menambahkan ke keranjang")
        router.push("/login")
        return
      }
      if (!res.success) {
        toast.error(res.error || "Gagal menambahkan produk")
        return
      }
      queryClient.invalidateQueries({ queryKey: ["cart"] })
      toast.success("Produk berhasil ditambahkan ke keranjang")
      setIsCartOpen(true)
    },
    onError: () => {
      toast.error("Terjadi kesalahan saat menambahkan produk")
    },
  })

  const updateQtyMutation = useMutation({
    mutationFn: ({
      cartItemId,
      quantity,
    }: {
      cartItemId: string
      quantity: number
    }) => updateCartItemQuantity(cartItemId, quantity),
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.error || "Gagal memperbarui jumlah item")
        return
      }
      queryClient.invalidateQueries({ queryKey: ["cart"] })
    },
  })

  const removeMutation = useMutation({
    mutationFn: (cartItemId: string) => removeCartItem(cartItemId),
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.error || "Gagal menghapus item")
        return
      }
      queryClient.invalidateQueries({ queryKey: ["cart"] })
      toast.success("Item berhasil dihapus dari keranjang")
    },
  })

  const clearMutation = useMutation({
    mutationFn: () => serverClearCart(),
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ["cart"] })
      }
    },
  })

  const items: CartContextItem[] = (data?.items ?? []).map((item) => {
    const variantLabel =
      [item.variant?.size, item.variant?.color].filter(Boolean).join(" / ") ||
      item.variant?.sku ||
      "Standard"

    return {
      ...item,
      product: {
        ...item.product,
        title: item.product.name,
      },
      variant: item.variant
        ? {
            ...item.variant,
            name: variantLabel,
          }
        : null,
    }
  })

  const totalCount = data?.totalItems ?? 0
  const subtotal = data?.subtotal ?? 0

  const handleAddItem = async (input: {
    productId: string
    variantId?: string | null
    quantity?: number
  }) => {
    await addMutation.mutateAsync(input)
  }

  const handleUpdateQuantity = async (
    cartItemId: string,
    quantity: number
  ) => {
    await updateQtyMutation.mutateAsync({ cartItemId, quantity })
  }

  const handleRemoveItem = async (cartItemId: string) => {
    await removeMutation.mutateAsync(cartItemId)
  }

  const handleClearCart = async () => {
    await clearMutation.mutateAsync()
  }

  return (
    <CartContext.Provider
      value={{
        items,
        isCartOpen,
        setIsCartOpen,
        totalCount,
        subtotal,
        isLoading,
        addItem: handleAddItem,
        updateQuantity: handleUpdateQuantity,
        removeItem: handleRemoveItem,
        clearCart: handleClearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
