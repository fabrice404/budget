import { Line } from 'react-chartjs-2';

import {
  formatMoney,
  nextPayDay,
  isToday,
  isYesterday,
  dateDDMMYYYY,
  isFuture,
  hasFutureTransactions,
  hasYesterdayTransactions,
  hasTodayTransactions
} from '../lib/utils';
import Transaction from './transaction';

const Home = ({ token, accounts, setSelected }) => {
  if (!accounts) {
    return <div />;
  }

  const npd = nextPayDay();
  const now = new Date();
  const colors = ['#7f2b7b', '#db0129', '#0075eb'];

  const eom = accounts
    .filter(account => account.type === 'current')
    .reduce((acc, val) => acc + (val.eom || 0), 0);

  const savings = accounts
    .filter(account => account.type === 'deposit')
    .reduce((acc, val) => acc + (val.balance || 0), 0);

  return (
    <div className="p-10">
      <div className="flex gap-10">
        <div className="w-3/5">
          <div className="text-xl tracking-tight">
            <span className="text-pink-400 border-r-2 border-gray-600 pr-4">
              Dashboard
            </span>
            <span className="text-gray-200 pl-4">Hi {token.user.name}!</span>
          </div>

          <div className="flex gap-10 my-4">
            <div className="w-1/2 bg-gray-800 rounded-xl px-6 py-4">
              <div className="flex">
                <div className="w-3/4 border-b-2 border-gray-600 pb-2 text-base text-gray-200 font-medium">
                  EOM Prediction
                </div>
                <div className="w-1/4 pb-2 text-sm font-medium text-pink-400 text-right">
                  {Math.ceil(
                    Math.abs(new Date() - npd) / (24 * 60 * 60 * 1000)
                  )}{' '}
                  days
                </div>
              </div>
              <div className="text-right text-2xl text-gray-200 px-2 py-4">
                {formatMoney(eom)}
              </div>
            </div>
            <div className="w-1/2 bg-gray-800 rounded-xl px-6 py-4">
              <div className="w-3/4 border-b-2 border-gray-600 pb-2 text-base text-gray-200 font-medium">
                Savings
              </div>
              <div className="text-right text-2xl text-gray-200 px-2 py-4">
                {formatMoney(savings)}
              </div>
            </div>
          </div>

          <div className="text-lg text-pink-400 my-5 font-medium">
            Current accounts
          </div>
          <div className="bg-gray-800 rounded-xl px-6 py-4">
            <table className="table-auto min-w-full">
              <thead className="border-b-2 border-gray-600 pb-1">
                <tr>
                  <th className="text-sm font-normal text-gray-200 text-left p-2">
                    Account
                  </th>
                  <th className="text-sm font-normal text-gray-200 text-right p-2">
                    Balance
                  </th>
                  <th className="text-sm font-normal text-gray-200 text-right p-2">
                    End of Month
                  </th>
                  <th className="text-sm font-normal text-gray-200 text-right p-2 pr-4">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody>
                {accounts &&
                  accounts
                    .sort((a, b) => (a.order > b.order ? 1 : -1))
                    .filter(account => account.type === 'current')
                    .map(account => (
                      <tr key={account.id}>
                        <td className="text-sm font-semibold text-left text-gray-200 p-2">
                          {account.name}
                        </td>
                        <td className="text-sm font-normal text-right text-gray-200 p-2">
                          {formatMoney(account.balance)}
                        </td>
                        <td className="text-sm font-normal text-right text-gray-200 p-2">
                          {formatMoney(account.eom)}
                        </td>
                        <td className="text-right p-2">
                          <button
                            type="button"
                            className="bg-pink-800 text-pink-200 text-sm py-1 px-3 rounded-lg"
                            onClick={() => setSelected(account.id)}
                          >
                            view
                          </button>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
            <div className="cursor-crosshair">
              <Line
                data={{
                  datasets: accounts
                    .filter(account => account.type === 'current')
                    .map(a => {
                      const color = colors.shift();
                      return {
                        label: a.name,
                        fill: false,
                        data: a.chart.map(c => ({ t: c.date, y: c.balance })),
                        borderColor: color,
                        backgroundColor: color,
                        pointRadius: 0,
                        pointHitRadius: 10,
                        borderWidth: 1
                      };
                    })
                }}
                options={{
                  legend: {
                    labels: {
                      fontColor: '#E5E7EB'
                    }
                  },
                  scales: {
                    xAxes: [
                      {
                        type: 'time',
                        ticks: {
                          stepSize: 7,
                          source: 'data'
                        }
                      }
                    ],
                    yAxes: [{ ticks: { beginAtZero: true } }]
                  }
                }}
              />
            </div>
          </div>

          <div className="text-lg text-pink-400 my-5 font-medium">
            Deposit accounts
          </div>

          <div className="bg-gray-800 rounded-xl px-6 py-4">
            <table className="table-auto min-w-full">
              <thead className="border-b-2 border-gray-600 pb-1">
                <tr>
                  <th className="text-sm font-normal text-gray-200 text-left p-2">
                    Account
                  </th>
                  <th className="text-sm font-normal text-gray-200 text-right p-2">
                    Balance
                  </th>
                  <th className="text-sm font-normal text-gray-200 text-right p-2 pr-4">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody>
                {accounts &&
                  accounts
                    .sort((a, b) => (a.order > b.order ? 1 : -1))
                    .filter(account => account.type === 'deposit')
                    .map(account => (
                      <tr key={account.id}>
                        <td className="text-sm font-semibold text-left text-gray-200 p-2">
                          {account.name}
                        </td>
                        <td className="text-sm font-normal text-right text-gray-200 p-2">
                          {formatMoney(account.balance)}
                        </td>
                        <td className="text-right p-2">
                          <button
                            type="button"
                            className="bg-pink-800 text-pink-200 text-sm py-1 px-3 rounded-lg"
                            onClick={() => setSelected(account.id)}
                          >
                            view
                          </button>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>

          <div className="text-lg text-pink-400 my-5 font-medium">Credits</div>
          <div className="bg-gray-800 rounded-xl px-6 py-4">
            <table className="table-auto min-w-full">
              <thead className="border-b-2 border-gray-600 pb-1">
                <tr>
                  <th className="text-sm font-normal text-gray-200 text-left p-2">
                    Account
                  </th>
                  <th className="text-sm font-normal text-gray-200 text-right p-2">
                    Balance
                  </th>
                  <th className="text-sm font-normal text-gray-200 text-right p-2 pr-4">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody>
                {accounts &&
                  accounts
                    .sort((a, b) => (a.order > b.order ? 1 : -1))
                    .filter(account => account.type === 'credit')
                    .map(account => (
                      <tr key={account.id}>
                        <td className="text-sm font-semibold text-left text-gray-200 p-2">
                          {account.name}
                        </td>
                        <td className="text-sm font-normal text-right text-gray-200 p-2">
                          {formatMoney(-Math.abs(account.balance))}
                        </td>
                        <td className="text-right p-2">
                          <button
                            type="button"
                            className="bg-pink-800 text-pink-200 text-sm py-1 px-3 rounded-lg"
                            onClick={() => setSelected(account.id)}
                          >
                            view
                          </button>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="w-2/5">
          <div className="text-lg font-medium text-gray-200">
            Recent transactions
          </div>

          {hasFutureTransactions(accounts) && (
            <div className="text-sm my-2 text-pink-400 font-medium">Future</div>
          )}
          {accounts &&
            accounts.map(account =>
              account.exports
                .filter(transaction => isFuture(transaction.date))
                .map((transaction, i) => (
                  <Transaction
                    name={transaction.name}
                    amount={transaction.amount}
                    info={account.name}
                    key={`${i}/${transaction.name}/${transaction.date}`}
                  />
                ))
            )}

          {hasTodayTransactions(accounts) && (
            <div className="text-sm my-2 text-pink-400 font-medium">
              Today
              <span className="text-xs text-gray-400 ml-2">
                {dateDDMMYYYY(now)}
              </span>
            </div>
          )}
          {accounts &&
            accounts.map(account =>
              account.exports
                .filter(transaction => isToday(transaction.date))
                .map((transaction, i) => (
                  <Transaction
                    name={transaction.name}
                    amount={transaction.amount}
                    info={account.name}
                    key={`${i}/${transaction.name}/${transaction.date}`}
                  />
                ))
            )}

          {hasYesterdayTransactions(accounts) && (
            <div className="text-sm my-2 text-pink-400 font-medium">
              Yesterday
            </div>
          )}
          {accounts &&
            accounts.map(account =>
              account.exports
                .filter(transaction => isYesterday(transaction.date))
                .map((transaction, i) => (
                  <Transaction
                    name={transaction.name}
                    amount={transaction.amount}
                    info={account.name}
                    key={`${i}/${transaction.name}/${transaction.date}`}
                  />
                ))
            )}
        </div>
      </div>
    </div>
  );
};

export default Home;
