import Debug from 'debug';
import express from 'express';

import * as database from '../services/database';

const debug = Debug('budget-api:api/account');
const router = express.Router();

router.get('/account', (req, res) => {
  debug('GET /account');
  const accounts = database.load(true)
    .sort((a, b) => (a.order > b.order ? 1 : -1));
  res.status(200).json({ accounts });
});

export default router;
