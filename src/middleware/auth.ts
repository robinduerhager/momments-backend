import { Request, Response, NextFunction } from "express"
import jwt, { JsonWebTokenError, JwtPayload } from 'jsonwebtoken'
import { getPrisma } from '@/db'
import { JWT_SECRET } from "@/vars";

// Check if the JWT in the header is actually valid
export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    if (!JWT_SECRET)
        return res.status(500).send({ error: "Something went wrong" });

    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token)
        return res.status(401).send({ error: "No token provided" });

    const JwtIsValid = await new Promise((resolve, reject) => {
        if (!JWT_SECRET)
            return reject('No JWT_SECRET provided')

        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err)
                return reject(err)
            
            if (decoded)
                return resolve(decoded)   
        })
    }).catch((err: JsonWebTokenError) => {
        console.log(err)
    })

    // Will be undefined if an error was thrown (i.e. token is invalid)
    console.log(JwtIsValid)

    if (!JwtIsValid)
        return res.status(401).send({ error: "Invalid token" });

    // Else continue with the next route
    next()
}