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
  const [isExpired, setIsExpired] = useState(isTokenExpired());

  const getRefreshToken = async () => {
    const refreshToken = localStorage.getItem('refresh_token');

    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: CLIENT_ID,
      refresh_token: refreshToken
    });

    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: 'Basic ' + (CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'),
        },
        body: body,
      });
      
      if (!response.ok) {
        throw new Error('Ada kesalahan saat proses autentikasi');
      }
      
      const data = await response.json();

      setAccessDataToLocal(data);
      setIsExpired(isTokenExpired());
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    if (isLoggedIn && isExpired) {
      getRefreshToken();
    }
  }, []);

  return (
    <div className="bg-slate-900 min-h-screen flex flex-col text-white">
      {isLoggedIn ? (
        <SongList setIsLoggedIn={setIsLoggedIn} isExpired={isExpired} />
        ) : (
        <Login
          setIsLoggedIn={setIsLoggedIn}
          clientId={CLIENT_ID}
          redirectUri={REDIRECT_URI}
        />
      )}
    </div>
  )
}
export default App
