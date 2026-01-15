"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/src/context/AuthContext";
import styles from "../dashboard.module.css";

export default function EmployerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  // 🔐 Client-side guard
  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/auth/login");
      return;
    }

    if (user.role !== "EMPLOYER") {
      router.replace("/auth/login");
    }
  }, [user, loading, router]);

  // 🔄 Loading state (hindari blank screen)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  // ⛔ Jangan render layout jika bukan employer
  if (!user || user.role !== "EMPLOYER") {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.replace("/auth/login");
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.left}>
          <span className={styles.logo}>
            <Image
              src="/images/logo.png"
              alt="Logo JobConnect"
              width={240}
              height={60}
              priority
            />
          </span>

          <nav className={styles.nav}>
            <Link href="/dashboard/employer">Beranda</Link>
            <Link href="/dashboard/employer/jobs">Lowongan Saya</Link>
            <Link href="/dashboard/employer/jobs/add">Post Job</Link>
            <Link href="/dashboard/employer/candidates">Kandidat</Link>
            <Link href="/dashboard/employer/profile">Profil</Link>
          </nav>
        </div>

        <button onClick={handleLogout} className={styles.logout}>
          Logout
        </button>
      </header>

      <main className={styles.main}>{children}</main>
    </>
  );
}
