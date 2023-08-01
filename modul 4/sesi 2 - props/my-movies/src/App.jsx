import MovieCard from './components/MovieCard';
import movies from './data/movies.json';

function App() {

  return (
    <div className="min-h-screen grid place-items-center font-main bg-gray-900 gap-14">
      <h1 className="text-5xl text-center py-5 mt-10 mb-8 text-white font-bold">Daftar Film yang Rilis 2020 - 2023</h1>
      {movies.map((movie, idx) => (
        <MovieCard movie={movie} key={idx} />
      ))}
    </div>
  )
}

export default App