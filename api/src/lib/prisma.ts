import { PrismaClient } from "@/generated/prisma/client";

// Mencegah error "Too many connections" saat hot-reload (Development)
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
}

// Cek global var: Pakai koneksi lama jika ada, atau buat baru (Singleton)
export const prisma = 
    globalForPrisma.prisma ?? 
    new PrismaClient({
        log: 
        process.env.NODE_ENV === "development"
            ? ["query", "error", "warn"]
            : ["error"],
    });

// Simpan koneksi ke memori global jika sedang coding (bukan production)
if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}

// Helper untuk memutus koneksi database manual
export async function disconnectPrisma(): Promise<void> {
    await prisma.$disconnect();
}
