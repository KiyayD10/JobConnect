'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { useAuth } from '@/src/context/AuthContext'

export default function RegisterPage() {
  const router = useRouter()
  const { login } = useAuth()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [role, setRole] = useState<'JOBSEEKER' | 'EMPLOYER'>('JOBSEEKER')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())

    const payload = {
      ...data,
      role,
    }

    try {
      const res = await fetch("http://localhost:3000/api/auth/register", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Registration failed')

      // Auto login setelah register
      login(json.token, json.user)
      router.push('/')
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
          <h2 className="text-3xl font-bold text-gray-900">Buat Akun</h2>
          <p className="mt-2 text-sm text-gray-600">
            Daftar sebagai pencari kerja atau perusahaan
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={onSubmit}>
          <div className="space-y-4">
            <Input name="name" label="Nama Lengkap" placeholder="Masukkan Nama Lengkap Anda" required />
            <Input
              name="email"
              type="email"
              label="Email"
              placeholder="Masukkan Email Anda"
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

            {/*  PILIH ROLE */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Daftar sebagai
              </label>
              <select
                value={role}
                onChange={(e) =>
                  setRole(e.target.value as 'JOBSEEKER' | 'EMPLOYER')
                }
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="JOBSEEKER">Pencari Kerja</option>
                <option value="EMPLOYER">Perusahaan / Recruiter</option>
              </select>
            </div>
          </div>

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Daftar Sekarang
          </Button>

          <p className="text-center text-sm text-gray-600">
            Sudah punya akun?{' '}
            <Link href="/auth/login" className="font-medium text-indigo-600 hover:underline">
              Masuk di sini
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
