"use client";

import { useEffect, useState } from "react";
import { Search, MapPin, Briefcase, DollarSign, ArrowRight, Star, CheckCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image"; // Import Image dari Next.js
import { Button } from "@/src/components/ui/button";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string | null;
  createdAt: string;
}

export default function HomePage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("/api/jobs");
        const data = await res.json();
        setJobs(data.jobs || []);
      } catch (error) {
        console.error("Gagal mengambil data jobs:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* ================= NAVBAR ================= */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          {/* Logo Section */}
          <Link href="/" className="hover:opacity-90 transition-opacity">
            <Image
              src="/images/logo.png"
              alt="Logo JobConnect"
              width={240}
              height={60}
              priority
              className="w-auto h-10 md:h-12" // Ukuran responsif
            />
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600">
            <Link href="auth/login" className="hover:text-blue-600 transition-colors">Cari Kerja</Link>
            <Link href="auth/login" className="hover:text-blue-600 transition-colors">Untuk Perusahaan</Link>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Link href="auth/login">
              <Button variant="ghost" className="font-bold text-gray-700">Masuk</Button>
            </Link>
            <Link href="auth/register">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-full font-bold shadow-lg shadow-blue-100 transition-all active:scale-95">
                Daftar
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-40 pb-20 lg:pt-56 lg:pb-32 overflow-hidden bg-[#fafbff]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-50/50 via-transparent to-transparent -z-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-black mb-8 animate-fade-in">
            <Star size={14} fill="currentColor" />
            PLATFORM KARIR TERPERCAYA
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight leading-[1.1] mb-8">
            Temukan Karier <br />
            <span className="text-blue-600">Terbaikmu Disini.</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg text-gray-500 mb-12 leading-relaxed font-medium">
            Ribuan lowongan kerja dari perusahaan ternama menanti Anda. Mulai langkah besar Anda bersama JobConnect hari ini.
          </p>

          {/* Search Box */}
          <div className="max-w-4xl mx-auto bg-white p-2.5 rounded-2xl shadow-2xl shadow-blue-100/50 flex flex-col md:flex-row gap-2 border border-gray-100">
            <div className="flex-1 flex items-center px-4 py-3">
              <Search className="text-blue-500 mr-3" size={22} />
              <input
                type="text"
                placeholder="Posisi, Skill, atau Perusahaan"
                className="w-full focus:outline-none text-gray-800 font-semibold placeholder:text-gray-400"
              />
            </div>
            <div className="hidden md:flex items-center px-4 py-3 border-x border-gray-100">
              <MapPin className="text-gray-400 mr-3" size={20} />
              <input
                type="text"
                placeholder="Lokasi Kota"
                className="w-full focus:outline-none text-gray-800 font-medium"
              />
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-7 rounded-xl text-lg font-bold transition-all shadow-lg shadow-blue-200">
              Cari Sekarang
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-8 text-sm text-gray-400 font-bold uppercase tracking-widest">
             <div className="flex items-center gap-2"><CheckCircle size={18} className="text-green-500" /> Cepat</div>
             <div className="flex items-center gap-2"><CheckCircle size={18} className="text-green-500" /> Mudah</div>
             <div className="flex items-center gap-2"><CheckCircle size={18} className="text-green-500" /> Terverifikasi</div>
          </div>
        </div>
      </section>

      {/* ================= JOB LIST ================= */}
      <main className="max-w-7xl mx-auto px-4 py-24">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Lowongan Populer</h2>
            <div className="h-1.5 w-20 bg-blue-600 mt-2 rounded-full"></div>
          </div>
          <Link href="auth/login" className="flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all">
            Lihat Semua <ArrowRight size={18} />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-72 bg-gray-50 rounded-3xl animate-pulse border border-gray-100"></div>
            ))}
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {jobs.slice(0, 6).map((job) => (
              <div
                key={job.id}
                className="group bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                    <Briefcase className="text-blue-600 group-hover:text-white transition-colors" size={28} />
                  </div>
                  <span className="bg-blue-50 text-blue-600 text-[10px] font-black tracking-widest uppercase px-4 py-1.5 rounded-full">
                    {job.type}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {job.title}
                </h3>
                <p className="text-gray-500 font-bold mb-6 italic">{job.company}</p>

                <div className="flex flex-col gap-3 pt-6 border-t border-gray-50 mt-auto">
                  <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                    <MapPin size={16} className="text-blue-400" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-900 font-black">
                    <DollarSign size={16} className="text-green-500" />
                    {job.salary || "Gaji Kompetitif"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ================= EMPLOYER SECTION ================= */}
      <section className="max-w-7xl mx-auto px-4 pb-24">
        <div className="relative bg-blue-600 rounded-[48px] p-10 md:p-20 overflow-hidden shadow-2xl shadow-blue-200">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-[100px]"></div>
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-6">
              Pasang Lowongan & Temukan <br /> Talenta Terbaik Anda
            </h2>
            <p className="text-blue-100 text-lg mb-10 max-w-2xl font-medium opacity-90">
              Bergabunglah dengan ribuan perusahaan sukses yang telah menemukan kandidat impian mereka melalui platform JobConnect.
            </p>
            <Link href="auth/login">
              <Button className="bg-white text-blue-600 hover:bg-blue-50 px-12 py-8 rounded-2xl font-black text-xl transition-all hover:scale-105 active:scale-95 shadow-xl">
                Mulai Pasang Lowongan
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-gray-100 py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
          <Image
            src="/images/logo.png"
            alt="Logo JobConnect"
            width={200}
            height={50}
            className="opacity-80 grayscale hover:grayscale-0 transition-all mb-6"
          />
          <p className="text-sm text-gray-400 font-bold tracking-widest uppercase">© 2026 JobConnect – Solusi Karir Digital</p>
        </div>
      </footer>
    </div>
  );
}