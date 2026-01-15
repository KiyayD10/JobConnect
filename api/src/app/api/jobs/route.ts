import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma, JobType } from "@prisma/client";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

// Helper: Ambil user dari token (Sesuai dengan API Login: userId)
async function getUserFromRequest(request: NextRequest) {
  try {
    const auth = request.headers.get("authorization");
    if (!auth?.startsWith("Bearer ")) return null;
    const token = auth.split(" ")[1];
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    // SESUAIKAN: Menggunakan userId sesuai payload Login
    return payload as { userId: string; role: string };
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    const { searchParams } = new URL(request.url);
    const where: Prisma.JobWhereInput = {};

    // Jika EMPLOYER, filter hanya miliknya sendiri berdasarkan user.userId
    if (user && user.role === "EMPLOYER") {
      where.userId = user.userId; 
    } else {
      const type = searchParams.get("type");
      const location = searchParams.get("location");
      const search = searchParams.get("search");

      if (type && Object.values(JobType).includes(type as JobType)) {
        where.type = type as JobType;
      }
      if (location) {
        where.location = { contains: location, mode: "insensitive" };
      }
      if (search) {
        where.OR = [
          { title: { contains: search, mode: "insensitive" } },
          { company: { contains: search, mode: "insensitive" } },
        ];
      }
    }

    const jobs = await prisma.job.findMany({
      where,
      include: { user: { select: { id: true, name: true, role: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ jobs });
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || user.role !== "EMPLOYER") {
      return NextResponse.json({ error: "Hanya Employer yang diizinkan" }, { status: 401 });
    }

    const body = await request.json();
    const { title, company, location, type, salary, description, requirements } = body;

    if (!title || !company || !location || !description || !requirements) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    const job = await prisma.job.create({
      data: {
        title,
        company,
        location,
        type: (type as JobType) || JobType.FULLTIME,
        salary: salary ? String(salary) : null,
        description,
        requirements: String(requirements),
        userId: user.userId, // MENGGUNAKAN userId dari token
      },
    });

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Gagal membuat lowongan" }, { status: 500 });
  }
}