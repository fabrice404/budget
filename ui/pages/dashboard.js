import { useEffect, useState } from 'react';

import Account from './account';
import Home from './home';
import Menu from './menu';

import { upgradeAccount } from '../lib/utils';

const Dashboard = ({ token, setError }) => {
  const [accounts, setAccounts] = useState(null);
  const [selected, setSelected] = useState(null);

  const getAccounts = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_HOST}/account`, {
      headers: { Authorization: `Bearer ${token.token}` },
      method: 'GET'
    })
      .then(res => res.json())
      .then(res => {
        const accts = res.accounts;
        accts.forEach(upgradeAccount);
        setAccounts(accts);
      })
      .catch(err => setError(err));
  };

  const checkTransaction = (accountid, { amount, date, name }) => {
    fetch(`${process.env.NEXT_PUBLIC_API_HOST}/transaction/check`, {
      body: JSON.stringify({ accountid, amount, date, name }),
      headers: {
        Authorization: `Bearer ${token.token}`,
        'Content-Type': 'application/json'
      },
      method: 'POST'
    })
      .then(() => {
        getAccounts();
      })
      .catch(err => setError(err));
  };

  useEffect(() => {
    if (!accounts) {
      getAccounts();
    }
  });

  return (
    <div className="montserrat">
      <div className="flex min-h-screen">
        <div className="xl:w-1/6 md:w-1/4 bg-gray-800">
          <Menu
            accounts={accounts}
            selected={selected}
            setSelected={setSelected}
            getAccounts={getAccounts}
          />
        </div>
        <div className="xl:w-5/6 md:w-3/4 bg-gray-900">
          {!selected && (
            <Home token={token} accounts={accounts} setSelected={setSelected} />
          )}
          {selected && (
            <Account
              token={token}
              accounts={accounts}
              selected={selected}
              checkTransaction={checkTransaction}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
