"use client";
import React from 'react'
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import api from '@/src/lib/axios';
import { toast } from 'sonner';
import { useAuth } from "@/src/context/AuthContext";
import { ChevronDown, ChevronUp } from "lucide-react";
import styles from "../../../dashboard.module.css";

const jobTypes = [
  { value: "FULLTIME", label: "Full Time" },
  { value: "PARTTIME", label: "Part Time" },
  { value: "INTERNSHIP", label: "Internship" },
  { value: "FREELANCE", label: "Freelance" },
  { value: "CONTRACT", label: "Contract" },
];
export default function EditJobPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id;

    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [showTypeDropdown, setShowTypeDropdown] = useState(false);
    
    // initial state
    const [formData, setFormData] = useState({
        title: "",
        company: "",
        location: "",
        type: "FULL_TIME",
        salary: "",
        description: "",
        requirements: ""
    });
    useEffect(() => {
    async function fetchJobData() {
      try {
        const res = await api.get(`/jobs/${id}`);
        setFormData(res.data);
      } catch (err) {
        toast.error("Lowongan tidak ditemukan");
        router.push("/dashboard/employer");
      } finally {
        setIsFetching(false);
      }
    }
    if (id) fetchJobData();

    const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.put(`/jobs/${id}`, formData);
      toast.success("Berhasil memperbarui lowongan");
      router.push("/dashboard/employer");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Gagal update");
    } finally {
      setIsLoading(false);
    }
  };
  }, [id, router]);
    return (
        <div>
<div className={styles.dbContainer}>
      <div className={styles.contentWrapper}>
        <div className="mb-8">
          <h1 className={styles.pageTitle}>Edit Lowongan Kerja</h1>
          <p className="text-gray-600">Perbarui detail lowongan kerja Anda</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <div className={styles.dbGrid}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Judul Pekerjaan <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className={`${styles.inputField} ${errors.title ? styles.inputError : ""}`}
                disabled={isLoading}
              />
              {errors.title && <p className={styles.errorText}>Judul harus diisi</p>}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Nama Perusahaan <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={form.company}
                onChange={(e) => handleChange("company", e.target.value)}
                className={`${styles.inputField} ${errors.company ? styles.inputError : ""}`}
                disabled={isLoading}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Lokasi <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => handleChange("location", e.target.value)}
                className={`${styles.inputField} ${errors.location ? styles.inputError : ""}`}
                disabled={isLoading}
              />
            </div>

            <div className={styles.inputGroup} style={{ position: 'relative' }}>
              <label className={styles.label}>Tipe Pekerjaan <span className="text-red-500">*</span></label>
              <button
                type="button"
                onClick={() => !isLoading && setShowTypeDropdown(!showTypeDropdown)}
                className={styles.dropdownButton}
                disabled={isLoading}
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

            <div className={styles.inputGroup}>
              <label className={styles.label}>Gaji (Opsional)</label>
              <input
                type="text"
                value={form.salary}
                onChange={(e) => handleChange("salary", e.target.value)}
                className={styles.inputField}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Deskripsi Pekerjaan <span className="text-red-500">*</span></label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className={`${styles.textArea} ${errors.description ? styles.inputError : ""}`}
              rows={4}
              disabled={isLoading}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Persyaratan <span className="text-red-500">*</span></label>
            <textarea
              value={form.requirements}
              onChange={(e) => handleChange("requirements", e.target.value)}
              className={`${styles.textArea} ${errors.requirements ? styles.inputError : ""}`}
              rows={4}
              disabled={isLoading}
            />
          </div>

          <div className={styles.btnActionGroup}>
            <button 
              type="button" 
              onClick={() => router.back()} 
              className={styles.btnSecondary}
              disabled={isLoading}
            >
              Batal
            </button>
            <button 
              type="submit" 
              className={styles.btnPost}
              disabled={isLoading}
            >
              {isLoading ? "Menyimpan..." : "Update Lowongan"}
            </button>
          </div>
        </form>
      </div>
    </div>
        </div>
    )
}
