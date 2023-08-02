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
      
      <h1 className="py-3 mt-8 text-2xl font-bold inline-flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
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