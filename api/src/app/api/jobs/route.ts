import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Prisma, JobType } from "@prisma/client"
import { jwtVerify } from "jose"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!)

async function getUserFromRequest(request: NextRequest) {
  const auth = request.headers.get("authorization")
  if (!auth) return null

  const token = auth.split(" ")[1]
  const { payload } = await jwtVerify(token, JWT_SECRET)

  return payload as {
    id: string
    role: string
    name: string
  }
}



// Ambil pekerjaan
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const location = searchParams.get("location")
    const search = searchParams.get("search")

    const where: Prisma.JobWhereInput = {}

    if (type) where.type = type as JobType
    if (location) {
      where.location = { contains: location, mode: "insensitive" }
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { company: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ]
    }

    // 🔐 KHUSUS EMPLOYER
    if (user.role === "EMPLOYER") {
      where.userId = user.id
    }

    const jobs = await prisma.job.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, role: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ jobs })
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil data job" },
      { status: 500 }
    )
  }
}


// Buat pekerjaan
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (user.role !== "EMPLOYER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const {
      title,
      company,
      location,
      type,
      salary,
      description,
      requirements,
    } = body

    if (!title || !company || !location || !description || !requirements) {
      return NextResponse.json(
        { error: "Data tidak lengkap" },
        { status: 400 }
      )
    }

    const job = await prisma.job.create({
      data: {
        title,
        company,
        location,
        type: type || "FULLTIME",
        salary: salary || null,
        description,
        requirements,
        userId: user.id, // 🔐 AMAN
      },
    })

    return NextResponse.json(job, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: "Gagal membuat lowongan" },
      { status: 500 }
    )
  }
}
