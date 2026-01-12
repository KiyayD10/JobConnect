"use client";

import { useState } from "react";
import api from "@/src/lib/axios";
import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import styles from "../../dashboard.module.css";

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
    // Reset error saat user mulai mengetik
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
      await api.post("/jobs", {
        ...form,
        userId: user.id,
      });

      toast.success("Lowongan berhasil ditambahkan!");
      router.push("/dashboard/employer/jobs");
    } catch (error) {
      toast.error("Gagal menambahkan lowongan. Silakan coba lagi.");
      console.error("Error adding job:", error);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/employer/jobs");
  };

  const handleSelectType = (value: string) => {
    handleChange("type", value);
    setShowTypeDropdown(false);
  };

  return (
    <div style={{ paddingTop: "64px" }} className="container mx-auto px-4 py-8 max-w-4xl">
      <title>Tambah Lowongan Kerja</title>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tambah Lowongan Kerja</h1>
        <p className="text-gray-600 mt-2">Isi detail lowongan kerja yang ingin Anda buka</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Judul Pekerjaan */}
          <div className="space-y-2">
            <label htmlFor="title" className="block text-gray-700 font-medium">
              Judul Pekerjaan <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              placeholder="Contoh: Frontend Developer"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                errors.title ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.title && (
              <p className="text-sm text-red-500">Judul pekerjaan harus diisi</p>
            )}
          </div>

          {/* Nama Perusahaan */}
          <div className="space-y-2">
            <label htmlFor="company" className="block text-gray-700 font-medium">
              Nama Perusahaan <span className="text-red-500">*</span>
            </label>
            <input
              id="company"
              type="text"
              placeholder="Contoh: PT. Contoh Sejahtera"
              value={form.company}
              onChange={(e) => handleChange("company", e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                errors.company ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.company && (
              <p className="text-sm text-red-500">Nama perusahaan harus diisi</p>
            )}
          </div>

          {/* Lokasi */}
          <div className="space-y-2">
            <label htmlFor="location" className="block text-gray-700 font-medium">
              Lokasi <span className="text-red-500">*</span>
            </label>
            <input
              id="location"
              type="text"
              placeholder="Contoh: Jakarta Pusat"
              value={form.location}
              onChange={(e) => handleChange("location", e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                errors.location ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.location && (
              <p className="text-sm text-red-500">Lokasi harus diisi</p>
            )}
          </div>

          {/* Tipe Pekerjaan */}
          <div className="space-y-2 relative">
            <label className="block text-gray-700 font-medium">
              Tipe Pekerjaan <span className="text-red-500">*</span>
            </label>
            
            {/* Custom Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition flex justify-between items-center ${
                  errors.type ? "border-red-500" : "border-gray-300"
                }`}
              >
                <span className={form.type ? "text-gray-900" : "text-gray-500"}>
                  {form.type
                    ? jobTypes.find((jobType) => jobType.value === form.type)?.label
                    : "Pilih tipe pekerjaan"}
                </span>
                {showTypeDropdown ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </button>

              {/* Dropdown Menu */}
              {showTypeDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                  {jobTypes.map((jobType) => (
                    <button
                      key={jobType.value}
                      type="button"
                      onClick={() => handleSelectType(jobType.value)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg flex justify-between items-center"
                    >
                      <span>{jobType.label}</span>
                      {form.type === jobType.value && (
                        <span className="text-blue-600">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {errors.type && (
              <p className="text-sm text-red-500">Tipe pekerjaan harus dipilih</p>
            )}
          </div>

          {/* Gaji */}
          <div className="space-y-2">
            <label htmlFor="salary" className="block text-gray-700 font-medium">
              Gaji
            </label>
            <input
              id="salary"
              type="text"
              placeholder="Contoh: Rp 8.000.000 - Rp 12.000.000"
              value={form.salary}
              onChange={(e) => handleChange("salary", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>
        </div>

        {/* Deskripsi Pekerjaan */}
        <div className="space-y-2">
          <label htmlFor="description" className="block text-gray-700 font-medium">
            Deskripsi Pekerjaan <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            placeholder="Jelaskan tentang pekerjaan, tanggung jawab, dan lingkungan kerja..."
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            rows={6}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none ${
              errors.description ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.description && (
            <p className="text-sm text-red-500">Deskripsi pekerjaan harus diisi</p>
          )}
          <p className="text-sm text-gray-500">
            Gunakan format yang jelas dan mudah dipahami oleh pelamar
          </p>
        </div>

        {/* Persyaratan */}
        <div className="space-y-2">
          <label htmlFor="requirements" className="block text-gray-700 font-medium">
            Persyaratan <span className="text-red-500">*</span>
          </label>
          <textarea
            id="requirements"
            placeholder="Tuliskan persyaratan yang dibutuhkan, seperti skill, pengalaman, pendidikan..."
            value={form.requirements}
            onChange={(e) => handleChange("requirements", e.target.value)}
            rows={6}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none ${
              errors.requirements ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.requirements && (
            <p className="text-sm text-red-500">Persyaratan harus diisi</p>
          )}
          <p className="text-sm text-gray-500">
            Pisahkan setiap poin persyaratan dengan baris baru
          </p>
        </div>

        {/* Tombol Aksi */}
        <div className="flex justify-end gap-4 pt-6 border-t">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Simpan Lowongan
          </button>
        </div>
      </form>
    </div>
  );
}