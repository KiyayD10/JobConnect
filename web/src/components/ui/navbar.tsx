"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/src/context/AuthContext' // Sesuai struktur awal Anda
import { Button } from '@/src/components/ui/button'
import { cn } from '@/src/lib/utils' // Biasanya ada jika pakai Shadcn UI

export default function Navbar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  // Helper untuk active link
  const navLinks = [
    { name: 'Cari Kerja', href: '/jobs' },
    { name: 'Perusahaan', href: '/companies' },
  ]

  return (
    <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Kiri: Logo & Navigasi Utama */}
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-bold text-indigo-600 tracking-tight">
              JobConnect
            </Link>
            
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-indigo-600",
                    pathname === link.href ? "text-indigo-600" : "text-gray-600"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Kanan: Auth Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="hidden sm:flex flex-col items-end mr-2">
                  <span className="text-xs text-gray-500">Selamat datang,</span>
                  <span className="text-sm font-semibold text-gray-900">{user.name}</span>
                </div>
                
                {/* Tampilkan tombol Post Job hanya jika role Recruiter/Admin */}
                {(user.role === 'RECRUITER' || user.role === 'ADMIN') && (
                  <Link href="/dashboard/recruiter">
                    <Button variant="outline" size="sm" className="hidden md:flex">
                      Dashboard
                    </Button>
                  </Link>
                )}

                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={logout} 
                  className="text-red-600 hover:bg-red-50 hover:text-red-700 font-medium"
                >
                  Keluar
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="font-medium">
                    Masuk
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 shadow-sm">
                    Daftar
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}