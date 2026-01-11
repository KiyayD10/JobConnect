"use client";

import { useState } from "react";
import api from "@/src/lib/axios";
import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";

export default function AddJobPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    type: "FULLTIME",
    salary: "",
    description: "",
    requirements: "",
  });

  if (!user || user.role !== "EMPLOYER") {
    router.push("/login");
    return null;
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await api.post("/jobs", {
      ...form,
      userId: user.id,
    });

    router.push("/employer/jobs");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Tambah Lowongan</h1>

      <input
        placeholder="Judul"
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <input
        placeholder="Perusahaan"
        onChange={(e) => setForm({ ...form, company: e.target.value })}
      />

      <input
        placeholder="Lokasi"
        onChange={(e) => setForm({ ...form, location: e.target.value })}
      />

      <select
        value={form.type}
        onChange={(e) => setForm({ ...form, type: e.target.value })}
      >
        <option value="FULLTIME">Full Time</option>
        <option value="PARTTIME">Part Time</option>
        <option value="INTERNSHIP">Internship</option>
      </select>

      <textarea
        placeholder="Deskripsi"
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <textarea
        placeholder="Requirement"
        onChange={(e) =>
          setForm({ ...form, requirements: e.target.value })
        }
      />

      <button type="submit">Simpan</button>
    </form>
  );
}
