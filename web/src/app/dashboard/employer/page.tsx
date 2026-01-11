"use client";

import { useAuth } from "@/src/context/AuthContext";

export default function EmployerPage() {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Dashboard Employer</h1>

      <p>
        Selamat datang, <strong>{user?.name}</strong>
      </p>

      <ul>
        <li>📌 Kelola lowongan pekerjaan</li>
        <li>👥 Lihat kandidat pelamar</li>
        <li>🏢 Update profil perusahaan</li>
      </ul>
    </div>
  );
}
