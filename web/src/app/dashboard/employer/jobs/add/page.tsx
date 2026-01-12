"use client";

import { useState } from "react";
import api from "@/src/lib/axios";
import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import styles from "../../../dashboard.module.css"; 

const jobTypes = [
  { value: "FULLTIME", label: "Full Time" },
  { value: "PARTTIME", label: "Part Time" },
  { value: "INTERNSHIP", label: "Internship" },
  { value: "FREELANCE", label: "Freelance" },
  { value: "CONTRACT", label: "Contract" },
];

export default function AddJobPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    type: "",
    salary: "",
    description: "",
    requirements: "",
  });

  const [errors, setErrors] = useState({
    title: false,
    company: false,
    location: false,
    type: false,
    description: false,
    requirements: false,
  });

  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  if (!user || user.role !== "EMPLOYER") {
    router.push("/auth/login");
    return null;
  }

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: false }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      title: form.title.trim() === "",
      company: form.company.trim() === "",
      location: form.location.trim() === "",
      type: form.type === "",
      description: form.description.trim() === "",
      requirements: form.requirements.trim() === "",
    };
    setErrors(newErrors);
    return !Object.values(newErrors).includes(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Harap lengkapi semua field yang wajib diisi!");
      return;
    }

    try {
      await api.post("/jobs", { ...form, userId: user.id });
      toast.success("Lowongan berhasil ditambahkan!");
      router.push("/dashboard/employer/jobs");
    } catch (error) {
      toast.error("Gagal menambahkan lowongan.");
    }
  };

  return (
    <div className={styles.dbContainer}>
      <div className={styles.contentWrapper}>
        <div className="mb-8">
          <h1 className={styles.dbTitle}>Tambah Lowongan Kerja</h1>
          <p className="text-gray-600">Isi detail lowongan kerja yang ingin Anda buka</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <div className={styles.dbGrid}>
            {/* Judul Pekerjaan */}
            <div className={styles.inputGroup}>
              <label className={styles.label}>Judul Pekerjaan <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className={`${styles.inputField} ${errors.title ? styles.inputError : ""}`}
                placeholder="Contoh: Frontend Developer"
              />
              {errors.title && <p className={styles.errorText}>Judul harus diisi</p>}
            </div>

            {/* Nama Perusahaan */}
            <div className={styles.inputGroup}>
              <label className={styles.label}>Nama Perusahaan <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={form.company}
                onChange={(e) => handleChange("company", e.target.value)}
                className={`${styles.inputField} ${errors.company ? styles.inputError : ""}`}
              />
            </div>

            {/* Lokasi */}
            <div className={styles.inputGroup}>
              <label className={styles.label}>Lokasi <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => handleChange("location", e.target.value)}
                className={`${styles.inputField} ${errors.location ? styles.inputError : ""}`}
              />
            </div>

            {/* Tipe Pekerjaan */}
            <div className={styles.inputGroup} style={{ position: 'relative' }}>
              <label className={styles.label}>Tipe Pekerjaan <span className="text-red-500">*</span></label>
              <button
                type="button"
                onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                className={styles.dropdownButton}
              >
                <span>{form.type ? jobTypes.find(t => t.value === form.type)?.label : "Pilih Tipe"}</span>
                {showTypeDropdown ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              {showTypeDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-xl">
                  {jobTypes.map((type) => (
                    <div 
                      key={type.value}
                      className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                      onClick={() => {
                        handleChange("type", type.value);
                        setShowTypeDropdown(false);
                      }}
                    >
                      {type.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* GAJI (Field Baru) */}
            <div className={styles.inputGroup}>
              <label className={styles.label}>Gaji (Opsional)</label>
              <input
                type="text"
                value={form.salary}
                onChange={(e) => handleChange("salary", e.target.value)}
                className={styles.inputField}
                placeholder="Contoh: Rp 8.000.000 - Rp 12.000.000"
              />
            </div>
          </div>

          {/* DESKRIPSI */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Deskripsi Pekerjaan <span className="text-red-500">*</span></label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className={`${styles.textArea} ${errors.description ? styles.inputError : ""}`}
              rows={4}
              placeholder="Jelaskan tanggung jawab pekerjaan..."
            />
            {errors.description && <p className={styles.errorText}>Deskripsi harus diisi</p>}
          </div>

          {/* PERSYARATAN (Field Baru) */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Persyaratan <span className="text-red-500">*</span></label>
            <textarea
              value={form.requirements}
              onChange={(e) => handleChange("requirements", e.target.value)}
              className={`${styles.textArea} ${errors.requirements ? styles.inputError : ""}`}
              rows={4}
              placeholder="Skill, pengalaman, atau latar belakang pendidikan..."
            />
            {errors.requirements && <p className={styles.errorText}>Persyaratan harus diisi</p>}
          </div>

          {/* Tombol Aksi */}
          <div className={styles.btnActionGroup}>
            <button type="button" onClick={() => router.back()} className={styles.btnSecondary}>
              Batal
            </button>
            <button type="submit" className={styles.btnPost}>
              Simpan Lowongan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}