import { formatMoney } from '../lib/utils';

const Transaction = ({ name, amount, info }) => {
  return (
    <div className="bg-white rounded-xl py-4 px-6 flex text-sm mb-3">
      <div className="py-1 w-1/2">{name}</div>
      <div className="py-1 w-1/4 color text-xs text-gray-400 text-center border-l border-gray-200">
        {info}
      </div>
      <div className="w-1/4 text-right whitespace-nowrap">
        <span
          className={
            amount >= 0
              ? 'bg-green-50 text-green-500 py-1 px-3 rounded-lg'
              : 'bg-red-50 text-red-500 py-1 px-3 rounded-lg'
          }
        >
          {formatMoney(amount)}
        </span>
      </div>
    </div>
  );
};

export default Transaction;
