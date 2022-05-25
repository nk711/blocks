import express, {Response, Request} from "express";
import { authenticateToken, UserType } from "../utils/auth"
import jwt from 'jsonwebtoken';
import axios from 'axios';

const router = express.Router();

// Getting Login URL
router.get("/", authenticateToken, (req: Request, res: Response)=> {
    const user = req.user as UserType;
    if (user.name === 'nk711') {
        console.log('true')
        return res.json('Nk711 Only');
    }
    let photos = {}
    return res.json(photos);
})

// Getting the user  from Google with the code
// router.get('/', function (req, res) {
//     res.sendFile(filepath);
// })

export default router;

