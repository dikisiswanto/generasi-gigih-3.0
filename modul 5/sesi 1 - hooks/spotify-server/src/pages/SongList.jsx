/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react";
import { getRecommendedSongs, getSearchedSongs } from "../services/songService";
import { getProfile } from "../services/profileService";
import { Header, Loading, SearchBar, SongCard } from "../components";
import { removeAccessDataFromLocal, removeUrlQueryParams } from "../utils/helper";

export default function SongList({ setIsLoggedIn, isExpired }) {
  const [songs, setSongs] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState({});
  let accessToken = localStorage.getItem('access_token');
  
  const fetchRecommendedSongs = useCallback(async () => {
    try {
      const data = await getRecommendedSongs(accessToken);
      setSongs(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  }, []);

  const fetchSongsByQuery = useCallback(async (query) => {
    try {
      const data = await getSearchedSongs(query, accessToken);
      setSongs(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  }, []);

  const getUserProfile = async () => {
    try {
      const data = await getProfile(accessToken);
      setProfile(data);
    } catch (error) {
      setError(error.message);
    }
  }

  const handleSearch = (e) => {
    e.preventDefault();
    const queryValue = e.target.query.value.trim();
    setQuery(queryValue);
  };

  const handleLogout = () => {
    removeAccessDataFromLocal();
    localStorage.removeItem('is_loggedin');
    setIsLoggedIn(false);
  }

  useEffect(() => {
    if (!songs.length && !isExpired) {
      setLoading(true);
      fetchRecommendedSongs();
    }
    
    if (query && !isExpired) {
      setLoading(true);
      setSongs([]);
      fetchSongsByQuery(query);
    }
  }, [query, isExpired]);

  useEffect(() => {
    if (!Object.keys(profile).length && !isExpired) {
      getUserProfile();
    }
  }, [isExpired])

  useEffect(() => {
    removeUrlQueryParams();
  }, []);

  return (
    <div className="max-w-4xl w-full mx-auto p-5">
      <Header handleLogout={handleLogout} profile={profile} />
      <SearchBar handleSearch={handleSearch} />
      
      <h1 className="py-3 mt-8 text-xl lg:text-2xl font-bold lg:inline-flex lg:items-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2 inline-block">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
        </svg>

        {!query ? (
          'Rekomendasi lagu untuk Anda'
        ) : `Hasil pencarian untuk ${query}`}
      </h1>
      {loading && (
        <div className="text-center my-12">
          <Loading />
        </div>
      )}
      {error && (
        <div className="text-center">
          <p className="my-5 text-center">{error}</p>
          <a href="/" className="px-4 py-2 bg-green-600 text-white inline-block mx-auto text-center rounded">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2 inline-block">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
            Coba lagi</a>
        </div>
      )}
      <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-5 py-5">
        { !error && songs.map((song) => (
          <SongCard key={song.id} song={song} />
        ))}
      </div>
    </div>
  )
}