import { NextRequest,NextResponse } from "next/server"

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
}