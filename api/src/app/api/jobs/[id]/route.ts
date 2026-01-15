import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Helper: Ambil ID dari URL
function getId(request: NextRequest) {
  const segments = new URL(request.url).pathname.split("/").filter(Boolean)
  return segments[segments.length - 1]
}


// Ambil pekerjaan berdasarkan ID
export async function GET(request: NextRequest) {
  try {
    const id = getId(request)
    if (!id) return NextResponse.json({ error: "ID tidak valid" }, { status: 400 })

    const job = await prisma.job.findUnique({
      where: { id },
      include: { user: { select: { id: true, name: true, email: true, role: true } } },
    })

    if (!job) return NextResponse.json({ error: "Lowongan tidak ditemukan" }, { status: 404 })

    return NextResponse.json(job, { status: 200 })
  } catch (error) {
    console.error("GET job by ID error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}

// UPDATE JOB (Hanya Owner/Admin)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const id = getId(request)
    const { userId, title, company, location, type, salary, description, requirements } = body

    if (!id || !userId) return NextResponse.json({ error: "ID atau userId tidak valid" }, { status: 400 })
    if (!title || !company || !location || !description || !requirements) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 })
    }

    const existingJob = await prisma.job.findUnique({ where: { id } })
    if (!existingJob) return NextResponse.json({ error: "Lowongan tidak ditemukan" }, { status: 404 })

    const isOwner = existingJob.userId === userId
    const isAdmin = body.role === "ADMIN" 

    if (!isOwner && !isAdmin) return NextResponse.json({ error: "Anda bukan pemilik lowongan ini" }, { status: 403 })

    const updatedJob = await prisma.job.update({
      where: { id },
      data: { title, company, location, type, salary, description, requirements },
    })

    return NextResponse.json({ message: "Update sukses", job: updatedJob }, { status: 200 })
  } catch (error) {
    console.error("PUT job error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}


// DELETE JOB (Hanya Owner/Admin)
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const id = getId(request)
    const userId = body.userId
    const role = body.role

    if (!id || !userId) return NextResponse.json({ error: "ID atau userId tidak valid" }, { status: 400 })

    const existingJob = await prisma.job.findUnique({ where: { id } })
    if (!existingJob) return NextResponse.json({ error: "Lowongan tidak ditemukan" }, { status: 404 })

    const isOwner = existingJob.userId === userId
    const isAdmin = role === "ADMIN"

    if (!isOwner && !isAdmin) return NextResponse.json({ error: "Anda bukan pemilik lowongan ini" }, { status: 403 })

    await prisma.job.delete({ where: { id } })

    return NextResponse.json({ message: "Lowongan berhasil dihapus" }, { status: 200 })
  } catch (error) {
    console.error("DELETE job error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}
