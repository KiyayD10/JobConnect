"use client"

import Link from 'next/link'
import { useAuth } from '@/src/context/AuthContext'
import { Button } from '@/src/components/ui/button'
export default function Navbar() {
    const { user, logout } = useAuth()
    return (
        <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link href="/" className="text-2xl font-bold text-indigo-600">
                        JobConnect
                    </Link>
                    <div className="flex items-center gap-4">
                        {user ? (
                            <>
                                <span className="text-sm text-gray-700 hidden sm:block">
                                    Hi, <strong>{user.name}</strong>
                                </span>
                                <Link href="/jobs/create">
                                    <Button variant="outline" className="text-xs sm:text-sm">Post Job</Button>
                                </Link>
                                <Button variant="ghost" onClick={logout} className="text-red-600 hover:bg-red-50 hover:text-red-700">
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link href="/auth/login">
                                    <Button variant="ghost">Masuk</Button>
                                </Link>
                                <Link href="/auth/register">
                                    <Button>Daftar</Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}
