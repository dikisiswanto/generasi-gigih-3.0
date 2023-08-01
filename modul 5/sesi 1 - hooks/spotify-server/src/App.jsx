import { useState } from "react";
import Login from "./pages/Login";
import SongList from "./pages/SongList";

function App() {
  const loginStatusFromStorage = localStorage.getItem('is_loggedin') || false;
  const [isLoggedIn, setIsLoggedIn] = useState(loginStatusFromStorage);

  return (
    <div className="bg-slate-900 min-h-screen flex flex-col text-white">
      {isLoggedIn ? (
        <SongList setIsLoggedIn={setIsLoggedIn} />
        ) : (
        <Login setIsLoggedIn={setIsLoggedIn}/>
      )}
    </div>
  )
}
export default App
