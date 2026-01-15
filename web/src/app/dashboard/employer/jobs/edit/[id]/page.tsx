"use client";
import React from 'react'
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import api from '@/src/lib/axios';
import { toast } from 'sonner';
import { useAuth } from "@/src/context/AuthContext";
import { ChevronDown, ChevronUp } from "lucide-react";
import styles from "../../../../dashboard.module.css";

const jobTypes = [
    { value: "FULLTIME", label: "Full Time" },
    { value: "PARTTIME", label: "Part Time" },
    { value: "INTERNSHIP", label: "Internship" },
    { value: "FREELANCE", label: "Freelance" },
    { value: "CONTRACT", label: "Contract" },
];
export default function EditJobPage() {
    const { user } = useAuth();
    const router = useRouter();
    const params = useParams();
    const id = params.id;

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

    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [showTypeDropdown, setShowTypeDropdown] = useState(false);

    useEffect(() => {
        async function fetchJob() {
            try {
                const res = await api.get(`/jobs/${id}`);
                const data = res.data;
                setForm({
                    title: data.title || "",
                    company: data.company || "",
                    location: data.location || "",
                    type: data.type || "",
                    salary: data.salary || "",
                    description: data.description || "",
                    requirements: data.requirements || "",
                });
            } catch (error) {
                toast.error("Lowongan tidak ditemukan");
                router.push("/dashboard/employer/jobs");
            } finally {
                setIsFetching(false);
            }
        }
        if (id) fetchJob();
    }, [id, router]);

    if (!user || user.role !== "EMPLOYER") {
        if (typeof window !== "undefined") router.push("/auth/login");
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

        setIsLoading(true);
        try {
            await api.put(`/jobs/${id}`, form);
            toast.success("Lowongan berhasil diperbarui!");
            router.push("/dashboard/employer/jobs");
            router.refresh();
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Gagal memperbarui lowongan.");
        } finally {
            setIsLoading(false);
        }
    };
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
                                {errors.company && <p className={styles.errorText}>Perusahaan harus diisi</p>}
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
                                {errors.location && <p className={styles.errorText}>Lokasi harus diisi</p>}
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
                            {errors.description && <p className={styles.errorText}>Deskripsi harus diisi</p>}
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
                            {errors.requirements && <p className={styles.errorText}>Persyaratan harus diisi</p>}
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
