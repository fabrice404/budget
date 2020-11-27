import Debug from 'debug';
import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';

import * as env from './env';
import { Session } from '../types';

const debug = Debug('budget-api:services/auth');

let sessions: Session[] = [];

/**
 * Clears all expired sessions
 */
const clearExpiredSessions = (): void => {
  debug('clearExpiredSessions');
  sessions = sessions.filter((s) => s.exp > Math.floor(Date.now() / 1000));
};

/**
 * Returns a json web token containing sessionid and sub
 * @param sub string
 */
const createSession = (sub: string): string => {
  clearExpiredSessions();
  debug(`createSession (sub: ${sub})`);

  const exp = Math.floor(Date.now() / 1000) + (60 * 60);
  const sessionid = uuid();

  const token = jwt.sign({
    exp,
    data: {
      sessionid,
      sub,
    },
  }, process.env.JWT_SECRET || 'jwt_secret');

  sessions.push({
    exp,
    sessionid,
    sub,
  });
  return token;
};

/**
 * Get session by sessionid
 * @param sessionid string
 */
const getSession = (sessionid: string): Session | undefined => {
  clearExpiredSessions();
  debug(`getSession (sessionid: ${sessionid})`);
  return sessions.find((s) => s.sessionid === sessionid);
};

/**
 *
 * @param sub string
 */
const isUserAuthorized = (sub: string): boolean => {
  debug(`isUserAuthorized (sub: ${sub})`);
  return env.authorizedUsers().includes(sub);
};

export {
  createSession,
  getSession,
  isUserAuthorized,
};
