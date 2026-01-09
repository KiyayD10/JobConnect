import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // Untuk semua request
  const res = NextResponse.next();

  // Tambahkan header CORS
  res.headers.set("Access-Control-Allow-Origin", "http://localhost:3001"); // ganti sesuai frontend
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Jika request OPTIONS (preflight), langsung return 200
  if (req.method === "OPTIONS") {
    return new NextResponse(null, { status: 204, headers: res.headers });
  }

  return res;
}

// Terapkan middleware untuk semua API route
export const config = {
  matcher: "/api/:path*", // semua route di /api/*
};
