import Debug from 'debug';
import * as fs from 'fs';
import { Account, Export, Transaction } from '../types';

import * as env from './env';

const debug = Debug('budget-api:services/database');

const load = (includeExports?: boolean): Account[] => {
  debug('load');
  const dbAccounts = JSON.parse(fs.readFileSync(env.databaseFile(), 'utf-8'));

  if (includeExports) {
    env.exportFiles().forEach((exportFile) => {
      if (fs.existsSync(exportFile)) {
        const exportAccounts = JSON.parse(fs.readFileSync(exportFile, 'utf-8'));
        exportAccounts.forEach((exportAccount: Export) => {
          const dbAccount = dbAccounts.find((a: Account) => a.id === exportAccount.id
            || a.id === exportAccount.name);
          if (dbAccount) {
            dbAccount.balance = exportAccount.balance;
            dbAccount.exports = [
              ...exportAccount.transactions.done,
              ...exportAccount.transactions.pending,
            ];
          }
        });
      }
    });
  }
  return dbAccounts;
};

const save = (accounts: Account[]): void => {
  debug('save');
  fs.writeFileSync(env.databaseFile(), JSON.stringify(accounts, null, 2));
};

const update = (): void => {
  const readCSV = (path: string) => {
    debug(`readCSV(${path})`);
    const file = fs.readFileSync(path, 'utf8');
    const csv = file.split('\n');
    const result = [];
    let columns: string[] = [];
    for (let i = 0, len = csv.length; i < len; i += 1) {
      const line = csv[i].split(',');
      if (i === 0) {
        columns = line;
      } else if (line.length === columns.length) {
        const obj: Record<string, any> = {};
        for (let j = 0, cols = line.length; j < cols; j += 1) {
          const key = columns[j];
          obj[key] = line[j];
        }
        result.push(obj);
      }
    }
    return result;
  };

  debug('update');
  let updated = false;

  // create file if does not exist
  if (!fs.existsSync(env.databaseFile())) {
    debug(`create: ${env.databaseFile()}`);
    fs.writeFileSync(env.databaseFile(), '[]');
  }
  const dbAccounts = load();

  const csvAccounts = readCSV(env.csvAccountsFile()) as Account[];
  csvAccounts.forEach((csvAccount) => {
    const dbAccount = dbAccounts.find((a) => a.id === csvAccount.id);
    if (dbAccount) {
      if (dbAccount.name !== csvAccount.name
        || dbAccount.order.toString() !== csvAccount.order.toString()
        || dbAccount.type !== csvAccount.type
      ) {
        updated = true;
        dbAccount.name = csvAccount.name;
        dbAccount.order = parseInt(csvAccount.order.toString(), 10);
        dbAccount.type = csvAccount.type;
      }
    } else {
      updated = true;
      dbAccounts.push({
        name: csvAccount.name,
        id: csvAccount.id,
        order: parseInt(csvAccount.order.toString(), 10),
        type: csvAccount.type,
        transactions: [],
      });
    }
  });

  const csvTransactions = readCSV(env.csvTransactionsFile()) as Transaction[];
  csvTransactions.forEach((csvTransaction) => {
    const dbAccount = dbAccounts.find((a) => a.id === csvTransaction.accountid);
    if (dbAccount) {
      const transaction = dbAccount.transactions.find((t) => t.name === csvTransaction.name
        && t.date === csvTransaction.date
        && t.amount === parseFloat(csvTransaction.amount.toString()));
      if (!transaction) {
        updated = true;
        dbAccount.transactions.push({
          name: csvTransaction.name,
          date: csvTransaction.date,
          amount: parseFloat(csvTransaction.amount.toString()),
          checked: false,
        });
      }
    }
  });

  if (updated) {
    save(dbAccounts);
  }
};

export {
  load,
  save,
  update,
};
