import { useState } from 'react';
import Head from 'next/head';

import Dashboard from './dashboard';
import Error from './error';
import Login from './login';

const Main = () => {
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);

  let content;

  if (token) {
    content = <Dashboard token={token} setError={setError} />;
  } else {
    content = <Login setToken={setToken} setError={setError} />;
  }

  return (
    <div>
      <Head>
        <title>Budget</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      {error && <Error error={error} setError={setError} />}
      {content}
    </div>
  );
};

export default Main;
