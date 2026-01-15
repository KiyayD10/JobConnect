"use client";

import { useEffect, useState } from "react";
import api from "@/src/lib/axios";
import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";
import { Plus, Edit3, Trash2, MapPin, Building2, Briefcase, Clock } from "lucide-react";
import { toast } from "sonner";
import styles from "../../dashboard.module.css";

type JobUser = {
  id: string;
  name: string;
  role: "JOBSEEKER" | "EMPLOYER" | "ADMIN";
};

type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary?: string;
  requirements?: string;
  createdAt: string;
  user: JobUser;
};

export default function EmployerJobsPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    // Proteksi Role
    if (user.role !== "EMPLOYER" && user.role !== "ADMIN") {
      router.push("/auth/login");
      return;
    }

    const fetchJobs = async () => {
      try {
        setLoading(true);
        // Backend sudah otomatis memfilter job milik user yang login (berdasarkan token)
        const res = await api.get<{ jobs: Job[] }>("/jobs");
        setJobs(res.data.jobs);
      } catch (err: any) {
        setError("Gagal mengambil data lowongan");
        toast.error("Sesi berakhir atau gagal memuat data.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [user, router]);

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus lowongan ini?")) return;

    try {
      // PERBAIKAN: Cukup kirim DELETE ke ID. 
      // Backend akan mengecek Token Anda untuk ijin penghapusan.
      await api.delete(`/jobs/${id}`);
      
      setJobs((prev) => prev.filter((job) => job.id !== id));
      toast.success("Lowongan berhasil dihapus");
    } catch (err: any) {
      const msg = err.response?.data?.error || "Gagal menghapus lowongan";
      toast.error(msg);
    }
  };

  return (
    <div className={styles.dbContainer}>
      <div className={styles.contentWrapper}>
        
        {/* Header Section */}
        <div className={styles.headerSection}>
          <div>
            <h1 className={styles.pageTitle}>Lowongan Saya</h1>
            <p className={styles.pageSubtitle}>
              Kelola daftar lowongan kerja yang telah Anda pasang.
            </p>
          </div>
          <button
            onClick={() => router.push("/dashboard/employer/jobs/add")}
            className={styles.btnPrimary}
          >
            <Plus size={20} />
            Tambah Lowongan
          </button>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex flex-col items-center justify-center p-16 bg-white rounded-2xl shadow-sm">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-500 font-medium">Memuat data lowongan...</p>
          </div>
        ) : error ? (
          <div className="text-center p-10 bg-red-50 text-red-600 rounded-xl border border-red-100">
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="mt-4 underline">Coba lagi</button>
          </div>
        ) : jobs.length === 0 ? (
          <div className={styles.formCard} style={{ textAlign: 'center', padding: '4rem' }}>
            <Briefcase size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold">Belum ada lowongan</h3>
            <p className="text-gray-500 mb-6">Mulai rekrut kandidat terbaik dengan memasang lowongan pertama Anda.</p>
            <button onClick={() => router.push("/dashboard/employer/jobs/add")} className={styles.btnSave}>
              Pasang Lowongan Sekarang
            </button>
          </div>
        ) : (
          <div className={styles.jobList}>
            {jobs.map((job) => (
              <div key={job.id} className={styles.jobItem}>
                <div className={styles.jobInfo}>
                  <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                  <div className={styles.jobMeta}>
                    <span className="flex items-center gap-1">
                      <Building2 size={16} className="text-gray-400" /> {job.company}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={16} className="text-gray-400" /> {job.location}
                    </span>
                    <div className={styles.badge}>
                      <Clock size={14} /> {job.type.replace("_", " ").toLowerCase()}
                    </div>
                  </div>
                </div>

                <div className={styles.actionButtons}>
                  <button
                    onClick={() => router.push(`/dashboard/employer/jobs/edit/${job.id}`)}
                    className={styles.btnEdit}
                  >
                    <Edit3 size={16} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(job.id)}
                    className={styles.btnDelete}
                  >
                    <Trash2 size={16} /> Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}