import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateRequest } from '@/lib/middleware'

// Helper: Ambil ID dari URL dengan aman (Anti Error Next.js versi baru)
function getId(request: NextRequest) {
    const url = new URL(request.url)
    return url.pathname.split('/').pop()
}

/**
*GET /api/jobs/[id]
* Ambil detail satu lowongan
*/
export async function GET(request: NextRequest) {
    try {
        const id = getId(request)
        if (!id) return NextResponse.json({ error: 'ID tidak valid' }, { status: 400 })

        const job = await prisma.job.findUnique({
            where: { id },
            include: {
            user: { select: { id: true, name: true, email: true } }
        }
    })

    if (!job) {
        return NextResponse.json({ error: 'Lowongan tidak ditemukan' }, { status: 404 })
    }

    return NextResponse.json(job)
    } catch (error) {
        console.error('Error getting job detail:', error)
        return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
    }
}

/**
 * PUT /api/jobs/[id]
 * Update lowongan (Hanya Pemilik)
 */
export async function PUT(request: NextRequest) {
    try {
    // 1. Cek Login
        const auth = authenticateRequest(request)
        if (auth.error) return auth.error
        const { user } = auth

        const id = getId(request)
        const body = await request.json()

    // 2. Cek apakah lowongan ada?
        const existingJob = await prisma.job.findUnique({ where: { id } })
        if (!existingJob) {
            return NextResponse.json({ error: 'Lowongan tidak ditemukan' }, { status: 404 })
    }

    // 3. Cek Kepemilikan (PENTING!)
    // User cuma boleh edit lowongan punya dia sendiri (kecuali ADMIN)
    const isOwner = existingJob.userId === user.userId
    const isAdmin = user.role === 'ADMIN'

    if (!isOwner && !isAdmin) {
        return NextResponse.json({ error: 'Anda bukan pemilik lowongan ini' }, { status: 403 })
    }

    // 4. Update Data
    const updatedJob = await prisma.job.update({
        where: { id },
        data: {
            title: body.title,
            company: body.company,
            location: body.location,
            type: body.type,
            salary: body.salary,
            description: body.description,
            requirements: body.requirements
        }
    })

    return NextResponse.json({ message: 'Update sukses', job: updatedJob })

    } catch (error) {
        console.error('Update error:', error)
        return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
    }
}

/**
 * DELETE /api/jobs/[id]
 * Hapus lowongan (Hanya Pemilik)
 */
export async function DELETE(request: NextRequest) {
    try {
        const auth = authenticateRequest(request)
        if (auth.error) return auth.error
        const { user } = auth

        const id = getId(request)

        const existingJob = await prisma.job.findUnique({ where: { id } })
        if (!existingJob) return NextResponse.json({ error: 'Lowongan tidak ditemukan' }, { status: 404 })

        const isOwner = existingJob.userId === user.userId
        const isAdmin = user.role === 'ADMIN'

        if (!isOwner && !isAdmin) {
            return NextResponse.json({ error: 'Anda bukan pemilik lowongan ini' }, { status: 403 })
        }

        await prisma.job.delete({ where: { id } })

        return NextResponse.json({ message: 'Lowongan berhasil dihapus' })

    } catch (error) {
        console.error('Error deleting job:', error)
        return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
    }
}