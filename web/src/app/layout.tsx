import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/src/context/AuthContext'

const inter = Inter({ subsets: ['latin'] })
export const metadata: Metadata = {
title: 'JobConnect',
description: 'Find your dream job here',
}
export default function RootLayout({
  children,
  }: {
  children: React.ReactNode
  }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
        {children}
        </AuthProvider>
      </body>
    </html>
  )
}
