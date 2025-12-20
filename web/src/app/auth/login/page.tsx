"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { useAuth } from "@/src/context/AuthContext"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Login gagal")

      // 🔐 simpan auth
      login(json.token, json.user)

      router.push("/") // optional, bisa juga di AuthContext
    } catch (err) {
      if (err instanceof Error) setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
            Selamat Datang Kembali
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Masuk untuk melanjutkan ke JobConnect
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          <div className="space-y-4">
            <Input
              name="email"
              type="email"
              label="Email"
              placeholder="nama@email.com"
              required
            />

            <Input
              name="password"
              type="password"
              label="Password"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Masuk
          </Button>

          <p className="text-center text-sm text-gray-600">
            Belum punya akun?{" "}
            <Link
              href="/auth/register"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Daftar sekarang
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
