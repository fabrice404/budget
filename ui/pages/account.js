import { Line } from 'react-chartjs-2';

import { accountType, formatMoney, nextPayDay, isPast } from '../lib/utils';
import Transaction from './transaction';

const Account = ({ accounts, selected, checkTransaction }) => {
  let account = null;
  if (selected != null) {
    account = accounts.find(a => a.id === selected);
  }

  if (account == null) {
    return <div />;
  }

  const npd = nextPayDay();

  return (
    <div className="p-10">
      <div className="flex gap-10">
        <div className="w-3/5">
          <div className="text-xl tracking-tight">
            <span className="text-pink-400 border-r-2 border-gray-300 pr-4">
              {accountType(account.type)}
            </span>
            <span className="pl-4">{account.name}</span>
          </div>

          <div className="flex gap-10 my-4">
            <div className="w-1/2 bg-white rounded-xl px-6 py-4">
              <div className="w-3/4 border-b-2 border-gray-100 pb-2 text-base font-medium">
                Current balance
              </div>
              <div className="text-right text-2xl px-2 py-4">
                {formatMoney(account.balance)}
              </div>
            </div>
            <div className="w-1/2 bg-white rounded-xl px-6 py-4">
              <div className="flex">
                <div className="w-3/4 border-b-2 border-gray-100 pb-2 text-base font-medium">
                  EOM Prediction
                </div>
                <div className="w-1/4 pb-2 text-sm font-medium text-pink-400 text-right">
                  {Math.ceil(
                    Math.abs(new Date() - npd) / (24 * 60 * 60 * 1000)
                  )}{' '}
                  days
                </div>
              </div>
              <div className="text-right text-2xl px-2 py-4 text-gray-400">
                {formatMoney(account.eom)}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl px-6 py-4">
            <div className="cursor-crosshair">
              <Line
                data={{
                  datasets: [
                    {
                      label: account.name,
                      fill: false,
                      data: account.chart.map(c => ({
                        t: c.date,
                        y: c.balance
                      })),
                      borderColor: '#f472b6',
                      backgroundColor: '#f472b6',
                      pointRadius: 0,
                      pointHitRadius: 10,
                      borderWidth: 1
                    }
                  ]
                }}
                options={{
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

          <div className="bg-white rounded-xl px-6 py-4">
            <table className="table-auto min-w-full">
              <thead className="border-b-2 border-gray-100 pb-1">
                <tr>
                  <th className="text-sm font-normal text-gray-500 text-left p-2">
                    Date
                  </th>
                  <th className="text-sm font-normal text-gray-500 text-left p-2">
                    Name
                  </th>
                  <th className="text-sm font-normal text-gray-500 text-right p-2">
                    Amount
                  </th>
                  <th className="text-sm font-normal text-gray-500 text-right p-2">
                    {' '}
                  </th>
                </tr>
              </thead>
              <tbody>
                {account.transactions &&
                  account.transactions
                    .filter(
                      transaction =>
                        !transaction.checked && new Date(transaction.date) < npd
                    )
                    .sort((a, b) => (a.date > b.date ? 1 : -1))
                    .map((transaction, i) => (
                      <tr
                        key={`${account.id}/${transaction.name}/${transaction.date}/${transaction.amount}/${i}`}
                        className={isPast(transaction.date) ? '' : 'opacity-25'}
                      >
                        <td className="text-sm font-normal text-left p-2">
                          {transaction.date}
                        </td>
                        <td className="text-sm font-normal text-left p-2">
                          {transaction.name}
                        </td>
                        <td className="text-sm font-normal text-right p-2">
                          <span
                            className={
                              transaction.amount >= 0
                                ? 'bg-green-50 text-green-500 py-1 px-3 rounded-lg'
                                : 'bg-red-50 text-red-500 py-1 px-3 rounded-lg'
                            }
                          >
                            {formatMoney(transaction.amount)}
                          </span>
                        </td>
                        <td className="text-right p-2">
                          {isPast(transaction.date) && (
                            <button
                              type="button"
                              className="bg-pink-50 text-pink-500 text-sm py-1 px-3 rounded-lg"
                              onClick={() => {
                                checkTransaction(account.id, transaction);
                              }}
                            >
                              &#10003;
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="w-2/5">
          <div className="text-lg mb-5 font-medium">Recent transactions</div>
          {account.exports
            .sort((a, b) => (a.date < b.date ? 1 : -1))
            .map((transaction, i) => (
              <Transaction
                name={transaction.name}
                amount={transaction.amount}
                info={transaction.date}
                key={`${i}/${account.id}/${transaction.name}/${transaction.date}`}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Account;
