import { isPast } from '../lib/utils';
import Logo from './logo';

const Menu = ({ accounts, selected, setSelected, getAccounts }) => {
  const getClassName = id => {
    let className = '';
    if (id === selected) {
      className = 'bg-gray-900 text-pink-400';
    } else {
      className = 'text-gray-400';
    }
    return className;
  };
  return (
    <div>
      <div
        className="p-8 flex cursor-pointer outline-none"
        role="button"
        tabIndex="-100"
        onClick={() => {
          setSelected(null);
          getAccounts();
        }}
        onKeyPress={e => {
          if (e.key === 'Enter') {
            setSelected(null);
            getAccounts();
          }
        }}
      >
        <Logo height="40" />
        <span className="pl-6 pt-2 font-thin text-xl tracking-widest whitespace-nowrap text-white">
          B U D G E T
        </span>
      </div>
      <ul>
        <li className={getClassName(null)}>
          <span
            className="block cursor-pointer px-10 py-4 font-medium text-base outline-none"
            role="button"
            tabIndex="-99"
            onClick={() => setSelected(null)}
            onKeyPress={e => {
              if (e.key === 'Enter') {
                setSelected(null);
              }
            }}
          >
            Home
          </span>
        </li>
        {accounts &&
          accounts
            .filter(a => a.transactions.length > 0)
            .map((a, i) => {
              const items = a.transactions.filter(
                t => isPast(t.date) && !t.checked
              ).length;
              return (
                <li key={a.id} className={getClassName(a.id)}>
                  <span
                    className="block cursor-pointer px-10 py-4 font-medium text-base outline-none"
                    role="button"
                    tabIndex={i + 2}
                    onClick={() => setSelected(a.id)}
                    onKeyPress={e => {
                      if (e.key === 'Enter') {
                        setSelected(a.id);
                      }
                    }}
                  >
                    {a.name}
                    {items ? (
                      <span className="bg-pink-400 text-white text-xs ml-2 rounded-full py-1 px-2">
                        {items}
                      </span>
                    ) : (
                        <span />
                      )}
                  </span>
                </li>
              );
            })}
      </ul>
    </div>
  );
};

export default Menu;
