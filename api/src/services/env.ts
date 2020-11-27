const getStringParameter = (key: string): string => {
  if (process.env[key] == null) {
    throw new Error(`${key} is not defined!`);
  }
  return process.env[key] || '';
};

const authorizedUsers = (): string[] => getStringParameter('AUTHORIZED_USERS').split(',');
const databaseFile = (): string => getStringParameter('FILE_DATABASE');
const exportFiles = (): string[] => getStringParameter('FILE_EXPORTS').split(',');

const csvAccountsFile = (): string => getStringParameter('FILE_SRC_ACCOUNTS');
const csvTransactionsFile = (): string => getStringParameter('FILE_SRC_TRANSACTIONS');

export {
  authorizedUsers,
  databaseFile,
  exportFiles,
  csvAccountsFile,
  csvTransactionsFile,
};
