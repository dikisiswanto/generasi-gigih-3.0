export default function SongCard({ song }) {
  const {id, name: title, album, artists} = song;

  return (
    <a href={`https://open.spotify.com/track/${id}`} className="max-w-full rounded-md overflow-hidden shadow-lg bg-slate-800/40 px-3 py-3 hover:bg-slate-700/50 group">
      <div className="relative">
        <figure className="w-full lg:h-[175px] h-[120px] bg-slate-900">
          <img className="w-full lg:h-[175px] h-[120px] object-cover object-center" src={album.images[0]?.url} alt={title} />
        </figure>
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 group-hover:pb-5 transition-all duration-300">
          <button className="h-12 w-12 rounded-full hover:scale-105 bg-green-500 shadow-2xl transition flex items-center justify-center pl-1 transform translate-x-full translate-y-full mt-4">
            <svg
              className="w-5 h-5 text-white opacity-90 group-hover:opacity-100 transition-opacity"
              viewBox="0 0 512 512">
              <path d="M74.666 0v512l362.667-256z" />
            </svg>
          </button>
        </div>
      </div>
      <div className="py-3">
        <div className="font-bold mb-1 line-clamp-1">{title}</div>
        <p className="text-gray-300 text-sm line-clamp-2">
          {artists.map((artist) => artist.name).join(', ')}
        </p>
      </div>
    </a>
  )
}