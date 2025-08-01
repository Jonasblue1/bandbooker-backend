import passport from 'passport';
import { Strategy } from 'passport-openidconnect';
import express from 'express';

const router = express.Router();

passport.use(new Strategy({
  issuer: 'https://replit.com',
  authorizationURL: 'https://replit.com/auth',
  tokenURL: 'https://replit.com/token',
  userInfoURL: 'https://replit.com/userinfo',
  clientID: process.env.REPLIT_CLIENT_ID!,
  clientSecret: process.env.REPLIT_CLIENT_SECRET!,
  callbackURL: '/auth/callback',
}, function(issuer, profile, done) {
  return done(null, profile);
}));

router.use(passport.initialize());
router.use(passport.session());

export const replitOIDC = router;
