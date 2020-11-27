const Error = ({ error, setError }) => {
  return (
    <div className="fixed bg-red-500 px-5 py-3 rounded-xl text-white flex top-0 left-1/3 mt-10 w-1/3">
      <div className="text-2xl mr-3">&#9888;</div>
      <div className="pt-2 flex-grow">{error}</div>
      <div
        className="text-red-800 text-2xl ml-8 cursor-pointer"
        role="button"
        tabIndex="0"
        onClick={() => setError(null)}
        onKeyPress={e => {
          if (e.key === 'Enter') {
            setError(null);
          }
        }}
      >
        &times;
      </div>
    </div>
  );
};

export default Error;
