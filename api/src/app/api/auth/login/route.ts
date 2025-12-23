import { NextRequest,NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { comparePassword, generateToken } from "@/lib/auth"

const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:3001",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function POST(request: NextRequest): Promise<Response> {
    try {
        const body = await request.json()
        const {email, password} = body

        // Validasi field (wajib)
        if (!email || !password) {
            return NextResponse.json(
                {error: "Email dan password wajib diisi"},
                {status: 400}
            )
        }

        // Cari user berdasarkan email
        const user = await prisma.user.findUnique({
            where: { email },
        })

        // Cek apakah user ada atau tidak
        if (!user) {
            return NextResponse.json(
                {error: "Email atau password salah"},
                {status: 401}
            )
        }

        // Cek password
        const isPasswordValid = await comparePassword(password, user.password)
        if (!isPasswordValid) {
            return NextResponse.json(
                {error: "Email atau password salah"},
                {status: 401}
            )
        }

        // Generate JWT token
        const token = generateToken({ 
            userId: user.id, 
            email: user.email, 
            role: user.role 
        })

        // Buat object response user tanpa password
        const userResponse = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }

        // Login berhasil
        return NextResponse.json({ 
            message: "Login berhasil",
            user: userResponse, 
            token,
        })
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Login Gagal:", error.message)
        }
        return NextResponse.json(
            { error: "Terjadi kesalahan pada server" },
            { status: 500 }
        )
    }
}