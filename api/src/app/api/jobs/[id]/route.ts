import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";
import { JobType } from "@prisma/client";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

async function getUserFromRequest(request: NextRequest) {
  try {
    const auth = request.headers.get("authorization");
    if (!auth?.startsWith("Bearer ")) return null;
    const token = auth.split(" ")[1];
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    // SESUAIKAN: Menggunakan userId
    return payload as { userId: string; role: string };
  } catch {
    return null;
  }
}

function getId(request: NextRequest) {
  const segments = new URL(request.url).pathname.split("/").filter(Boolean);
  return segments[segments.length - 1];
}

export async function GET(request: NextRequest) {
  try {
    const id = getId(request);
    const job = await prisma.job.findUnique({
      where: { id },
      include: { user: { select: { id: true, name: true, role: true } } },
    });
    if (!job) return NextResponse.json({ error: "Lowongan tidak ditemukan" }, { status: 404 });
    return NextResponse.json(job);
  } catch {
    return NextResponse.json({ error: "Gagal memuat data" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const id = getId(request);
    const body = await request.json();
    const existingJob = await prisma.job.findUnique({ where: { id } });

    if (!existingJob) return NextResponse.json({ error: "Lowongan tidak ditemukan" }, { status: 404 });

    // Validasi kepemilikan menggunakan user.userId
    if (existingJob.userId !== user.userId && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }

    const updatedJob = await prisma.job.update({
      where: { id },
      data: {
        title: body.title || existingJob.title,
        company: body.company || existingJob.company,
        location: body.location || existingJob.location,
        type: (body.type as JobType) || existingJob.type,
        salary: body.salary !== undefined ? String(body.salary) : existingJob.salary,
        description: body.description || existingJob.description,
        requirements: String(body.requirements || existingJob.requirements),
      },
    });

    return NextResponse.json(updatedJob);
  } catch {
    return NextResponse.json({ error: "Gagal memperbarui data" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const id = getId(request);
    const existingJob = await prisma.job.findUnique({ where: { id } });

    if (!existingJob) return NextResponse.json({ error: "Lowongan tidak ditemukan" }, { status: 404 });

    // Validasi kepemilikan menggunakan user.userId
    if (existingJob.userId !== user.userId && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }

    await prisma.job.delete({ where: { id } });
    return NextResponse.json({ message: "Lowongan berhasil dihapus" });
  } catch {
    return NextResponse.json({ error: "Gagal menghapus lowongan" }, { status: 500 });
  }
}