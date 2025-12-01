import { NextRequest, NextResponse } from 'next/server'
import { extractToken, verifyToken, type JWTPayload } from './auth'

/**
* Tipe data hasil validasi: Pilih satu, dapet User atau dapet Error.
* Gak mungkin dapet dua-duanya (Discriminated Union).
*/
type AuthResult =
    | { user: JWTPayload; error?: never }
    | { user?: never; error: NextResponse }


// Cek apakah request bawa token yang valid.
export function authenticateRequest(request: NextRequest): AuthResult {
// Ambil token dari header Authorization
    const authHeader = request.headers.get('authorization')
    const token = extractToken(authHeader)

// Kalau token kosong, langsung tolak (401)
    if (!token) {
        return {
            error: NextResponse.json(
                { error: 'Unauthorized - Token tidak ada' },
                { status: 401 }
            ),
        }
    }

// Verifikasi tanda tangan token
    const payload = verifyToken(token)

// Kalau token palsu atau expired, tolak (401)
    if (!payload) {
        return {
            error: NextResponse.json(
                { error: 'Unauthorized - Token tidak valid' },
                { status: 401 }
            ),
        }
    }

// kembalikan data user
    return { user: payload }
}


// Cek apakah role user masuk dalam daftar yang dibolehkan

export function authorizeRole(
    userRole: string,
    allowedRoles: string[]
): boolean {
    return allowedRoles.includes(userRole)
}