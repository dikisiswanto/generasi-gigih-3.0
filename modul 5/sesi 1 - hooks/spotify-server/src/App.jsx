/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import Login from "./pages/Login";
import SongList from "./pages/SongList";
import { getNewAccessToken } from "./services/authService";
import { isTokenExpired, setAccessDataToLocal } from "./utils/helper";

function App() {
  const CLIENT_ID = import.meta.env.CLIENT_ID;
  const CLIENT_SECRET = import.meta.env.CLIENT_SECRET;
  const REDIRECT_URI = import.meta.env.REDIRECT_URI;
  const loginStatusFromStorage = localStorage.getItem('is_loggedin') || false;

  const [isLoggedIn, setIsLoggedIn] = useState(loginStatusFromStorage);
  const [isExpired, setIsExpired] = useState(isTokenExpired());

  const fetchNewTokenAfterExpired = async () => {
    try {
      const data = await getNewAccessToken({clientId: CLIENT_ID, clientSecret: CLIENT_SECRET});
      setAccessDataToLocal(data);
      setIsExpired(isTokenExpired());
    } catch (error) {
      console.error(error.message);
    }
  }

  useEffect(() => {
    if (isLoggedIn && isExpired) {
      fetchNewTokenAfterExpired();
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
