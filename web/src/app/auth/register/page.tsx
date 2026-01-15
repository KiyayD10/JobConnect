"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";
import axios from "axios";
import api from "@/src/lib/axios";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [role, setRole] = useState<"JOBSEEKER" | "EMPLOYER">("JOBSEEKER");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  setIsLoading(true);
  setError("");

  const formData = new FormData(e.currentTarget);
  const data = Object.fromEntries(formData.entries());
  const payload = { ...data, role };

  try {
    const res = await api.post("/auth/register", payload);

    // ⬇️ LOGIN LANGSUNG (USER + TOKEN)
    login(res.data.user, res.data.token);

    const roleUser = res.data.user.role;
    console.log("Redirecting role:", roleUser);

    if (roleUser === "JOBSEEKER") router.push("/dashboard/jobseeker");
    else if (roleUser === "EMPLOYER") router.push("/dashboard/employer");
    else if (roleUser === "ADMIN") router.push("/dashboard/admin");
    else router.push("/auth/login");

  } catch (err: any) {
    console.error(err);
    setError(err.response?.data?.error || "Registration failed");
  } finally {
    setIsLoading(false);
  }
}


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Buat Akun</h2>
          <p className="mt-2 text-sm text-gray-600">Daftar sebagai pencari kerja atau perusahaan</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">{error}</div>}

        <form className="space-y-6" onSubmit={onSubmit}>
          <Input name="name" placeholder="Nama Lengkap" required />
          <Input name="email" type="email" placeholder="Email" required />
          <Input name="password" type="password" placeholder="Password" required minLength={6} />

          <div>
            <label className="text-sm font-medium text-gray-700">Daftar sebagai</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as "JOBSEEKER" | "EMPLOYER")}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="JOBSEEKER">Pencari Kerja</option>
              <option value="EMPLOYER">Perusahaan / Recruiter</option>
            </select>
          </div>

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Daftar Sekarang
          </Button>

          <p className="text-center text-sm text-gray-600">
            Sudah punya akun?{" "}
            <Link href="/auth/login" className="font-medium text-indigo-600 hover:underline">
              Masuk di sini
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
