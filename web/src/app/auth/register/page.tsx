"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";
import api from "@/src/lib/axios";
import { toast } from "sonner";
import styles from "../auth.module.css";

export default function RegisterPage() {
  const router = useRouter();
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
    await api.post("/auth/register", payload);
    toast.success("Registrasi Berhasil!", {
      description: "Silakan masuk dengan akun yang baru saja dibuat.",
    });

    router.push(`/auth/login?email=${encodeURIComponent(data.email as string)}`);

  } catch (err: any) {
    const errorMsg = err.response?.data?.error || "Pendaftaran gagal";
    toast.error(errorMsg);
    setError(errorMsg);
  } finally {
    setIsLoading(false);
  }
}


 return (
  <div className={styles.wrapper}>
    <div className={styles.card}>
      <div className={styles.formHeader}>
        <h2 className={styles.title}>Buat Akun</h2>
        <p className={styles.subtitle}>Daftar sebagai pencari kerja atau perusahaan</p>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <form className={styles.form} onSubmit={onSubmit}>
        <Input name="name" placeholder="Nama Lengkap" required />
        <Input name="email" type="email" placeholder="Email" required />
        <Input name="password" type="password" placeholder="Password" required minLength={6} />

        <div className={styles.selectGroup}>
          <label className={styles.label}>Daftar sebagai</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as any)}
            className={styles.select}
          >
            <option value="JOBSEEKER">Pencari Kerja</option>
            <option value="EMPLOYER">Perusahaan / Recruiter</option>
          </select>
        </div>

        <Button type="submit" isLoading={isLoading}>
          Daftar Sekarang
        </Button>

        <p className={styles.footerText}>
          Sudah punya akun?{" "}
          <Link href="/auth/login" className={styles.link}>
            Masuk di sini
          </Link>
        </p>
      </form>
    </div>
  </div>
);
}
