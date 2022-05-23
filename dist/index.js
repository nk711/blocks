"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const google_1 = require("./utils/google");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const axios_1 = __importDefault(require("axios"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use((0, cors_1.default)({
    origin: process.env.ROOT_URI,
    credentials: true,
}));
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
];
app.get('/', (req, res) => {
    res.send('Express & Typescript Server');
});
app.get('/photos', (req, res) => {
    res.json(photos);
});
// Getting Login URL
app.get("/auth/google/url", (req, res) => {
    return res.send((0, google_1.getGoogleAuthURL)());
});
// Getting the user  from Google with the code
app.get("/auth/google", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const code = req.query.code;
    const { id_token, access_token } = yield (0, google_1.getTokens)(code);
    // Fetch the user's profile with the access token and bearer
    const googleUser = yield axios_1.default
        .get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`, {
        headers: {
            Authorization: `Bearer ${id_token}`,
        },
    })
        .then((res) => res.data)
        .catch((error) => {
        console.error(`Failed to fetch user`);
        throw new Error(error.message);
    });
    console.log(googleUser);
    const token = jsonwebtoken_1.default.sign(googleUser, process.env.ACCESS_TOKEN_SECRET);
    res.json({ accessToken: token });
}));
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
app.listen(port, () => {
    console.log(` => [server]: Server is running at https://localhost: ${port}`);
});
