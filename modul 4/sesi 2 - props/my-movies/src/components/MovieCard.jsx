import Poster from "./Poster";
import Tag from "./Tag";

export default function MovieCard({ movie }) {
  const {title, year, thumbnail, genres, href, extract} = movie;

  return (
    <>
      <div className="rounded-md bg-gray-800 shadow-lg">
        <div className="md:flex gap-8 px-4 leading-none max-w-4xl">
          {thumbnail && (
            <Poster name={title} imageUrl={thumbnail} />
          )}
          <div className="text-gray-300 space-y-2 pt-6 pb-8">
            <p className="text-2xl font-bold">{title} ({year})</p>
            <div className="py-2 space-x-2 space-y-1">
              {genres && genres.map((genre, idx) => (
                <Tag tag={genre} key={idx} />
              ))} 
            </div>
            <p className="hidden md:block text-sm text-left">{extract}</p>
            <a href={`https://wikipedia.org/wiki/${href}`} className="inline-block px-3 py-2 mt-5 text-sm bg-teal-800 text-white" target="_blank" rel="noopener noreferrer rounded">Lihat di Wikipedia</a>
          </div>
        </div>
      </div>
    </>
  )
}