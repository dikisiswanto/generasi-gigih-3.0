import { useState, useEffect, useCallback } from "react";
import { Loading } from "../components";
import { getAccessToken, getGrantAccessLink } from "../services/authService";
import { getQueryParam, setAccessDataToLocal } from "../utils/helper";

export default function Login({ setIsLoggedIn, redirectUri, clientId }) {
  const [error, setError] = useState('');
  const [hasCode, setHasCode] = useState(false);

  const handleLogin = async () => {
    const grantAccessLink = await getGrantAccessLink({ clientId, redirectUri });
    window.location = grantAccessLink;
  }

  const saveDataAfterLogin = (data) => {
    localStorage.setItem('is_loggedin', 'true');
    setAccessDataToLocal(data);
  }

  const fetchAccessToken = useCallback(async (code) => {
    try {
      const data = await getAccessToken({code, clientId, redirectUri});
      saveDataAfterLogin(data);
      setIsLoggedIn(true);
    } catch (error) {
      localStorage.removeItem('is_loggedin');
      setIsLoggedIn(false);
      setError(error.message);
    }
  }, [setIsLoggedIn, clientId, redirectUri]);

  useEffect(() => {
    const code = getQueryParam('code');
    if (code) {
      setHasCode(true);
      fetchAccessToken(code);
    }
  }, [setHasCode, fetchAccessToken]);

  return (
    <>
      {error && (
          <p className="px-4 py-2 text-sm bg-gray-700/30 border-l-4 text-red-400 mt-16 max-w-md mx-auto">Error: {error}</p>
      )}
      <div className="max-w-md mx-auto border border-gray-700 rounded bg-gray-700/20 px-5 py-5 mt-32 space-y-5">
        {hasCode && !error ? (
          <Loading />
        ) : (
          <>
            <p>Masuk ke akun Spotify dulu, yuk!</p>
            <button className="bg-green-600 text-white bg-5 px-3 py-2 block w-full rounded" onClick={handleLogin}><img src="/spotify.svg" className="h-5 w-5 mr-2 inline-block" /> Login</button>
          </>
        )}
      </div>
    </>
  )
}