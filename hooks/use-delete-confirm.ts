"use client"

import { useState, useCallback } from "react"

export interface UseDeleteConfirmProps {
  onConfirm: (id: string) => void | Promise<void>
}

export function useDeleteConfirm({ onConfirm }: UseDeleteConfirmProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [targetId, setTargetId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const triggerDelete = useCallback((id: string) => {
    setTargetId(id)
    setIsOpen(true)
  }, [])

  const confirmDelete = useCallback(async () => {
    if (!targetId) return
    setIsLoading(true)
    try {
      await onConfirm(targetId)
    } finally {
      setIsLoading(false)
      setIsOpen(false)
      setTargetId(null)
    }
  }, [targetId, onConfirm])

  const cancelDelete = useCallback(() => {
    setIsOpen(false)
    setTargetId(null)
  }, [])

  return {
    isOpen,
    isLoading,
    triggerDelete,
    confirmDelete,
    cancelDelete,
  }
}
