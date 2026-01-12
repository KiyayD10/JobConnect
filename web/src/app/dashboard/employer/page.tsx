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

  const stats : StatItem[] = [
    {
      title: "Kelola Lowongan",
      description: "Lihat, edit, dan pantau status semua lowongan kerja Anda.",
      icon: <Briefcase size={24} color="#2563eb" />,
      link: "/dashboard/employer/jobs",
      bgColor: "#eff6ff",
    },
    {
      title: "Kandidat Pelamar",
      description: "Review CV dan profil kandidat yang telah melamar.",
      icon: <Users size={24} color="#9333ea" />,
      link: "/dashboard/employer/applicants",
      bgColor: "#f5f3ff",
    },
    {
      title: "Profil Perusahaan",
      description: "Update informasi dan branding perusahaan Anda.",
      icon: <Building2 size={24} color="#ea580c" />,
      link: "/employer/profile",
      bgColor: "#fff7ed",
    },
  ];

  return (
    <div className={styles.dbContainer}>
      <div className={styles.contentWrapper}>
        
        {/* Welcome Header */}
        <div className={styles.welcomeHeader}>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Halo, {user?.name || "User"}! 👋
            </h1>
            <p className="text-gray-600 mt-2">
              Apa yang ingin Anda lakukan hari ini?
            </p>
          </div>
          <button
            onClick={() => router.push("/dashboard/employer/jobs/add")}
            className={styles.btnPost}
          >
            <PlusCircle size={20} />
            Pasang Lowongan Baru
          </button>
        </div>

        {/* Stats Grid */}
        <div className={styles.dbGrid}>
          {stats.map((item, index) => (
            <div
              key={index}
              onClick={() => router.push(item.link)}
              className={styles.statCard}
            >
              <div className={styles.iconBox} style={{ backgroundColor: item.bgColor }}>
                {item.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-gray-500 mb-4">{item.description}</p>
              
              <div className="flex items-center text-blue-600 font-semibold text-sm">
                Buka Sekarang <ArrowRight size={16} className="ml-1" />
              </div>
            </div>
          ))}
        </div>

        {/* Insight Section */}
        <div className={styles.insightSection}>
          <div className="flex items-center gap-4">
            <TrendingUp size={32} />
            <div>
              <h2 className="text-xl font-bold">Tips Rekrutmen</h2>
              <p className="text-sm opacity-90">Tingkatkan kualitas deskripsi pekerjaan Anda.</p>
            </div>
          </div>
          <button 
            onClick={() => router.push("/employer/tips")}
            className="bg-white text-blue-700 px-6 py-2 rounded-lg font-bold"
          >
            Lihat Tips
          </button>
        </div>

      </div>
    </div>
  );
}