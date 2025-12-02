import { error } from "console";
import { NextResponse } from "next/server";

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

        // Lanjut ke cek database
        return NextResponse.json({message: "Validasi berhasil"}, {status: 200})
    } catch (error) {
        return NextResponse.json({error: "Terjadi kesalahan"}, {status: 500})
    }
}