import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/login")
  }

  const userRole = (session.user as { role?: string })?.role

  if (userRole !== "admin") {
    redirect("/")
  }

  return <>{children}</>
}
