export default function SearchBar({ handleSearch }) {
  return (
    <form className="w-full" onSubmit={handleSearch} action="" method="post">   
      <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only">Search</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
          <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
          </svg>
        </div>
        <input type="search" id="default-search" className="block w-full p-4 pl-12 text-sm outline-none focus:outline-none text-gray-200 border border-gray-700 rounded-full bg-slate-800 focus:ring-green-600 focus:border-green-600 transition" autoComplete="off" placeholder="Cari lagu di Spotify" name="query" required />
      </div>
    </form>
  )
}