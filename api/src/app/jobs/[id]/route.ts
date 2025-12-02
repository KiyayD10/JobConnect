import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/middleware"

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

export async function PUT(request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
    try {
        // Cek login
        const auth = authenticateRequest(request)
        if (auth.error) {
            return auth.error
        }
        const { user } = auth
        const { id } = params
        const body = await request.json()

        // Cari data lama
        const existingJob = await prisma.job.findUnique({ 
            where: { id }, 
        })
        if (!existingJob) {
            return NextResponse.json(
                { error: "Lowongan tidak ditemukan" }, 
                { status: 404 }
            )
        }

        // Cek pemilik (hanya atmint dan pemilik yang boleh ngedit)
        const isOwner = existingJob.userId === user.userId
        const isAdmin = user.role === 'ADMIN'

        if (!isOwner && !isAdmin) {
            return NextResponse.json(
                { error: "Anda tidak memiliki izin untuk mengedit lowongan ini" }, 
                { status: 403 }
            )
        }

        // Update data ke database 
        const UpdatedJob = await prisma.job.update({
            where: { id },
            data: {
                title: body.title,
                company: body.company,
                location: body.location,
                type: body.type,
                salary: body.salary,
                description: body.description,
                requirements: body.requirements,
            },
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
        return NextResponse.json({ 
            message: "Lowongan berhasil diperbarui",
            job: UpdatedJob,
        })
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Terjadi kesalahan saat memperbarui data pekerjaan:", error.message)
        }
        return NextResponse.json(
            {error: "Terjadi kesalahan pada server"},
            {status: 500}
        )
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
    try {
        // Cek login
        const auth = authenticateRequest(request)
        if (auth.error) {
            return auth.error
        }
        const { user } = auth
        const { id } = params

        // Cari data lama
        const existingJob = await prisma.job.findUnique({
            where: { id },
        })
        if (!existingJob) {
            return NextResponse.json(
                { error: "Lowongan tidak ditemukan" }, 
                { status: 404 }
            )
        }

        // Cek pemilik
        const isOwner = existingJob.userId === user.userId
        const isAdmin = user.role === 'ADMIN'

        if (!isOwner && !isAdmin) {
            return NextResponse.json(
                { error: "Anda tidak memiliki izin untuk menghapus lowongan ini" }, 
                { status: 403 }
            )
        }

        // Hapus dari database
        await prisma.job.delete({
            where: { id },
        })
        return NextResponse.json({ 
            message: "Lowongan berhasil dihapus",
        })
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Terjadi kesalahan saat menghapus data pekerjaan:", error.message)
        }
        return NextResponse.json(
            {error: "Terjadi kesalahan pada server"},
            {status: 500}
        )
    }
}