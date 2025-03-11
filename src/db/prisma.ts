import { PrismaClient } from '@prisma/client'

let prismaClient: PrismaClient | null = null;

export const getPrisma = () => {
    if (!prismaClient)
        prismaClient = new PrismaClient()

    return prismaClient
}
