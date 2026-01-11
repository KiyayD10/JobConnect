"use client";

import { useEffect, useState } from "react";
import api from "@/src/lib/axios";
import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";

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

        const myJobs = res.data.jobs.filter(
          (job) => job.user.id === user.id
        );

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
    if (!confirm("Hapus lowongan ini?")) return;

    try {
      await api.delete(`/jobs/${id}`, {
        data: {
          userId: user.id,
          role: user.role,
        },
      });

      setJobs((prev) => prev.filter((job) => job.id !== id));
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus lowongan");
    }
  };


  if (!user) return null;
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: 24 }}>
      <h1>Lowongan Saya</h1>

      <button
        style={{ marginBottom: 16 }}
        onClick={() => router.push("/employer/jobs/add")}
      >
        + Tambah Job
      </button>

      {jobs.length === 0 ? (
        <p>Belum ada lowongan</p>
      ) : (
        <ul>
          {jobs.map((job) => (
            <li key={job.id} style={{ marginBottom: 20 }}>
              <h3>{job.title}</h3>
              <p>
                {job.company} • {job.location}
              </p>

              <button
                onClick={() =>
                  router.push(`/employer/jobs/edit/${job.id}`)
                }
              >
                Edit
              </button>

              <button
                style={{ marginLeft: 8 }}
                onClick={() => handleDelete(job.id)}
              >
                Hapus
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
