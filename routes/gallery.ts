import express, {Response, Request} from "express";
import jwt from 'jsonwebtoken';
import axios from 'axios';

const router = express.Router();

// Getting Login URL
router.get("/photos", (req: Request, res: Response)=> {
    let photos = {}
    
    return res.json(photos);
})


// Getting the user  from Google with the code


export default router;

