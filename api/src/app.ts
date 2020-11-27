import cors from 'cors';
import Debug from 'debug';
import express from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';

import auth from './api/auth';
import account from './api/account';
import transaction from './api/transaction';
import * as database from './services/database';

const debug = Debug('budget-api:index');
const PORT: number = parseInt(process.env.PORT as string, 10) || 4000;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());

app.use('/', auth);
app.use('/', account);
app.use('/', transaction);

app.listen(PORT, () => {
  database.update();
  debug(`Budget API is listening on port ${PORT}`);
});
