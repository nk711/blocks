import express, {Express, Request, Response } from 'express';
import auth from '../routes/auth';
import cors from 'cors';
import 'dotenv/config';
import photos from '../routes/photos';
const app: Express = express();
const port = process.env.PORT;

app.use(
    cors({
        origin: process.env.ROOT_URI,
        credentials: true,
    })
)

app.use('/auth', auth);
app.use('/photos', photos);

app.get('/', (req: Request, res: Response) => {
    res.send('Express & Typescript Server');
});

app.listen(port, ()=> {
    console.log(` => [server]: Server is running at https://localhost:${port}`);
})
