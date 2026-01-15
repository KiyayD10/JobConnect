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
  createdAt: string;
  user: JobUser;
};

export default function EmployerJobsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // ⛔ Tunggu auth selesai
    if (authLoading) return;

    // ⛔ Belum login
    if (!user) {
      router.replace("/login");
      return;
    }

    // ⛔ Bukan employer
    if (user.role !== "EMPLOYER") {
      router.replace("/unauthorized");
      return;
    }

    const fetchJobs = async () => {
      try {
        // ✅ Backend sudah filter berdasarkan JWT
        const res = await api.get<{ jobs: Job[] }>("/jobs");
        setJobs(res.data.jobs);
      } catch {
        setError("Gagal mengambil data lowongan");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [user, authLoading, router]);

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus lowongan ini?")) return;

    try {
      // ❌ JANGAN kirim userId / role
      await api.delete(`/jobs/${id}`);
      setJobs((prev) => prev.filter((job) => job.id !== id));
      toast.success("Lowongan berhasil dihapus");
    } catch {
      toast.error("Gagal menghapus lowongan");
    }
  };

  if (loading || authLoading) {
    return (
      <div className={styles.dbContainer}>
        <div style={{ textAlign: "center", padding: "4rem" }}>
          Memuat data...
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dbContainer}>
      <div className={styles.contentWrapper}>
        {/* Header */}
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

        {/* Content */}
        {error ? (
          <div className={styles.errorText}>{error}</div>
        ) : jobs.length === 0 ? (
          <div className={styles.formCard} style={{ textAlign: "center", padding: "4rem" }}>
            <Briefcase size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold">Belum ada lowongan</h3>
            <p className="text-gray-500 mb-6">
              Mulai rekrut kandidat terbaik dengan memasang lowongan pertama Anda.
            </p>
            <button
              onClick={() => router.push("/dashboard/employer/jobs/add")}
              className={styles.btnSave}
            >
              Pasang Lowongan Sekarang
            </button>
          </div>
        ) : (
          <div className={styles.jobList}>
            {jobs.map((job) => (
              <div key={job.id} className={styles.jobItem}>
                <div className={styles.jobInfo}>
                  <h3 className="text-xl font-bold">{job.title}</h3>
                  <div className={styles.jobMeta}>
                    <span><Building2 size={16} /> {job.company}</span>
                    <span><MapPin size={16} /> {job.location}</span>
                    <div className={styles.badge}>
                      <Clock size={14} /> {job.type.replace("_", " ")}
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
