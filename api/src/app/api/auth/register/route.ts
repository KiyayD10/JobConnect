import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"
import { hashPassword, generateToken } from "@/lib/auth"

const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:3001",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: NextRequest): Promise<Response> {
    try{
        const body = await request.json()
        const {email, password, name, role} = body

        // Validasi field (wajib)
        if (!email || !password || !name) {
            return NextResponse.json(
                { error: "Semua field harus diisi" }, 
                { status: 400 }
            )
        }

        // Validasi format email (Regex)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                {error: "Format email tidak valid"},
                {status: 400}
            )
        }

        // Validasi panjang password
        if (password.length < 6) {
            return NextResponse.json(
                {error: "Password minimal 6 karakter"},
                {status: 400}
            )
        }

        // Cek apakah user sudah ada
        const exsistingUser = await prisma.user.findUnique({
            where: { email },
        })
        if (exsistingUser) {
            return NextResponse.json(
                {error: "Email sudah terdaftar"},
                {status: 409}
            )
        }

        // Enkripsi password sebelum disimpan (Hashing)
        const hashedPassword = await hashPassword(password);

        // Simpan user ke database
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: role || 'JOBSEEKER',
            },
            // Pilih field yang mau dikembalikan (Password jangan dikirim balik!)
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
            },
        })

        // Buat Token (JWT)
        const token = generateToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        })

        // Kembalikan data user + token
        return NextResponse.json(
            {
                message: 'Pengguna berhasil terdaftar',
                user,
                token,
            },
            { status: 201 }
        )

    } catch (error: unknown) {
        // Error Handling
        if (error instanceof Error) {
            console.error("Registration error:", error.message);
        }
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}