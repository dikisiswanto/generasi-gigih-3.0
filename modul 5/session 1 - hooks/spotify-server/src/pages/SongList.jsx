/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react";
import Loading from "../components/Loading";
import SearchBar from "../components/SearchBar";
import SongCard from "../components/SongCard";

export default function SongList({ setIsLoggedIn }) {
  const [songs, setSongs] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const accessToken = localStorage.getItem('access_token');
  
  const getSongs = useCallback(async () => {
    try {
      let params = {
        "market": "ID",
        "limit": 20,
        "seed_artists": "7uEP7CL6JdUpyNTYdEzfb4,31aMmlq8isIAgojvmIwiS4,0ygQsC5td2maGmglpzd7tp,6oM1PyiV3LidEUIHKubg3W,41MozSoPIsD1dJM0CLPjZF",
      };
      
      let q = Object.keys(params)
        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
        .join('&');

      const response = await fetch('https://api.spotify.com/v1/recommendations?' + q, {
        headers: {
          Authorization: 'Bearer ' + accessToken
        }
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error('Error: Gagal mengambil data', response.error);
      }

      setSongs(data.tracks);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  }, []);

  const getSongsByQuery = useCallback(async (query) => {
    try {
      let params = {
        "market": "ID",
        "limit": 20,
        "type": "track",
        "q": query,
      };
      
      let q = Object.keys(params)
        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
        .join('&');

      const response = await fetch('https://api.spotify.com/v1/search?' + q, {
        headers: {
          Authorization: 'Bearer ' + accessToken
        }
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error('Error: Gagal mengambil data', response.error);
      }

      setSongs(data.tracks.items);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const queryValue = e.target.query.value.trim();
    setQuery(queryValue);
  };

  const handleLogout = () => {
    localStorage.removeItem('is_loggedin');
    localStorage.removeItem('access_token');
    setIsLoggedIn(false);
  }

  useEffect(() => {
    if (!songs.length) {
      setLoading(true);
      getSongs();
    }
    
    if (query) {
      setLoading(true);
      setSongs([]);
      getSongsByQuery(query);
    }
  }, [query]);

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);

    // Remove all search parameters
    urlSearchParams.forEach((value, key) => urlSearchParams.delete(key));

    const newSearch = urlSearchParams.toString();
    const newURL = window.location.pathname + (newSearch ? '?' + newSearch : '');
    window.history.replaceState({}, '', newURL);
  }, []);

  return (
    <div className="max-w-4xl w-full mx-auto p-5">
      <SearchBar handleSearch={handleSearch} />

      <div className="fixed right-0 top-0">
        <button onClick={handleLogout} className="pl-10 pr-5 pt-4 pb-8 bg-gray-600 text-white rounded-bl-full hover:scale-105">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 inline-block mr-1">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
        </svg> Logout</button>
      </div>
      
      <h1 className="py-3 mt-8 text-2xl font-bold inline-flex items-center">
        <img src="/spotify.svg" className="h-10 w-10 inline-block mr-3" />
        {!query ? (
          'Rekomendasi Lagu Spotify'
        ) : `Hasil pencarian untuk ${query}`}
      </h1>
      {loading && (
        <div className="text-center my-12">
          <Loading />
        </div>
      )}
      {error && (
        <p className="my-5 text-center">{error}</p>
      )}
      <div className="grid grid-cols-4 gap-5 py-5">
        { !error && songs.map((song) => (
          <SongCard key={song.id} song={song} />
        ))}
      </div>
    </div>
  )
}