"use client";

import { useEffect, useState } from "react";
import api from "@/src/lib/axios";
import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";
import { Plus, Edit3, Trash2, MapPin, Building2, Briefcase, Clock } from "lucide-react";
import { toast } from "sonner";

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
  const { user } = useAuth();
  const router = useRouter();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    if (user.role !== "EMPLOYER") {
      router.push("/login");
      return;
    }

    const fetchJobs = async () => {
      try {
        const res = await api.get<{ jobs: Job[] }>("/jobs");
        const myJobs = res.data.jobs.filter((job) => job.user.id === user.id);
        setJobs(myJobs);
      } catch (err) {
        console.error(err);
        setError("Gagal mengambil data lowongan");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [user, router]);

  const handleDelete = async (id: string) => {
    if (!user) return;
    if (!confirm("Apakah Anda yakin ingin menghapus lowongan ini? Tindakan ini tidak dapat dibatalkan.")) return;

    try {
      await api.delete(`/jobs/${id}`, {
        data: { userId: user.id, role: user.role },
      });
      setJobs((prev) => prev.filter((job) => job.id !== id));
      toast.success("Lowongan berhasil dihapus");
    } catch (err) {
      console.error(err);
      toast.error("Gagal menghapus lowongan");
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Lowongan Saya</h1>
            <p className="text-gray-600 mt-1">Kelola daftar lowongan kerja yang telah Anda pasang.</p>
          </div>
          <button
            onClick={() => router.push("/dashboard/employer/jobs/add")}
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-all shadow-sm active:scale-95"
          >
            <Plus size={20} />
            Tambah Lowongan
          </button>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-500">Memuat lowongan...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200 text-center">
            {error}
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 py-16 px-4 text-center">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="text-gray-400" size={32} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Belum ada lowongan</h3>
            <p className="text-gray-500 max-w-sm mx-auto mt-2">
              Anda belum memposting lowongan kerja apapun. Mulai rekrut kandidat terbaik sekarang!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {jobs.map((job) => (
              <div 
                key={job.id} 
                className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                    {job.title}
                  </h3>
                  
                  <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <Building2 size={16} className="text-gray-400" />
                      {job.company}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin size={16} className="text-gray-400" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md text-xs font-medium uppercase tracking-wider">
                      <Clock size={14} />
                      {job.type.replace("_", " ")}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 border-t md:border-t-0 pt-4 md:pt-0">
                  <button
                    onClick={() => router.push(`/employer/jobs/edit/${job.id}`)}
                    className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                  >
                    <Edit3 size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(job.id)}
                    className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-medium transition-colors"
                  >
                    <Trash2 size={16} />
                    Hapus
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