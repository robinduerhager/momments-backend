import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { getPrisma } from '@/db'
import { JWT_SECRET } from '@/utils/vars'

export const login = async (req: Request, res: Response) => {
    const prisma = getPrisma()
    const secret: string = req.body?.secret

    if (!secret)
        return res.status(400).send({ error: "Secret must be provided for login" })

    const user = await prisma.user.findFirst({
        where: {
            secret
        }
    })

    if (!user)
        return res.status(404).send({ error: "No User found with that secret" })

    if (!JWT_SECRET)
        return res.status(500).send({ error: "Something went wrong" })

    res.send({
        token: await jwt.sign({ userId: user.id }, JWT_SECRET)
    })
}

export const me = async (req: Request, res: Response) => {
    const prisma = getPrisma()
    const userId = req.userId

    if (!userId)
        return res.status(400).send({ error: "User ID must be provided" })

    res.send(await prisma.user.findFirst({
        where: {
            id: userId
        },
        omit: {
            secret: true
        }
    }))
}