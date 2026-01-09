import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword } from "@/lib/auth"; // compare hash

const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:3001",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// Preflight CORS
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// Login user
export async function POST(request: NextRequest): Promise<Response> {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validasi field wajib
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan password harus diisi" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Cek user di database
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, password: true, name: true, role: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Email tidak terdaftar" },
        { status: 404, headers: corsHeaders }
      );
    }

    // Compare password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Password salah" },
        { status: 401, headers: corsHeaders }
      );
    }

    // Hapus password sebelum kirim ke frontend
    const { password: _, ...userWithoutPassword } = user;

    // Kembalikan user info → frontend simpan di localStorage
    return NextResponse.json(
      { message: "Login berhasil", user: userWithoutPassword },
      { status: 200, headers: corsHeaders }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Login error:", error.message);
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders }
    );
  }
}
