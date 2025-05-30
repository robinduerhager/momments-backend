import { Request, Response, NextFunction } from "express"
import jwt, { JsonWebTokenError, JwtPayload } from 'jsonwebtoken'
import { JWT_SECRET } from "@/utils/vars";

/**
 * @description Middleware to check if the user is authenticated by verifying if there is a valid Bearer JWT token in the Authorization header.
 * @returns A Promise that resolves to the next middleware if the token is valid.
 * @throws 401 if there is no or an invalid token in the Authorization Header and 500 if the JWT_SECRET environment variable is not set, or if the token is invalid.
 */
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
    if (!JwtIsValid)
        return res.status(401).send({ error: "Invalid token" });

    // Append user id to the request object
    req.userId = (JwtIsValid as JwtPayload).userId

    // Else continue with the next route
    next()
}