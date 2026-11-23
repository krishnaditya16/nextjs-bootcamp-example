"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { RegisterForm } from "@/components/admin/auth-guard/register-form"
import { signUp } from "@/lib/auth-client"

export function RegisterClient() {
  const router = useRouter()
  const [error, setError] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState(false)

  const handleRegister = async (data: { name: string; email: string; password: string }) => {
    setIsLoading(true)
    setError(undefined)

    const { error: authError } = await signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
    })

    if (authError) {
      setError(authError.message || "Gagal mendaftarkan akun.")
      setIsLoading(false)
      return
    }

    toast.success(`Akun berhasil dibuat untuk ${data.name}!`)
    router.push("/admin")
    router.refresh()
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <RegisterForm
          error={error}
          isLoading={isLoading}
          onSubmit={handleRegister}
          loginHref="/login"
        />
      </div>
    </div>
  )
}
