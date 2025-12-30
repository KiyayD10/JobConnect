import Image from "next/image"
import styles from "../dashboard.module.css"
import Link from "next/link"

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

                    <nav className={styles.navLeft}>
                        <Link href="/dashboard/admin">Dashboard</Link>
                        <Link href="/dashboard/admin/users">Kelola User</Link>
                        <Link href="/dashboard/admin/jobs">Kelola Job</Link>
                        <Link href="/dashboard/admin/monitoring">Monitoring</Link>
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
