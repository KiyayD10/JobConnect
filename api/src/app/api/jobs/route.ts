import { NextRequest, NextResponse } from "next/server"
import { prisma } from '@/lib/prisma'
import { Prisma, JobType } from "@/generated/prisma"
import { authenticateRequest } from "@/lib/middleware"

// Ambil semua lowongan dengan filter (Search, Location, Type)
export async function GET(reaquest: NextRequest): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(reaquest.url)
        const type = searchParams.get('type')
        const location = searchParams.get('location')
        const search = searchParams.get('search')

        // Buat object filter dinamis
        const whereClause: Prisma.JobWhereInput = {}

        // Filter by tipe
        if (type) {
            whereClause.type = type as JobType
        }

        // Filter by lokasi
        if (location) {
            whereClause.location = {
                contains: location,
                mode: 'insensitive',
            }
        }

        // Filter search global (Cari judul atau perusahaan)
        if (search) {
            whereClause.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { company: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ]
        }

        // Ambil data dari database
        const jobs = await prisma.job.findMany({
            where: whereClause,
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
            orderBy: {
                createdAt: 'desc',
            },
        })
        return NextResponse.json({
            jobs,
            count: jobs.length,
        })
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Gagal mengambil informasi lowongan pekerjaan::', error.message)
        }
        return NextResponse.json(
            {error: "Terjadi kesalahan pada server"},
            {status: 500}
        )
    }
}

// Buat method untuk membuat lowongan baru
export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        // Autentikasi user
        const auth = authenticateRequest(request)
        if (auth.error) {
            return auth.error
        }

        const { user } = auth
        const body = await request.json()
        const { title, company, location, type, salary, description, requirements } = body

        // Validasi field (wajib)
        if (!title || !company || !location || !description || !requirements) {
            return NextResponse.json(
                {error: "Data tidak lengkap (Title, Company, Location, Desc, Req wajib diisi)"},
                {status: 400}
            )
        }

        // Simpan job ke database
        const job = await prisma.job.create({
            data: {
                title,
                company,
                location,
                type: type || 'FULLTIME',
                salary: salary || null,
                description,
                requirements,
                userId: user.userId,
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
        return NextResponse.json(
            {message: "Lowongan berhasil dibuat", job},
            {status: 201}
        )
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Gagal membuat lowongan pekerjaan::', error.message)
        }
        return NextResponse.json(
            {error: "Terjadi kesalahan pada server"},
            {status: 500}
        )
    }
}