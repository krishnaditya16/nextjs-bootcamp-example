"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { LoginForm } from "@/components/admin/auth-guard/login-form"
import { signIn } from "@/lib/auth-client"

export function LoginClient() {
  const router = useRouter()
  const [error, setError] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (data: { email: string; password: string }) => {
    setIsLoading(true)
    setError(undefined)

    const { error: authError } = await signIn.email({
      email: data.email,
      password: data.password,
    })

    if (authError) {
      setError(authError.message || "Email atau password salah.")
      setIsLoading(false)
      return
    }

    toast.success("Berhasil masuk!")
    router.push("/admin")
    router.refresh()
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm
          error={error}
          isLoading={isLoading}
          onSubmit={handleLogin}
          registerHref="/register"
        />
      </div>
    </div>
  )
}
