import express, {Express, Request, Response } from 'express';
import session from 'express-session';
import { getGoogleAuthURL, getTokens} from '../utils/google';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import cors from 'cors';
import 'dotenv/config';

const app: Express = express();
const port = process.env.PORT;

app.use(
    cors({
        origin: process.env.ROOT_URI,
        credentials: true,
    })
)
// parse requests of content-type - application/json
app.use(express.json());

const photos = [
    {
        photoId: 0,
        title: 'photo1',
        description: 'description here'
    },
    {
        photoId: 1,
        title: 'photo2',
        description: 'description here'
    }
]


app.get('/', (req: Request, res: Response) => {
    res.send('Express & Typescript Server');
});

app.get('/photos', (req: Request, res: Response) => {
    res.json(photos)
})

// Getting Login URL
app.get("/auth/google/url", (req: Request, res: Response)=> {
    return res.send(getGoogleAuthURL());
})


// Getting the user  from Google with the code
app.get("/auth/google", async(req: Request, res: Response)=> {
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

    // [1] {
    // [1]   id: '112315452422414179119',
    // [1]   email: 'nkoneswaran123@gmail.com',
    // [1]   verified_email: true,
    // [1]   name: 'nk711',
    // [1]   given_name: 'nk711',
    // [1]   picture: 'https://lh3.googleusercontent.com/a-/AOh14Ghilb-0ttXmL87bsYh9hC8VmnIMZBfbZq1o9VeVuLE=s96-c',
    // [1]   locale: 'en'
    // [1] }


    console.log(googleUser);


    const token = jwt.sign(googleUser, process.env.ACCESS_TOKEN_SECRET as string)
    res.json({accessToken: token})
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


app.listen(port, ()=> {
    console.log(` => [server]: Server is running at https://localhost: ${port}`);
})
