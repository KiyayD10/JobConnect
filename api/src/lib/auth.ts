import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key'

// Tipe data untuk isi (payload) token
export interface JWTPayload {
    userId: string
    email: string
    role: string
}

// Hash password dengan algoritma bcrypt (Salt Round: 10)
export async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password, salt)
}

// Validasi kecocokan password input dengan hash di database
export async function comparePassword(
    password: string,
    hashedPassword: string
): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword)
}

// Generate JWT Token (Masa aktif: 7 hari)
export function generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: '7d',
    })
}

// Verifikasi signature & decode token (Return null jika invalid/expired)
export function verifyToken(token: string): JWTPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as JWTPayload
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Verifikasi Token Gagal:', error.message)
        }
        return null
    }
}

// Helper parsing token dari header "Authorization: Bearer <token>"
export function extractToken(authHeader: string | null): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null
    }
    return authHeader.substring(7)
}