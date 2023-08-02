import { useState, useRef, useEffect } from "react";

function UserMenu({ handleLogout, profile }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <button type="button" className="inline-flex items-center w-full justify-center gap-x-1.5 rounded-xl bg-slate-800 px-3 py-2 text-sm font-semibold shadow-sm hover:bg-gray-700" id="menu-button" aria-expanded={isExpanded} aria-haspopup="true" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="w-8 h-8 rounded-full bg-slate-700 overflow-hidden inline-flex items-center justify-center text-center mr-2">
          {profile.images?.length ? (
            <img src={profile.images[0]?.url} className="h-8 w-8 object-cover object-center" />
          ) : (
            <p className="text-lg">{profile.display_name?.charAt(0)}</p>
          )}
        </div>
        {profile.display_name}
        <svg className="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>
      <div className={`absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-slate-700 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transition ${isExpanded ? 'opacity-100' : 'opacity-0 z-[-1]'}`} role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex={-1}>
        <div className="py-1" role="none">
          <button type="submit" className="block w-full px-4 py-2 text-left text-sm" role="menuitem" tabIndex={-1} id="menu-item-3" onClick={handleLogout}>Sign out</button>
        </div>
      </div>
    </div>
  )
}

export default function Header({handleLogout, profile}) {
  return (
    <header className="flex justify-between pt-3 pb-8 items-center">
      <a href="/" className="inline-flex gap-3 items-center">
        <img src="/spotify.svg" className="h-10 w-10 inline-block" />
        <p className="text-2xl font-bold tracking-wide">Spotify</p>
      </a>
      <UserMenu handleLogout={handleLogout} profile={profile} />
    </header>
  )
}