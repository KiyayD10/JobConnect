import { NextRequest,NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { comparePassword } from "@/lib/auth"

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

        // Cari di database
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
    }
}