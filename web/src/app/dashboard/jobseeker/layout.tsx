import Image from "next/image"
import styles from "../dashboard.module.css"

export default function JobseekerLayout({ children }: any) {
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
      <a href="/auth/login">Cari Kerja</a>
      <a href="/dashboard/jobseeker/applications">Lamaran</a>
      <a href="/dashboard/jobseeker/profile">Profil</a>
    </nav>
  </div>
  

  <button className={styles.logout}>Logout</button>
</header>

      <main className={styles.main}>
        {children}
      </main>

    </>
  )
}
