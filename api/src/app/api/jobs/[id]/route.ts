import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { jwtVerify } from "jose"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!)

async function getUserFromRequest(request: NextRequest) {
  const auth = request.headers.get("authorization")
  if (!auth?.startsWith("Bearer ")) return null

  const token = auth.split(" ")[1]

  const { payload } = await jwtVerify(token, JWT_SECRET)
  return payload as { id: string; role: string }
}


// Helper: Ambil ID dari URL
function getId(request: NextRequest) {
  const segments = new URL(request.url).pathname.split("/").filter(Boolean)
  return segments[segments.length - 1]
}


// Ambil pekerjaan berdasarkan ID
export async function GET(request: NextRequest) {
  try {
    const id = getId(request)

    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true, role: true } },
      },
    })

    if (!job) {
      return NextResponse.json({ error: "Lowongan tidak ditemukan" }, { status: 404 })
    }

    return NextResponse.json(job)
  } catch (err) {
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}


// UPDATE JOB (Hanya Owner/Admin)
export async function PUT(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = getId(request)
    const body = await request.json()
    const { title, company, location, type, salary, description, requirements } = body

    if (!title || !company || !location || !description || !requirements) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 })
    }

    const job = await prisma.job.findUnique({ where: { id } })
    if (!job) {
      return NextResponse.json({ error: "Lowongan tidak ditemukan" }, { status: 404 })
    }

    const isOwner = job.userId === user.id
    const isAdmin = user.role === "ADMIN"

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const updatedJob = await prisma.job.update({
      where: { id },
      data: { title, company, location, type, salary, description, requirements },
    })

    return NextResponse.json(updatedJob)
  } catch (err) {
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}



// DELETE JOB (Hanya Owner/Admin)
export async function DELETE(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = getId(request)

    const job = await prisma.job.findUnique({ where: { id } })
    if (!job) {
      return NextResponse.json({ error: "Lowongan tidak ditemukan" }, { status: 404 })
    }

    const isOwner = job.userId === user.id
    const isAdmin = user.role === "ADMIN"

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await prisma.job.delete({ where: { id } })

    return NextResponse.json({ message: "Lowongan berhasil dihapus" })
  } catch (err) {
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}
