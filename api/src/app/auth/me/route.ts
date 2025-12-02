import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/middleware";

export async function GET(request: NextRequest): Promise<NextResponse> {
    try {
        // Cek token 
        const auth = authenticateRequest(request)

        // Jika gagal (token kadaluarsa/palsu), kembalikan error dari helper
        if ('error' in auth) {
            return auth.error
        }

        const { user } = auth
    }
}