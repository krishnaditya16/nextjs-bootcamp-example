import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Top Brand Link */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
            T
          </div>
          <span className="font-extrabold tracking-tight text-2xl text-zinc-900">
            TOKOKITA
          </span>
        </Link>
        <h1 className="mt-6 text-2xl font-bold tracking-tight text-zinc-900">
          Masuk ke Akun Anda
        </h1>
        <p className="mt-1 text-xs text-zinc-600">
          Atau{" "}
          <Link href="/register" className="font-semibold text-zinc-900 underline hover:text-zinc-700">
            daftar akun baru jika belum terdaftar
          </Link>
        </p>
      </div>

      {/* Login Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xs border border-zinc-200 rounded-3xl">
          <form className="space-y-5" action="#">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Alamat Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="nama@email.com"
                className="w-full bg-white border border-zinc-300 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-xs font-semibold text-zinc-700">
                  Password
                </label>
                <a href="#" className="text-[11px] font-medium text-zinc-600 hover:text-zinc-900">
                  Lupa password?
                </a>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="••••••••"
                className="w-full bg-white border border-zinc-300 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all"
              />
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
              />
              <label htmlFor="remember-me" className="ml-2 block text-xs text-zinc-600">
                Ingat saya di perangkat ini
              </label>
            </div>

            <div>
              <button
                type="button"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-xs text-xs font-semibold text-white bg-zinc-900 hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900"
              >
                Masuk ke Akun
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-zinc-100 text-center">
            <Link
              href="/"
              className="text-xs text-zinc-600 hover:text-zinc-900 font-medium inline-flex items-center gap-1"
            >
              <span>&larr;</span>
              <span>Kembali ke Storefront Tokokita</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
