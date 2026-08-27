import passport from 'passport'
import dotenv from 'dotenv'
dotenv.config()
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../model/user.model.js';

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, cb) => {
    try {
      const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
      if (!email) {
        return cb(new Error("No email found in Google profile"));
      }

      // Check if user already exists by email or googleId
      let user = await User.findOne({ email });
      if (!user) {
        user = new User({
          name: profile.displayName || profile.username || "Google User",
          email: email,
          password: 'abc', // Default placeholder password
          role: 'user',
          isVerified: true
        });
        await user.save();
      }
      return cb(null, user);
    } catch (error) {
      console.error("Error in Google Strategy callback:", error);
      return cb(error);
    }
  }
));