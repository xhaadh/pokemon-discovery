import { useRef, useState } from "react";

const TYPE_COLORS = {
  fire: "bg-red-200 text-red-800",
  water: "bg-sky-200 text-sky-800",
  grass: "bg-green-200 text-green-800",
  electric: "bg-yellow-200 text-yellow-800",
  psychic: "bg-pink-200 text-pink-800",
  ice: "bg-cyan-200 text-cyan-800",
  dragon: "bg-indigo-200 text-indigo-800",
  dark: "bg-gray-300 text-gray-800",
  fairy: "bg-rose-200 text-rose-800",
};

export default function Collection({ collection, setCollection }) {
  const dragItem = useRef(null);
  const dragNode = useRef(null);
  const [draggingIndex, setDraggingIndex] = useState(null);

  const handleDragStart = (e, index) => {
    dragItem.current = index;
    dragNode.current = e.currentTarget;
    setDraggingIndex(index);
    try {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", "dragging");
    } catch {e}
    dragNode.current.classList.add("opacity-80", "scale-[0.97]");
  };

  const handleDragEnter = (e, targetIndex) => {
    e.preventDefault();
    if (dragNode.current === e.currentTarget) return;
    const currentIndex = dragItem.current;
    if (currentIndex == null) return;

    const newList = Array.from(collection);
    const [moved] = newList.splice(currentIndex, 1);
    newList.splice(targetIndex, 0, moved);

    dragItem.current = targetIndex;
    setCollection(newList);
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDragEnd = () => {
    if (dragNode.current) {
      dragNode.current.classList.remove("opacity-80", "scale-[0.97]");
    }
    dragItem.current = null;
    dragNode.current = null;
    setDraggingIndex(null);
  };

  const handleRemove = (id) => {
    setCollection((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header with gradient accent */}
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-gray-100">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight bg-gradient-to-r from-amber-600 to-pink-500 bg-clip-text text-transparent">
              My Collection
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {collection.length === 0
                ? "Your collection is empty. Add Pokémon from Discover!"
                : `${collection.length} Pokémon saved`}
            </p>
          </div>
          <span className="text-xs text-gray-400 italic select-none">
            Drag to reorder
          </span>
        </div>

        {/* Empty state */}
        {collection.length === 0 ? (
          <div className="p-10 text-center">
            <div className="text-5xl mb-3">✨</div>
            <p className="text-gray-500">
              No Pokémon yet — go catch some in{" "}
              <span className="font-medium text-amber-600">Discover</span>!
            </p>
          </div>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {collection.map((p, idx) => (
              <li
                key={p.id}
                draggable
                onDragStart={(e) => handleDragStart(e, idx)}
                onDragEnter={(e) => handleDragEnter(e, idx)}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
                className={`bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden cursor-grab transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:rotate-[0.5deg] ${
                  draggingIndex === idx ? "ring-2 ring-amber-400" : ""
                }`}
              >
                <div className="p-5 flex flex-col items-center">
                  {/* Image with shimmer effect */}
                  <div className="relative w-28 h-28 mb-4">
                    <div className="absolute inset-0 bg-gray-100 animate-pulse rounded-lg" />
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-contain relative z-10 drop-shadow-sm"
                      onLoad={(e) => {
                        e.target.previousSibling.style.display = "none";
                      }}
                    />
                  </div>

                  {/* Name & Remove */}
                  <div className="w-full text-center">
                    <div className="flex items-center justify-between">
                      <h3 className="capitalize font-medium text-lg text-gray-800">
                        {p.name}
                      </h3>
                      <button
                        onClick={() => handleRemove(p.id)}
                        aria-label={`Remove ${p.name}`}
                        title="Remove"
                        className="p-1 rounded-full hover:bg-gray-100 transition"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4 text-gray-400 hover:text-red-500 transition"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3m-9 0h10"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Types with animation */}
                    <div className="mt-2 flex gap-2 justify-center flex-wrap">
                      {p.types.map((t) => (
                        <span
                          key={t}
                          className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                            TYPE_COLORS[t] || "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="mt-5 flex justify-between w-full text-sm text-gray-500 border-t border-gray-100 pt-3">
                    <div className="text-center flex-1">
                      <div className="text-xs uppercase tracking-wide">HP</div>
                      <div className="font-medium text-gray-800">
                        {p.stats?.hp ?? "-"}
                      </div>
                    </div>
                    <div className="text-center flex-1">
                      <div className="text-xs uppercase tracking-wide">Atk</div>
                      <div className="font-medium text-gray-800">
                        {p.stats?.attack ?? "-"}
                      </div>
                    </div>
                    <div className="text-center flex-1">
                      <div className="text-xs uppercase tracking-wide">Def</div>
                      <div className="font-medium text-gray-800">
                        {p.stats?.defense ?? "-"}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Badge fade animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease forwards;
        }
      `}</style>
    </div>
  );
}
