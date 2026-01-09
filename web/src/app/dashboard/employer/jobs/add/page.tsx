"use client"

import { useState } from "react"
import api from "@/src/lib/axios"
import axios from "axios"

export default function AddJobPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const testApi = async () => {
    try {
      setLoading(true)
      setMessage("")

      const res = await api.get("/jobs")
      console.log("HASIL:", res.data)

      setMessage("✅ GET /jobs berhasil (cookie terkirim)")
    } catch (err: unknown) {
      console.error(err)

      if (axios.isAxiosError(err)) {
        setMessage(err.response?.data?.error || "❌ Axios error")
      } else {
        setMessage("❌ Error tidak diketahui")
      }
    } finally {
      setLoading(false)
    }
  }

  const createJob = async () => {
    try {
      setLoading(true)
      setMessage("")

      const res = await api.post("/jobs", {
        title: "Frontend Developer",
        company: "JobConnect",
        location: "Bandung",
        type: "FULLTIME",
        salary: 8000000,
        description: "Mengerjakan UI aplikasi",
        requirements: "React, Next.js",
      })

      console.log("CREATED:", res.data)
      setMessage("✅ Lowongan berhasil dibuat")
    } catch (err: unknown) {
      console.error(err)

      if (axios.isAxiosError(err)) {
        setMessage(err.response?.data?.error || "❌ Axios error")
      } else {
        setMessage("❌ Error tidak diketahui")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 20, fontWeight: "bold" }}>
        Add Job (Employer)
      </h1>

      <div style={{ marginTop: 16 }}>
        <button
          onClick={testApi}
          disabled={loading}
          style={{
            padding: "10px 16px",
            marginRight: 8,
            background: "#2563eb",
            color: "white",
          }}
        >
          TEST GET /jobs
        </button>

        <button
          onClick={createJob}
          disabled={loading}
          style={{
            padding: "10px 16px",
            background: "#16a34a",
            color: "white",
          }}
        >
          CREATE JOB
        </button>
      </div>

      {message && (
        <p style={{ marginTop: 16 }}>{message}</p>
      )}
    </div>
  )
}
