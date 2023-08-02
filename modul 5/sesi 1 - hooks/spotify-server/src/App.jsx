/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import Login from "./pages/Login";
import SongList from "./pages/SongList";
import { isTokenExpired, setAccessDataToLocal } from "./utils/helper";

function App() {
  const CLIENT_ID = import.meta.env.CLIENT_ID;
  const CLIENT_SECRET = import.meta.env.CLIENT_SECRET;
  const REDIRECT_URI = import.meta.env.REDIRECT_URI;
  const loginStatusFromStorage = localStorage.getItem('is_loggedin') || false;

  const [isLoggedIn, setIsLoggedIn] = useState(loginStatusFromStorage);

  const getRefreshToken = async () => {
    const codeVerifier = localStorage.getItem('code_verifier');
    const code = localStorage.getItem('code');
    const refreshToken = localStorage.getItem('refresh_token');

    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      refresh_token: refreshToken,
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
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
        throw new Error('Ada kesalahan saat proses autentikasi');
      }
      
      const data = await response.json();
      setAccessDataToLocal(data);
    } catch (error) {
      localStorage.removeItem('is_loggedin');
      setIsLoggedIn(false);
    }
  }

  useEffect(() => {
    if (isLoggedIn && isTokenExpired()) {
      getRefreshToken();
    }
  }, [isLoggedIn])

  return (
    <div className="bg-slate-900 min-h-screen flex flex-col text-white">
      {isLoggedIn ? (
        <SongList setIsLoggedIn={setIsLoggedIn} />
        ) : (
        <Login
          setIsLoggedIn={setIsLoggedIn}
          clientId={CLIENT_ID}
          clientSecret={CLIENT_SECRET}
          redirectUri={REDIRECT_URI}
        />
      )}
    </div>
  )
}
export default App
