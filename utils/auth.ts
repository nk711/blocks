import { JsonWebTokenError } from "jsonwebtoken";
import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

export interface UserType {
    id: string,
    email: string,
    verified_email: boolean,
    name: string,
    given_name: string,
    picture: string,
    locale: string,
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction ) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if ( token == null ) return res.sendStatus(401)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user as UserType
        next()
    })
};


export const generateAccessToken = (user: UserType): string => {
    return  jwt.sign(user, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: '30s'})
}