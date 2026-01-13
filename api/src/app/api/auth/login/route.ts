import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword } from "@/lib/auth";
import { SignJWT } from "jose"; 

const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:3001",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: "Email tidak terdaftar" }, { status: 404, headers: corsHeaders });
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Password salah" }, { status: 401, headers: corsHeaders });
    }

    // Buat Token JWT 
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "rahasia-negara");
    const token = await new SignJWT({ userId: user.id, role: user.role })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(secret);

    // Buat object baru agar tidak perlu destructuring user.password yang unused
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    return NextResponse.json(
      { message: "Login berhasil", token, user: userData },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500, headers: corsHeaders });
  }
}