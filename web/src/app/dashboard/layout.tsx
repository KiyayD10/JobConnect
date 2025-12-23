import React from "react"
import Link from "next/link"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-4">
        <h1 className="text-xl font-bold mb-6">JobConnect</h1>

        <nav className="space-y-3 text-sm">
          <Link href="/dashboard" className="block hover:text-indigo-400">
            Dashboard
          </Link>
          <Link href="/dashboard/profile" className="block hover:text-indigo-400">
            Profile
          </Link>
          <Link href="/auth/login" className="block text-red-400 mt-6">
            Logout
          </Link>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 bg-gray-100 p-6">
        {children}
      </main>
    </div>
  )
}
