import { GoogleLogin } from 'react-google-login';
import Logo from './logo';

const Login = ({ setToken, setError }) => {
  const googleLoginCallback = response => {
    const { id_token } = response.getAuthResponse();
    fetch(`${process.env.NEXT_PUBLIC_API_HOST}/auth`, {
      body: JSON.stringify({ id_token }),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    })
      .then(res => {
        if (res.status === 200) {
          return res.json();
        }
        setError('Access denied');
        return null;
      })
      .then(res => setToken(res))
      .catch(err => setError(err));
  };

  return (
    <div className="mx-auto text-center object-center pt-20">
      <div className="mx-auto flex">
        <div className="flex-1" />
        <div className="flex-1 whitespace-nowrap">
          <div className="flex pl-15">
            <Logo height="128" />
            <span className="pl-6 pt-10 font-thin text-5xl tracking-widest whitespace-nowrap text-gray-400">
              B U D G E T
            </span>
          </div>
        </div>
        <div className="flex-1" />
      </div>
      <GoogleLogin
        clientId="1047108459211-tl55mjvmmnslllmcmv25ds0ja3sc1age.apps.googleusercontent.com"
        buttonText="Login"
        onSuccess={googleLoginCallback}
        onFailure={setError}
        isSignedIn
      />
    </div>
  );
};

export default Login;
