import { PrismaClient } from '@prisma/client'

let prismaClient: PrismaClient | null = null;

/** 
 * @description This function initializes a Prisma Client instance if it hasn't been created yet and stores it as a singleton. It instead returns the singleton instance if it already exists
 * @returns A singleton Prisma Client instance that can be used to interact with the database.
 * */
export const getPrisma = () => {
    if (!prismaClient)
        prismaClient = new PrismaClient() // Initializes the prisma client if it doesn't exist, based on env variables

    return prismaClient
}
