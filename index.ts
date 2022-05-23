import express, {Express, Request, Response } from 'express';
import GoogleStrategy from 'passport-google-oauth2';
import session from 'express-session';
import passport from 'passport';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'Cat'
}))

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, cb) {
    cb(null, user);
})

passport.deserializeUser(function(obj: any, cb) {
    cb(null, obj);
})

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      userProfile=profile;
      return done(null, userProfile);
  }
));

app.get('/', (request: Request, response: Response) => {
    response.send('Express & Typescript Server');
});

app.listen(port, ()=> {
    console.log(` => [server]: Server is running at https://localhost: ${port}`);
})