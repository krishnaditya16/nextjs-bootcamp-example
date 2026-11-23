"use client"

import { useState, useEffect } from "react"

export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // Pasang timer tunda
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Bersihkan timer jika pengguna mengetik huruf baru sebelum waktu delay habis
    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}
