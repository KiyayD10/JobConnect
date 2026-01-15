"use client";
import React from 'react'
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import api from '@/src/lib/axios';
import { toast } from 'sonner';
export default function EditJobPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id;

    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
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
  }, [id, router]);
    return (
        <div>

        </div>
    )
}
