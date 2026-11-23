"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { type CartItem, type Product, type ProductVariant } from "@/data/products-data"

interface CartContextType {
  items: CartItem[]
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
  addItem: (product: Product, variant: ProductVariant, quantity?: number) => void
  removeItem: (variantId: string) => void
  updateQuantity: (variantId: string, quantity: number) => void
  clearCart: () => void
  totalCount: number
  subtotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Load cart from localStorage on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("tokokita_cart")
      if (saved) {
        setItems(JSON.parse(saved))
      }
    } catch {
      // ignore
    }
  }, [])

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("tokokita_cart", JSON.stringify(items))
    } catch {
      // ignore
    }
  }, [items])

  const addItem = useCallback((product: Product, variant: ProductVariant, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.variant.id === variant.id)
      if (existing) {
        return prev.map((item) =>
          item.variant.id === variant.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prev, { product, variant, quantity }]
    })
    setIsCartOpen(true)
  }, [])

  const removeItem = useCallback((variantId: string) => {
    setItems((prev) => prev.filter((item) => item.variant.id !== variantId))
  }, [])

  const updateQuantity = useCallback((variantId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.variant.id !== variantId))
      return
    }
    setItems((prev) =>
      prev.map((item) =>
        item.variant.id === variantId ? { ...item, quantity } : item
      )
    )
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce(
    (sum, item) => sum + item.variant.price * item.quantity,
    0
  )

  return (
    <CartContext.Provider
      value={{
        items,
        isCartOpen,
        setIsCartOpen,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalCount,
        subtotal,
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
