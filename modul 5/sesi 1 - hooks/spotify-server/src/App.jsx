import { useEffect, useState } from "react";
import Login from "./pages/Login";
import SongList from "./pages/SongList";
import { isTokenExpired } from "./utils/helper";

function App() {
  const loginStatusFromStorage = localStorage.getItem('is_loggedin') || false;
  const [isLoggedIn, setIsLoggedIn] = useState(loginStatusFromStorage);
  const CLIENT_ID = import.meta.env.CLIENT_ID;
  const CLIENT_SECRET = import.meta.env.CLIENT_SECRET;
  const REDIRECT_URI = import.meta.env.REDIRECT_URI;

  useEffect(() => {
    if (isLoggedIn && isTokenExpired()) {
      console.log('expired')
    }
  }, [isLoggedIn])

  return (
    <div className="bg-slate-900 min-h-screen flex flex-col text-white">
      {isLoggedIn ? (
        <SongList setIsLoggedIn={setIsLoggedIn} />
        ) : (
        <Login setIsLoggedIn={setIsLoggedIn} clientId={CLIENT_ID} clientSecret={CLIENT_SECRET} redirectUri={REDIRECT_URI} />
      )}
    </div>
  )
}
export default App
