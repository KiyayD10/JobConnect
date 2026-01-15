"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/src/context/AuthContext";
import api from "@/src/lib/axios";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  setIsLoading(true);
  setError("");

  const formData = new FormData(e.currentTarget);
  const data = Object.fromEntries(formData.entries());

  try {
    const res = await api.post("/auth/login", data);

    // ⬇️ SIMPAN KE AUTH CONTEXT (USER + TOKEN)
    login(res.data.user, res.data.token);

    // redirect sesuai role
    const role = res.data.user.role;
    console.log("Redirecting role:", role);

    if (role === "JOBSEEKER") router.push("/dashboard/jobseeker");
    else if (role === "EMPLOYER") router.push("/dashboard/employer");
    else if (role === "ADMIN") router.push("/dashboard/admin");
    else router.push("/auth/login");

  } catch (err: any) {
    console.error(err);
    setError(err.response?.data?.error || "Login gagal");
  } finally {
    setIsLoading(false);
  }
}


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">

        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
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
          <Input name="email" type="email" label="Email" placeholder="Email" required />
          <Input name="password" type="password" label="Password" placeholder="Password" required />

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Masuk
          </Button>

          <p className="text-center text-sm text-gray-600">
            Belum punya akun?{" "}
            <Link href="/auth/register" className="text-indigo-600 hover:underline">
              Daftar sekarang
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
