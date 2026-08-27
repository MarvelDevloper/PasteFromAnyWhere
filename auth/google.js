import passport from 'passport'
import dotenv from 'dotenv'
dotenv.config()
import {GoogleStrategy as Strategy} from 'passport-google-oauth20'
import { User } from '../model/user.model';


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://www.example.com/auth/google/callback"
  },
  async(accessToken, refreshToken, profile, cb)=> {
    try {
        const user=new User({
            googleId:profile.id,
            name:profile.displayName,
            email:profile.email,
            password:'abc',
            isVerified:true,
        })
      return cb(null, user);
    } catch (error) {
        console.log(error)
    }
  }
));