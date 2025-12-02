import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Ambil detail pekerjaan berdasarkan ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
    try {
        const { id } = params

        // Cari pekerjaan di database dan data user pembuatnya
        const job = await prisma.job.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    },
                },
            },
        })

        // Kalau tidak ketemu
        if (!job) {
            return NextResponse.json(
                { error: "Lowongan tidak ditemukan" }, 
                { status: 404 }
            )
        }
        return NextResponse.json({ job })
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Terjadi kesalahan saat mengambil data pekerjaan:", error.message)
        }
        return NextResponse.json(
            {error: "Terjadi kesalahan pada server"},
            {status: 500}
        )
    }
}