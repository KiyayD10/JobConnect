import bcrypt from "bcrypt";
import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "rahasia-negara"; // Pastikan sama dengan Login

// 1. Hash Password
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

// 2. Cek Password
export async function comparePassword(plain: string, hashed: string): Promise<boolean> {
  return await bcrypt.compare(plain, hashed);
}

// 3. Helper Validasi Token (Auth Middleware)
export async function authenticateRequest(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const token = authHeader.split(" ")[1];

  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    
    // Kembalikan data user dari token
    return { user: payload as { userId: string, role: string } };
  } catch (error) {
    console.error("Auth error:", error);
    return { error: NextResponse.json({ error: "Token Invalid" }, { status: 401 }) };
  }
}