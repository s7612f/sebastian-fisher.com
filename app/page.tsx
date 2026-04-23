import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ThemeToggle } from "@/components/ThemeToggle"

export default async function Home() {
  const session = await auth()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Navbar */}
      <nav className="fixed top-0 w-full backdrop-blur-sm bg-white/70 dark:bg-gray-950/70 border-b border-gray-200/50 dark:border-gray-800/50 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              SF
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link
                href="/login"
                className="px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors border border-gray-300 dark:border-gray-700 rounded-lg hover:border-gray-400 dark:hover:border-gray-600"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex min-h-screen items-center justify-center p-4 pt-20">
        <div className="max-w-5xl w-full">
          <div className="text-center mb-16">
            <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
              Sebastian Fisher
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-4">
              Media & Services Hub
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>All systems operational</span>
            </div>
          </div>

          {/* Public Services */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Jellyfin */}
            <a
              href="https://jellyfin.sebastian-fisher.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-800 hover:scale-105"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform"></div>
              <div className="relative">
                <div className="text-5xl mb-4">🎬</div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Jellyfin
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Stream movies, TV shows, and music
                </p>
                <div className="flex items-center text-sm text-purple-600 dark:text-purple-400 font-medium">
                  <span>Open Media Server</span>
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </a>

            {/* Overseerr (Request) */}
            <a
              href="https://request.sebastian-fisher.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-800 hover:scale-105"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform"></div>
              <div className="relative">
                <div className="text-5xl mb-4">🎫</div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Request Media
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Request movies and TV shows
                </p>
                <div className="flex items-center text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                  <span>Make a Request</span>
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </a>
          </div>

          {/* Footer Note */}
          <div className="text-center mt-12 text-sm text-gray-500 dark:text-gray-500">
            <p>Additional services available after login</p>
          </div>
        </div>
      </div>
    </div>
  )
}
