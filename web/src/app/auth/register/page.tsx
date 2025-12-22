"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "JOBSEEKER",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // Handle Input Change
  // =========================
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // =========================
  // Handle Submit
  // =========================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registrasi gagal");
        return;
      }

      // sukses → redirect ke login
      router.push("/login");
    } catch (err) {
      setError("Terjadi kesalahan, silakan coba lagi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow">
        <h1 className="text-2xl font-bold text-center mb-2">
          Buat Akun JobConnect
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Daftar sebagai pencari kerja atau perusahaan
        </p>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nama */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Nama lengkap"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="email@example.com"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              value={form.password}
              onChange={handleChange}
              className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Minimal 6 karakter"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Daftar sebagai
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border rounded-md px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="JOBSEEKER">Pencari Kerja</option>
              <option value="EMPLOYER">Perusahaan / Recruiter</option>
            </select>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Memproses..." : "Daftar"}
          </Button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-6">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="text-indigo-600 font-medium hover:underline"
          >
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
}
