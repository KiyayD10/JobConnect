"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { useAuth } from "@/src/context/AuthContext";
import api from "@/src/lib/axios";
import styles from "../auth.module.css";

function LoginContent() {
  const router = useRouter();
  const { login } = useAuth();
  const searchParams = useSearchParams();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const displayEmail = isMounted ? email : "";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data.user, res.data.token);
      const role = res.data.user.role;
      if (role === "JOBSEEKER") router.push("/dashboard/jobseeker");
      else if (role === "EMPLOYER") router.push("/dashboard/employer");
      else if (role === "ADMIN") router.push("/dashboard/admin");
      else router.push("/auth/login");

    } catch (err: unknown) {
      const errorData = err as { response?: { data?: { error?: string } } };
      setError(errorData.response?.data?.error || "Login gagal");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.formHeader}>
          <h2 className={styles.title}>Selamat Datang Kembali</h2>
          <p className={styles.subtitle}>Masuk untuk melanjutkan ke JobConnect</p>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form className={styles.form} onSubmit={onSubmit}>
          <Input
            name="email"
            type="email"
            label="Email"
            placeholder="Email"
            required
            value={displayEmail}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            name="password"
            type="password"
            label="Password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Masuk
          </Button>

          <p className={styles.footerText}>
            Belum punya akun?{" "}
            <Link href="/auth/register" className={styles.link}>
              Daftar sekarang
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
export default function LoginPage() {
  return (
    <Suspense fallback={<div className={styles.wrapper}>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}