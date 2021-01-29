import { formatMoney } from '../lib/utils';

const Transaction = ({ name, amount, info }) => {
  return (
    <div className="bg-gray-800 rounded-xl py-4 px-6 flex text-sm mb-3">
      <div className="py-1 w-1/2 text-gray-200">{name}</div>
      <div className="py-1 w-1/4 color text-xs text-gray-200 text-center border-l border-gray-600">
        {info}
      </div>
      <div className="w-1/4 text-right whitespace-nowrap">
        <span
          className={
            amount >= 0
              ? 'bg-green-500 text-green-50 py-1 px-3 rounded-lg'
              : 'bg-red-500 text-red-50 py-1 px-3 rounded-lg'
          }
        >
          {formatMoney(amount)}
        </span>
      </div>
    </div>
  );
};

export default Transaction;
