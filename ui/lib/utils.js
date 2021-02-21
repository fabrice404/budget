export const dateDDMMYYYY = date =>
  `${date
    .getDate()
    .toString()
    .padStart(2, '0')}/${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}/${date.getFullYear()}`;

export const dateYYYYMMDD = date =>
  `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${date
    .getDate()
    .toString()
    .padStart(2, '0')}`;

export const formatMoney = (amount, currency = '€') => {
  if (amount == null) {
    return '';
  }
  return `${currency} ${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

export const nextPayDay = () => {
  const now = new Date();
  const todayMonth = now.getMonth();
  const todayYear = now.getFullYear();

  const npd = new Date(todayYear, todayMonth, 25, 0, 0, 0, 0);

  if (npd.getDay() === 0) {
    // sunday = remove 2 days
    npd.setDate(npd.getDate() - 2);
  } else if (npd.getDay() === 6) {
    // saturday = remove 1 day
    npd.setDate(npd.getDate() - 1);
  } else if (npd.getDay() === 1) {
    // monday = remove 2 days
    npd.setDate(npd.getDate() - 2);
  }

  if (npd < now) {
    // add 1 month
    npd.setMonth(npd.getMonth() + 1);
  }

  if (npd.getDay() === 0) {
    // sunday = remove 2 days
    npd.setDate(npd.getDate() - 2);
  } else if (npd.getDay() === 6) {
    // saturday = remove 1 day
    npd.setDate(npd.getDate() - 1);
  }

  return npd;
};

export const isFuture = date => {
  const today = new Date();
  return date > dateYYYYMMDD(today);
};

export const isToday = date => {
  const today = new Date();
  return date === dateYYYYMMDD(today);
};

export const isYesterday = date => {
  const yesterday = new Date();
  yesterday.setHours(-24);
  return date === dateYYYYMMDD(yesterday);
};

export const hasFutureTransactions = accounts => {
  let hasTransactions = false;
  accounts.forEach(account => {
    if (account.exports.find(transaction => isFuture(transaction.date))) {
      hasTransactions = true;
    }
  });
  return hasTransactions;
};

export const hasTodayTransactions = accounts => {
  let hasTransactions = false;
  accounts.forEach(account => {
    if (account.exports.find(transaction => isToday(transaction.date))) {
      hasTransactions = true;
    }
  });
  return hasTransactions;
};

export const hasYesterdayTransactions = accounts => {
  let hasTransactions = false;
  accounts.forEach(account => {
    if (account.exports.find(transaction => isYesterday(transaction.date))) {
      hasTransactions = true;
    }
  });
  return hasTransactions;
};

export const accountType = type => {
  return {
    current: 'Current account',
    deposit: 'Deposit account',
    credit: 'Credit'
  }[type];
};

export const isPast = date => {
  const today = new Date();
  today.setHours(0);
  today.setMinutes(0);
  today.setSeconds(0);
  today.setMilliseconds(0);
  return new Date(date) <= today;
};

export const upgradeAccount = account => {
  const npd = nextPayDay();

  // end of month predicate
  const eomCents = account.transactions
    .filter(
      transaction => new Date(transaction.date) < npd && !transaction.checked
    )
    .reduce((acc, val) => acc + val.amount * 100, 0);
  account.eom = (account.balance * 100 + eomCents) / 100;

  // chart data
  const chart = [];
  // from tomorrow to npd
  let day = new Date();
  day.setHours(24);
  day.setMinutes(0);
  day.setSeconds(0);
  day.setMilliseconds(0);
  let i = 0;
  while (day < npd) {
    const date = dateYYYYMMDD(day);
    const cents = account.transactions
      .filter(t => t.date === date && !t.checked)
      .reduce((acc, val) => acc + val.amount * 100, 0);
    chart.push({ date, cents });
    day.setHours(24);
    i += 1;
  }

  // today and before
  day = new Date();
  day.setHours(0);
  day.setMinutes(0);
  day.setSeconds(0);
  day.setMilliseconds(0);
  for (i; i <= 30; i += 1) {
    const date = dateYYYYMMDD(day);
    const cents = account.exports
      .filter(t => t.date === date)
      .reduce((acc, val) => acc + val.amount * 100, 0);
    chart.push({ date, cents });
    day.setHours(-24);
  }

  let balance = account.balance * 100 + eomCents;
  chart
    .sort((a, b) => (a.date > b.date ? -1 : 1))
    .forEach(d => {
      d.balance = balance / 100;
      balance -= d.cents;
      delete d.cents;
    });

  if (chart.length) {
    account.chart = chart.sort((a, b) => (a.date > b.date ? 1 : -1));
  }
};
