import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateRequest } from "@/lib/auth"; 

export async function GET(request: NextRequest) {
    try {
        const auth = await authenticateRequest(request);
        if (auth.error) return auth.error;

        const { user } = auth;

        const userData = await prisma.user.findUnique({
            where: { id: user.userId },
            select: {
                id: true, email: true, name: true, role: true, createdAt: true,
                jobs: { orderBy: { createdAt: 'desc' } },
            },
        });

        if (!userData) return NextResponse.json({ error: "User not found" }, { status: 404 });

        return NextResponse.json({ user: userData });
    } catch (error) {
        console.error("Profile error:", error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}