import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Prisma, JobType } from "@prisma/client"

// =======================
// GET JOBS
// =======================
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const location = searchParams.get("location")
    const search = searchParams.get("search")

    const where: Prisma.JobWhereInput = {}

    if (type) where.type = type as JobType

    if (location) {
      where.location = {
        contains: location,
        mode: "insensitive",
      }
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { company: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ]
    }

    const jobs = await prisma.job.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ jobs })
  } catch  {
    return NextResponse.json(
      { error: "Gagal mengambil data job" },
      { status: 500 }
    )
  }
}

// =======================
// CREATE JOB
// =======================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      company,
      location,
      type,
      salary,
      description,
      requirements,
      userId, // 👈 DARI FRONTEND
    } = body

    if (!title || !company || !location || !description || !requirements || !userId) {
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
        userId,
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
