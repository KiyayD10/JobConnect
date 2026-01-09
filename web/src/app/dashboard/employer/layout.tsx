import Image from "next/image"
import styles from "../dashboard.module.css"
import Link from "next/link"

export default function EmployerLayout({ children }: any) {
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
                       <Link href="/dashboard/employer/jobs/add">Post Job</Link>
                        <Link href="/dashboard/jobseeker/applications">Lowongan Saya</Link>
                        <Link href="/dashboard/jobseeker/profile">Kandidat</Link>
                        <Link href="/dashboard/jobseeker/profile">Profil</Link>
                    </nav>
                </div>


                <button className={styles.logout}><Link href="/auth/login">Logout</Link></button>
            </header>

            <main className={styles.main}>
                {children}
            </main>

        </>
    )
}
