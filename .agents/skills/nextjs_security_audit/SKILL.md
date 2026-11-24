---
name: Next.js Security Audit & Hardening
description: Step-by-step defensive engineering checklist and remediation patterns for auditing Next.js + Prisma + Better Auth applications (npm audit, NEXT_PUBLIC_ secret leaks, IDOR, mass assignment, file uploads, webhook verification, and HTTP security headers).
---

# Next.js Security Audit & Hardening

Use this skill to perform a thorough security audit and apply safe hardening fixes to a Next.js (App Router) + Prisma + Better Auth e-commerce project without breaking existing functionality.

## 1. Dependency & Secret Exposure Audit

1. **Run `npm audit`**:
   - Inspect high/critical vulnerabilities in `package-lock.json`.
   - Prefer `npm audit fix` for compatible patch/minor updates. Do **not** run `npm audit fix --force` blindly, as major version bumps can break the build.
2. **Audit `NEXT_PUBLIC_` and `.env`**:
   - Search `app/`, `components/`, `lib/`, and `src/` for `NEXT_PUBLIC_`.
   - Ensure **server-only secrets** (`DATABASE_URL`, `BETTER_AUTH_SECRET`, `XENDIT_SECRET_KEY`, `XENDIT_CALLBACK_TOKEN`, `API_SECRET_KEY`, `WEBHOOK_SECRET_TOKEN`, `MAIL_PASSWORD`) NEVER use the `NEXT_PUBLIC_` prefix and are NEVER imported into `"use client"` components.
   - Verify `.env` is listed in `.gitignore` and `.env.example` contains placeholders only.

## 2. Authorization, Role Guards & IDOR Protection

1. **Admin Server Actions (`app/actions/*`)**:
   - Every admin mutation/query (`createProduct`, `updateProduct`, `deleteProduct`, `uploadProductImages`, `createCategory`, `updateCategory`, `deleteCategory`, admin order updates) MUST call `await requireAdmin()` (checking `session?.user?.role === "admin"`) at the very top of the function. Never rely on UI-only hiding.
2. **Customer Ownership (IDOR Prevention)**:
   - On customer detail pages (e.g. `app/**/orders/[id]/page.tsx`) and user-scoped mutations (`app/actions/cart.ts`, profile updates):
     - Always fetch the authenticated user ID from `auth.api.getSession({ headers: await headers() })`, and never accept `userId` from client arguments.
     - Scope Prisma queries with `userId: session.user.id` (unless `session.user.role === "admin"`):
     ```typescript
     const isAdmin = session.user.role === "admin"
     const order = await prisma.order.findFirst({
       where: isAdmin ? { id } : { id, userId: session.user.id },
     })
     if (!order) notFound()
     ```

## 3. Mass Assignment & Input Validation

1. Never pass raw `await request.json()`, `formData`, or unvalidated `input` objects directly into `prisma.*.create({ data })` or `prisma.*.update({ data })`.
2. Always parse with `zodSchema.safeParse(rawInput)` and explicitly whitelist fields:
   ```typescript
   const parsed = updateProfileSchema.safeParse(rawInput)
   if (!parsed.success) return { error: "Input tidak valid" }

   await prisma.user.update({
     where: { id: session.user.id },
     data: { name: parsed.data.name }, // explicit whitelist only; never spread rawInput
   })
   ```

## 4. File Upload, API & Webhook Hardening

1. **Local File Uploads (`lib/upload.ts`)**:
   - Validate MIME type against an explicit allowlist (`image/jpeg`, `image/png`, `image/webp`) and enforce a per-file size limit (e.g. `2 MB`).
   - Generate random filenames with `crypto.randomUUID()` and sanitize deletions using `path.basename()` plus an explicit `/uploads/` prefix check to prevent path traversal.
2. **REST APIs & Webhooks (`proxy.ts`, `app/api/*`)**:
   - Ensure `/api/v1/*` routes enforce rate limiting (`429`) and `x-api-key` validation (`401`) in `proxy.ts`.
   - Ensure `/api/webhooks/xendit` strictly verifies `x-callback-token` (`if (!expectedToken || incomingToken !== expectedToken) return 401`) and enforces idempotency (`if (order.status !== "PENDING") return skipped`).

## 5. Security Headers & Safe Error Handling

1. **HTTP Security Headers (`next.config.ts`)**:
   ```typescript
   async headers() {
     return [
       {
         source: "/(.*)",
         headers: [
           { key: "X-Content-Type-Options", value: "nosniff" },
           { key: "X-Frame-Options", value: "DENY" },
           { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
         ],
       },
     ]
   }
   ```
2. **Error Sanitization**:
   - Log raw Prisma/stack errors on the server (`console.error`), and return clean, non-sensitive error messages to the client.

## 6. Output Report Format

After auditing and applying fixes, report:
1. **Findings Fixed**: File path, vulnerability type (IDOR / Mass Assignment / Secret Leak / Missing Guard / Headers), and what changed.
2. **Verification Results**: Output of `npm audit`, `NEXT_PUBLIC_` grep check, and `curl -I http://localhost:3000` header check.
