import { useState, useEffect, useCallback } from "react";
import Loading from "../components/Loading";
import { generateCodeChallenge, generateRandomString,  } from "../utils/helper";

export default function Login({ setIsLoggedIn }) {
  const clientId = '2c4d15e05da7494eb0a068d12f4e6ef7';
  const redirectUri = 'http://localhost:5173';
  const [error, setError] = useState('');
  const [hasCode, setHasCode] = useState(false);

  const handleLogin = async () => {
    const codeVerifier = generateRandomString(128);
    const state = generateRandomString(16);
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    const scope = 'user-read-email user-read-private';
    localStorage.setItem('code_verifier', codeVerifier);
    const args = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      scope: scope,
      redirect_uri: redirectUri,
      state: state,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge
    });

    window.location = 'https://accounts.spotify.com/authorize?' + args;
  }

  const getQueryParam = useCallback((name) => {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  }, []);

  const getAccessToken = useCallback(async (code) => {
    const codeVerifier = localStorage.getItem('code_verifier');
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
      client_id: clientId,
      code_verifier: codeVerifier
    });

    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body.toString(),
      });
      
      if (!response.ok) {
        throw new Error('Ada kesalahan saat menyambungkan akun Anda');
      }
      
      const data = await response.json();
      localStorage.setItem('is_loggedin', 'true');
      localStorage.setItem('access_token', data.access_token)
      setIsLoggedIn(true);
    } catch (error) {
      localStorage.removeItem('is_loggedin');
      setIsLoggedIn(false);
      setError(error.message);
    }
  }, [setIsLoggedIn]);

  useEffect(() => {
    const code = getQueryParam('code');
    if (code) {
      setHasCode(true);
      getAccessToken(code);
    }
  }, [setHasCode, getAccessToken, getQueryParam]);

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