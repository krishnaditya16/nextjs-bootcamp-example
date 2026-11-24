import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { checkRateLimit } from "@/lib/rate-limit"

const AUTH_ROUTES = ["/login", "/register"]
const ADMIN_PREFIX = "/admin"
const CHECKOUT_PREFIX = "/checkout"

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) {
    return forwarded.split(",")[0].trim()
  }
  return request.headers.get("x-real-ip") ?? "127.0.0.1"
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. IP-based Rate Limiter khusus endpoint autentikasi
  if (pathname.startsWith("/api/auth")) {
    const ip = getClientIp(request)
    const result = checkRateLimit(`auth:${ip}`, 10, 60_000)

    if (!result.allowed) {
      return NextResponse.json(
        { error: "Terlalu banyak percobaan. Silakan coba lagi nanti." },
        {
          status: 429,
          headers: {
            "Retry-After": String(result.retryAfterSeconds),
          },
        }
      )
    }

    return NextResponse.next()
  }

  // 2. Proteksi & Rate Limit API Eksternal (/api/v1/*)
  if (pathname.startsWith("/api/v1")) {
    const ip = getClientIp(request)
    const limitResult = checkRateLimit(`api:${ip}`, 30, 60_000)

    if (!limitResult.allowed) {
      return NextResponse.json(
        { error: "Terlalu banyak permintaan API" },
        {
          status: 429,
          headers: {
            "Retry-After": String(limitResult.retryAfterSeconds),
          },
        }
      )
    }

    const apiKey = request.headers.get("x-api-key")
    if (!apiKey || apiKey !== (process.env.API_SECRET_KEY || "dev-api-key-123")) {
      return NextResponse.json(
        { error: "Unauthorized: x-api-key tidak valid" },
        { status: 401 }
      )
    }

    return NextResponse.next()
  }

  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route))
  const isAdminRoute = pathname.startsWith(ADMIN_PREFIX)
  const isCheckoutRoute = pathname.startsWith(CHECKOUT_PREFIX)

  // Lewati pengecekan session pada rute storefront publik agar tetap cepat
  if (!isAuthRoute && !isAdminRoute && !isCheckoutRoute) {
    return NextResponse.next()
  }

  // 3. Pemeriksaan Session dan Role langsung melalui Better Auth
  const session = await auth.api.getSession({
    headers: request.headers,
  })
  const role = (session?.user as { role?: string })?.role

  if (isAuthRoute) {
    if (session) {
      const targetUrl = role === "admin" ? "/admin" : "/"
      return NextResponse.redirect(new URL(targetUrl, request.url))
    }
    return NextResponse.next()
  }

  if (!session) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Hanya role "admin" yang boleh masuk ke /admin; customer diarahkan ke storefront (/)
  if (isAdminRoute && role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
}
