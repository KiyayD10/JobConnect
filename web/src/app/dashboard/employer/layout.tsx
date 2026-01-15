"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import { Menu, X } from "lucide-react";
import styles from "../dashboard.module.css";

export default function EmployerLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user || user.role !== "EMPLOYER") {
      router.replace("/auth/login");
    }
  }, [user, loading, router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>;
  if (!user || user.role !== "EMPLOYER") return null;

  const handleLogout = () => {
    logout();
    router.replace("/auth/login");
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerContent}>
       
          <Link href="/dashboard/employer" className={styles.logo}>
            <Image src="/images/logo.png" alt="Logo" width={240} height={60} priority />
          </Link>

          <button className={styles.mobileMenuBtn} onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ""}`}>
            <Link href="/dashboard/employer" onClick={() => setIsMenuOpen(false)}>Beranda</Link>
            <Link href="/dashboard/employer/jobs" onClick={() => setIsMenuOpen(false)}>Lowongan Saya</Link>
            <Link href="/dashboard/employer/jobs/add" onClick={() => setIsMenuOpen(false)}>Post Job</Link>
            <Link href="/dashboard/employer/candidates" onClick={() => setIsMenuOpen(false)}>Kandidat</Link>
            <Link href="/dashboard/employer/profile" onClick={() => setIsMenuOpen(false)}>Profil</Link>
            <button onClick={handleLogout} className={styles.logoutMobile}>Logout</button>
          </nav>

          <button onClick={handleLogout} className={styles.logoutDesktop}>
            Logout
          </button>
        </div>
      </header>

      <main className={styles.main}>{children}</main>
    </>
  );
}