"use client";

import { useEffect, useState } from "react";
import api from "@/src/lib/axios"; 
import { Search, MapPin, Briefcase, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/src/components/ui/button";


export default function HomePage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get("/jobs");
        
        setJobs(res.data.jobs || []);
      } catch (error) {
        console.error("Gagal mengambil data jobs:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="home-wrapper">
      {/* NAVBAR */}
      <nav className="nav-custom">
        <div className="nav-container">
          <Link href="/">
            <Image src="/images/logo.png" alt="Logo" width={240} height={60} className="w-auto h-10" />
          </Link>
          
          <div className="hidden md:flex gap-8 font-semibold text-gray-600">
            <Link href="/auth/login" className="hover:text-blue-600">Cari Kerja</Link>
            <Link href="/auth/login" className="hover:text-blue-600">Untuk Perusahaan</Link>
          </div>

          <div className="flex gap-3">
            <Link href="/auth/login"><Button variant="ghost">Masuk</Button></Link>
            <Link href="/auth/register">
              <Button className="bg-blue-600 rounded-full text-white">Daftar</Button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-badge">
          <Star size={14} fill="currentColor" /> PLATFORM KARIR TERPERCAYA
        </div>
        
        <h1 className="hero-title">
          Temukan Karier <br /> <span>Terbaikmu Disini.</span>
        </h1>
        
        <div className="search-container">
          <div className="search-input-group">
            <Search className="text-blue-500 mr-3" size={22} />
            <input type="text" placeholder="Posisi atau Skill" className="search-input" />
          </div>
          <div className="search-input-group border-mobile">
            <MapPin className="text-gray-400 mr-3" size={20} />
            <input type="text" placeholder="Lokasi" className="search-input" />
          </div>
          <Button className="search-button">Cari Sekarang</Button>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 py-20">
        <div className="section-header">
           <h2 className="text-3xl font-black">Lowongan Populer</h2>
           <div className="header-line"></div>
        </div>

        {isLoading ? (
          <div className="job-grid">
            {[1, 2, 3].map((n) => (
              <div key={n} className="skeleton-card"></div>
            ))}
          </div>
        ) : (
          <div className="job-grid">
            {jobs.slice(0, 6).map((job) => (
              <div key={job.id} className="job-card">
                <div className="card-top">
                  <div className="icon-wrapper">
                    <Briefcase className="text-blue-600" size={24} />
                  </div>
                  <span className="job-badge">{job.type}</span>
                </div>
                <h3 className="job-title">{job.title}</h3>
                <p className="company-name">{job.company}</p>
                <div className="card-footer">
                  <div className="location-meta">
                    <MapPin size={14} /> {job.location}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="employer-banner">
          <h2 className="banner-title">Pasang Lowongan Sekarang</h2>
          <p className="banner-desc">Temukan talenta terbaik untuk perusahaan Anda bersama JobConnect.</p>
          <Link href="/auth/register">
            <Button className="banner-button">
              Mulai Pasang Lowongan
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}