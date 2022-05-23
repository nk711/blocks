import queryString from 'query-string';
import axios from 'axios';
import 'dotenv/config';

const path = "auth/google" 
const redirectURI = `${process.env.ROOT_URI}/${path}`;
const GoogleClientID = process.env.GOOGLE_CLIENT_ID;
const GoogleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

interface AccessToken {
    access_token: string;
    expires_in: Number;
    refresh_token: string;
    scope: string;
    id_token: string;
}

export const getGoogleAuthURL = () => {
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const options = {
        redirect_uri: redirectURI,
        client_id:  GoogleClientID,
        access_type: "offline",
        response_type: "code",
        prompt: "consent",
        scope: [
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
        ].join(" "),
    };
    return `${rootUrl}?${queryString.stringify(options)}`;
}



export const getTokens = (code: String): Promise<AccessToken> => {
    const url = "https://oauth2.googleapis.com/token";
    const values = {
        code,
        client_id: GoogleClientID,
        client_secret: GoogleClientSecret,
        redirect_uri: redirectURI,
        grant_type: "authorization_code",
    };

    return axios
        .post(url, queryString.stringify(values), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        }) 
        .then((res) => res.data)
        .catch((error) => {
            console.error(`Failed to fetch auth tokens`);
            throw new Error(error.message);
        });

}