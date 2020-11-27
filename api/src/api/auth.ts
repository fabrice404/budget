import Debug from 'debug';
import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';

import * as auth from '../services/auth';

const debug = Debug('budget-api:api/auth');
const router = express.Router();

router.use((req, res, next) => {
  debug('Auth middleware');
  let status;
  if (req.url !== '/auth') {
    if (!req.headers.authorization) {
      status = 401;
    } else {
      const token = req.headers.authorization?.substring('Bearer '.length);
      if (token) {
        try {
          const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'jwt_secret'); // eslint-disable-line @typescript-eslint/no-explicit-any
          const { sessionid, sub } = decoded.data;
          const session = auth.getSession(sessionid);
          if (!session || session.sub !== sub || !auth.isUserAuthorized(session.sub)) {
            status = 403;
          }
        } catch (ex) {
          status = 403;
        }
      } else {
        status = 403;
      }
    }
  }
  if (status) {
    debug(status);
    res.status(status).end();
  } else {
    next();
  }
});

router.post('/auth', async (req, res) => {
  debug('POST /auth');
  const oAuthClient = new OAuth2Client(process.env.GOOGLE_API_CLIENT_ID);
  const ticket = await oAuthClient.verifyIdToken({
    idToken: req.body.id_token,
    audience: process.env.GOOGLE_API_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  if (payload?.iss === 'accounts.google.com'
    && payload.aud === process.env.GOOGLE_API_CLIENT_ID
    && payload.exp > Math.floor(Date.now() / 1000)
    && auth.isUserAuthorized(payload.sub)
  ) {
    res.status(200).json({
      token: auth.createSession(payload.sub),
      user: {
        name: payload.given_name,
        picture: payload.picture,
      },
    });
  }
  res.status(403).end();
});

export default router;
