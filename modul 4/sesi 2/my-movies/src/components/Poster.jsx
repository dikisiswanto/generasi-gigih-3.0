export default function Poster({imageUrl, name}) {
  return (
    <div className="flex-none">
      <img
        src={imageUrl}
        alt={name}
        className="h-72 w-56 rounded-md shadow-2xl transform -translate-y-6 border-4 border-gray-300"
        />           
    </div>
  )
}