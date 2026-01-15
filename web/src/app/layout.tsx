import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/src/context/AuthContext";
import Image from "next/image";
import { Toaster } from "../components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
        <Toaster position="top-center" richColors />
        <footer className="border-t border-gray-100 py-4 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
          <Image
            src="/images/logo.png"
            alt="Logo JobConnect"
            width={200}
            height={50}
            className="opacity-80 grayscale hover:grayscale-0 transition-all mb-2"
          />
          <p className="text-sm text-gray-400 font-bold tracking-widest uppercase">© 2026 JobConnect – Solusi Karir Digital</p>
        </div>
      </footer>
      </body>
      
    </html>
    
  );
}
