import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { getPrisma } from '@/db'
import { JWT_SECRET } from '@/utils/vars'

/**
 * @description Tries to find a user with the provided secret / password.
 * @param secret The secret / password of the user to log in.
 * @returns A Promise that resolves to a JWT Token if the user was found, otherwise an error message.
 * @throws 400 if no secret was provided, 404 if no user was found with that secret, and 500 if the JWT_SECRET env variable was not set.
 */
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

/**
 * @description Tries to retrieve the user with the currently stored JWT Token in the Authorization Header.
 * @returns A Promise that resolves to the user with the currently stored JWT Token in the Authorization Header.
 * @throws 500 if there was no userId in the request object, which should be set by the Authorization middleware.
 */
export const me = async (req: Request, res: Response) => {
    const prisma = getPrisma()
    const userId = req.userId

    if (!userId)
        return res.status(500).send({ error: "User ID must be provided" })

    res.send(await prisma.user.findFirst({
        where: {
            id: userId
        },
        omit: {
            secret: true
        }
    }))
}