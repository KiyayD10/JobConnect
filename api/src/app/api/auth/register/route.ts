import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:3001",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const { email, password, name, role } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Semua field harus diisi" }, { status: 400, headers: corsHeaders });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return NextResponse.json({ error: "Format email tidak valid" }, { status: 400, headers: corsHeaders });

    if (password.length < 6) return NextResponse.json({ error: "Password minimal 6 karakter" }, { status: 400, headers: corsHeaders });

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 409, headers: corsHeaders });

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name, role: role || "JOBSEEKER" },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });

    return NextResponse.json({ message: "Pengguna berhasil terdaftar", user }, { status: 201, headers: corsHeaders });
  } catch (error: unknown) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500, headers: corsHeaders });
  }
}
