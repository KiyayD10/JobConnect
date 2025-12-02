import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateRequest } from "@/lib/middleware";

export async function GET(request: NextRequest): Promise<NextResponse> {
    try {
        // Autentikasi user
        const auth = authenticateRequest(request)
        if (auth.error) {
            return auth.error
        }

        const { user } = auth

        // Ambil data dari User dan Relasi Jobs dari database
        const userData = await prisma.user.findUnique({
            where: { id: user.userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                // Relasi job diurutkan dari yang terbaru
                jobs: {
                    orderBy: {
                        createdAt: 'desc'
                    },
                },
            },
        })

        // Validasi kalau user dihapus saat sesi masih aktif
        if (!userData) {
            return NextResponse.json(
                { error: "User tidak ditemukan" }, 
                { status: 404 }
            )
        }

        // kembalikan data user
        return NextResponse.json({ 
            user: userData, 
        })
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Gagal mengambil data profil pengguna:", error.message);
        }
        return NextResponse.json(
            {error: "Terjadi kesalahan pada server"},
            {status: 500}
        )
    }
}