export default function CategoryCard({ title, description, resource, color }) {
  return (
    <div
      className={`p-4 rounded-lg shadow max-w-80 cursor-pointer transition-colors duration-300 hover:opacity-90 ${color}`}
    >
      <img
        className="rounded-md max-h-40 w-1/4 object-cover"
        src={resource}
        alt={title}
      />

      <p className="text-gray-900 text-xl font-semibold ml-2 mt-2">{title}</p>

      <p className="text-gray-500 text-sm my-3 ml-2">{description}</p>
    </div>
  );
}
