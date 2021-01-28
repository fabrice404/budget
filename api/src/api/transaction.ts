import Debug from 'debug';
import express from 'express';

import * as database from '../services/database';

const debug = Debug('budget-api:api/transaction');
const router = express.Router();

router.post('/transaction/check', (req, res) => {
  debug('POST /transaction/check');
  const {
    amount, date, name, accountid,
  } = req.body;

  const dbAccounts = database.load();
  const account = dbAccounts.find((a) => a.id === accountid);
  if (account) {
    const transaction = account.transactions.find((t) => t.amount === amount
      && t.date === date
      && t.name === name);
    if (transaction) {
      const today = new Date();
      const year = today.getFullYear();
      const month = (today.getMonth() + 1).toString().padStart(2, '0');
      const day = today.getDate().toString().padStart(2, '0');

      transaction.checked = true;
      transaction.date = `${year}-${month}-${day}`;
    }
  }
  database.save(dbAccounts);

  res.status(204).end();
});

export default router;
