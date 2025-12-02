import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"
import { hashPassword } from "@/lib/auth"

export async function POST(request: NextResponse): Promise<Response> {
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

        // Enkripsi password sebelum disimpan
        const hashedPassword = await hashPassword(password)

        // Simpan user ke DataBase
        return NextResponse.json({ message: 'User ready to create' })

        // Lanjut ke cek database
        return NextResponse.json({message: "Validasi berhasil"}, {status: 200})
    } catch (error) {
        return NextResponse.json({error: "Terjadi kesalahan"}, {status: 500})
    }
}