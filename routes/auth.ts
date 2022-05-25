import express, {Response, Request} from "express";
import { generateAccessToken, UserType } from "../utils/auth";
import { getGoogleAuthURL, getTokens } from "../utils/google";
import jwt from 'jsonwebtoken';
import axios from 'axios';
import {User} from '../models/User';

const router = express.Router();

let refreshTokens = [] as any// TO REPLACE

router.post('/token', (req: Request, res: Response) => {
    console.log("test", req.body)
    const refreshToken = req.body.refresh as string;
    if (refreshToken==null) return res.sendStatus(401) // Unauthorised
    if (refreshTokens.includes(refreshToken)) return res.sendStatus(403) // no access
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string, (err: any, user: any) => {
        if (err) return res.sendStatus(403)
        console.log("user", user)
        const accessToken = generateAccessToken(user)
        res.json({accessToken: accessToken})
    })
})

// Getting Login URL
router.get("/google/url", (req: Request, res: Response)=> {
    return res.send(getGoogleAuthURL());
})


// Getting the user  from Google with the code
router.get("/google", async(req: Request, res: Response)=> {
    const code = req.query.code as string;
    const { id_token, access_token } = await getTokens(code);
    // Fetch the user's profile with the access token and bearer
    const googleUser = await axios
        .get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
            {
            headers: {
                Authorization: `Bearer ${id_token}`,
            },
            }
        )
        .then((res) => res.data)
        .catch((error) => {
            console.error(`Failed to fetch user`);
            res.json(error.message);
        });

    if (googleUser.name === 'nk711') { // Later change to see if user exists in database
        const token = generateAccessToken(googleUser)
        const refreshToken = jwt.sign(googleUser, process.env.REFRESH_TOKEN_SECRET as string)
        refreshTokens.push(refreshToken);
        res.json({accessToken: token, refreshToken: refreshToken})
    } else {
        res.json('User not found')
    }
});



// Getting the current user
// app.get("/auth/me", (req: Request, res: Response) => {
//     const token = req.query.jwt as string;
//     try {
//         const decoded = jwt.verify(token ,process.env.ACCESS_TOKEN_SECRET as string)
//         console.log(decoded);
//         return res.send(decoded)
//     } catch (err) {
//         console.log(err);
//         res.send(null);
//     }
// });


export default router;

