export default function DashboardLayout({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-600 text-white p-6">
        <h2 className="text-xl font-bold mb-6">JobConnect</h2>

        <nav className="space-y-3">
          <a className="block hover:text-gray-200" href="#">Dashboard</a>
          <a className="block hover:text-gray-200" href="#">Profil</a>
          <a className="block hover:text-gray-200" href="#">Logout</a>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">{title}</h1>
        {children}
      </main>
    </div>
  )
}
