import { JsonWebTokenError } from "jsonwebtoken";
import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const authenticateToken = (req: Request, res: Response, next: NextFunction ) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if ( token == null ) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
};