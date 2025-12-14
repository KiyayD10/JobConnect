import Image from 'next/image';
import React from 'react'
import styles from './auth.module.css'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className={styles.header}>
        <Image
          src="/images/logo.png"
          alt="Logo JobConnect"
          width={240}
          height={80}
          priority
        />
      </header>

      <main className={styles.main}>
        {children}
      </main>
      
    </>
  );
}

