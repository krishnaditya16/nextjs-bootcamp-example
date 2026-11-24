import { headers } from "next/headers"
import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { prisma } from "@/lib/db"

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "mysql",
  }),
  secret:
    process.env.BETTER_AUTH_SECRET ||
    "tokokita-bootcamp-secret-key-2026-super-secure-fallback",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
        input: false,
        returned: true,
      },
    },
  },
})

export type Session = typeof auth.$Infer.Session

export async function requireAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  const role = (session?.user as { role?: string })?.role
  if (!session || role !== "admin") {
    throw new Error("Akses ditolak. Hanya admin yang diizinkan.")
  }

  return session
}
