"use client";

import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";
import { 
  Briefcase, 
  Users, 
  Building2, 
  PlusCircle, 
  ArrowRight,
  TrendingUp
} from "lucide-react";

// Definisi tipe data untuk TypeScript
interface StatItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  bgColor: string;
}

export default function EmployerPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = [
    {
      title: "Kelola Lowongan",
      description: "Lihat, edit, dan pantau status semua lowongan kerja Anda.",
      icon: <Briefcase className="text-blue-600" size={24} />,
      link: "/dashboard/employer/jobs",
      color: "bg-blue-50",
    },
    {
      title: "Kandidat Pelamar",
      description: "Review CV dan profil kandidat yang telah melamar.",
      icon: <Users className="text-purple-600" size={24} />,
      link: "/daemployer/applicants",
      color: "bg-purple-50",
    },
    {
      title: "Profil Perusahaan",
      description: "Update informasi dan branding perusahaan Anda.",
      icon: <Building2 className="text-orange-600" size={24} />,
      link: "/employer/profile",
      color: "bg-orange-50",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-10">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Welcome Header */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Halo, {user?.name}! 👋
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Senang melihat Anda kembali. Apa yang ingin Anda lakukan hari ini?
            </p>
          </div>
          <button
            onClick={() => router.push("dashboard/employer/jobs/add")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 active:scale-95"
          >
            <PlusCircle size={20} />
            Pasang Lowongan Baru
          </button>
        </div>

        {/* Stats / Quick Summary (Opsional) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map((item, index) => (
            <div
              key={index}
              onClick={() => router.push(item.link)}
              className="group bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:border-blue-300 hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
            >
              <div className={`${item.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-500 mb-4">{item.description}</p>
              
              <div className="flex items-center text-blue-600 font-semibold text-sm group-hover:gap-2 transition-all">
                Buka Sekarang <ArrowRight size={16} />
              </div>

              {/* Dekorasi kecil di pojok */}
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                {item.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Insight Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-full">
              <TrendingUp size={32} />
            </div>
            <div>
              <h2 className="text-xl font-bold">Dapatkan Talenta Terbaik</h2>
              <p className="opacity-90 text-sm">Lowongan yang lengkap dan jelas menarik 3x lebih banyak pelamar berkualitas.</p>
            </div>
          </div>
          <button 
            onClick={() => router.push("/employer/tips")}
            className="bg-white text-blue-700 px-6 py-2 rounded-lg font-bold text-sm hover:bg-blue-50 transition-colors"
          >
            Lihat Tips Rekrutmen
          </button>
        </div>

      </div>
    </div>
  );
}