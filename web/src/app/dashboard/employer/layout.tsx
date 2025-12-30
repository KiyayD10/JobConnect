import styles from "./layout.module.css"
import Link from "next/link"

export default function EmployerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <header className={styles.header}>
        {/* KIRI */}
        <nav className={styles.navLeft}>
          <Link href="/dashboard/employer">Dashboard</Link>
          <Link href="/dashboard/employer/jobs">Lowongan Saya</Link>
          <Link href="/dashboard/employer/candidates">Kandidat</Link>
          <Link href="/dashboard/employer/post-job" className={styles.cta}>
            + Post Job
          </Link>
        </nav>

        {/* KANAN */}
        <div className={styles.navRight}>
          <button className={styles.logout}>Logout</button>
        </div>
      </header>

      <main className={styles.main}>{children}</main>
    </>
  )
}
