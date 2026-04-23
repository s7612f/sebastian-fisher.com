"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { ThemeToggle } from "@/components/ThemeToggle"

interface Service {
  name: string
  url: string
  description: string
  icon: string
  color: string
}

const services: Service[] = [
  {
    name: "Homarr",
    url: "http://192.168.1.77:7575",
    description: "Unified Home Server Dashboard (LAN)",
    icon: "🏠",
    color: "from-green-500 to-emerald-500",
  },
  {
    name: "Jellyfin",
    url: "https://jellyfin.sebastian-fisher.com",
    description: "Media Server (Public)",
    icon: "🎬",
    color: "from-purple-500 to-pink-500"
  },
  {
    name: "Overseerr",
    url: "https://request.sebastian-fisher.com",
    description: "Media Requests (Public)",
    icon: "🎫",
    color: "from-indigo-500 to-purple-500"
  },
  {
    name: "Radarr",
    url: "http://192.168.1.77:7878",
    description: "Movie Manager",
    icon: "🎞️",
    color: "from-yellow-500 to-orange-500"
  },
  {
    name: "Sonarr",
    url: "http://192.168.1.77:8989",
    description: "TV Show Manager",
    icon: "📺",
    color: "from-teal-500 to-green-500"
  },
  {
    name: "Prowlarr",
    url: "http://192.168.1.77:9696",
    description: "Indexer Manager",
    icon: "🧭",
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "qBittorrent",
    url: "http://192.168.1.77:8080",
    description: "Torrent Client",
    icon: "📥",
    color: "from-gray-600 to-slate-600"
  },
  {
    name: "Pi-hole",
    url: "http://192.168.1.77:8053/admin",
    description: "Ad Blocking Dashboard (LAN)",
    icon: "🛡️",
    color: "from-rose-500 to-red-500",
  },
]

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [session, status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-900 dark:text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome back, {session.user?.name || session.user?.email}!
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Your personal dashboard and services
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <a
                key={service.name}
                href={service.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all p-6 border border-gray-200 dark:border-gray-700 hover:scale-105">
                  <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${service.color} flex items-center justify-center text-3xl mb-4`}>
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {service.description}
                  </p>
                  <div className="mt-4 text-xs text-gray-500 dark:text-gray-500 font-mono truncate">
                    {service.url}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
