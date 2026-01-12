"use client";

import { useEffect, useState } from "react";
import { Search, MapPin, Briefcase, DollarSign } from "lucide-react";
import Navbar from "@/src/components/ui/navbar";
import { Button } from "@/src/components/ui/button";
import Image from "next/image";

// =====================
// Type Job (Prisma)
// =====================
interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string | null;
  createdAt: string;
}

export default function JobseekerDashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // =====================
  // Fetch Jobs
  // =====================
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/jobs"); // ganti ke ENV jika backend terpisah
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
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}

      {/* ================= HERO ================= */}
      <section className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Temukan Pekerjaan <span className="text-yellow-300">Impianmu</span>
          </h1>
          <p className="text-lg mb-10 text-indigo-100">
            Ribuan lowongan dari perusahaan terbaik menantimu
          </p>

          {/* Search Box */}
          <div className="bg-white rounded-xl p-4 flex flex-col md:flex-row gap-4 shadow-lg">
            <input
              type="text"
              placeholder="Posisi atau kata kunci"
              className="flex-1 border rounded-md px-4 py-3 text-gray-800 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Lokasi"
              className="flex-1 border rounded-md px-4 py-3 text-gray-800 focus:outline-none"
            />
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md flex items-center justify-center gap-2 font-medium">
              <Search size={18} />
              Cari Pekerjaan
            </button>
          </div>
        </div>
      </section>

      {/* ================= JOB LIST ================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h2 className="text-2xl font-semibold mb-8 text-gray-900">
          Lowongan Terbaru
        </h2>

        {isLoading ? (
          <div className="text-center py-20 text-gray-500">
            Memuat lowongan pekerjaan...
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                        {job.title}
                      </h3>
                      <p className="text-indigo-600 font-medium">
                        {job.company}
                      </p>
                    </div>
                    <span className="bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded-full font-medium">
                      {job.type}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </div>

                    {job.salary && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        {job.salary}
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      {new Date(job.createdAt).toLocaleDateString("id-ID")}
                    </div>
                  </div>
                </div>

                <Button className="w-full mt-6" variant="outline">
                  Lihat Detail
                </Button>
              </div>
            ))}
          </div>
        )}
      </main>
      
    </div>
  );
}
