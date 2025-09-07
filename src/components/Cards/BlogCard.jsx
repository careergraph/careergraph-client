export default function BlogCard() {
  return (
    <div className="max-w-72 w-full hover:-translate-y-0.5 transition duration-300">
      <img
        className="rounded-xl"
        src="https://images.unsplash.com/photo-1590650516494-0c8e4a4dd67e?w=1200&h=800&auto=format&fit=crop&q=60"
        alt=""
      />

      <h3 className="text-base text-slate-900 font-medium mt-3">
        Color Psychology in UI: How to Choose the Right Palette
      </h3>

      <p className="text-xs text-indigo-600 font-medium mt-1">UI/UX design</p>
    </div>
  );
}
