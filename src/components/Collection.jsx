import React, { memo, useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "react-hot-toast";

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

const SortableItem = memo(function SortableItem({ p, handleRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: p.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`relative bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden 
      ${isDragging
          ? "ring-2 ring-amber-400 opacity-80 scale-[0.97] shadow-none transition-none"
          : "transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:rotate-[0.5deg]"
        }`}
      // Desktop: drag whole card
      {...(window.innerWidth >= 640 ? { ...attributes, ...listeners } : {})}
    >
      {/* Drag Handle - Mobile only */}
      <div
        className="absolute top-2 left-2 sm:hidden text-gray-400 z-20 touch-none active:scale-110 transition"
        {...(window.innerWidth < 640 ? { ...attributes, ...listeners } : {})}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 8h16M4 16h16"
          />
        </svg>
      </div>

      {/* Remove Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleRemove(p.id, p.name);
        }}
        aria-label={`Remove ${p.name}`}
        title="Remove"
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 transition z-20"
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

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex flex-col items-center cursor-grab">
        {/* Image */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 mb-4">
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

        {/* Name */}
        <h3 className="capitalize font-medium text-base sm:text-lg text-gray-800 text-center">
          {p.name}
        </h3>

        {/* Types */}
        <div className="mt-2 flex gap-1.5 sm:gap-2 justify-center flex-wrap">
          {p.types?.map((t) => (
            <span
              key={t}
              className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium capitalize ${TYPE_COLORS[t] || "bg-gray-100 text-gray-800"
                }`}
            >
              {t}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-4 sm:mt-5 flex justify-between w-full text-xs sm:text-sm text-gray-500 border-t border-gray-100 pt-2 sm:pt-3">
          <div className="text-center flex-1">
            <div className="uppercase tracking-wide">HP</div>
            <div className="font-medium text-gray-800">
              {p.stats?.hp ?? "-"}
            </div>
          </div>
          <div className="text-center flex-1">
            <div className="uppercase tracking-wide">Atk</div>
            <div className="font-medium text-gray-800">
              {p.stats?.attack ?? "-"}
            </div>
          </div>
          <div className="text-center flex-1">
            <div className="uppercase tracking-wide">Def</div>
            <div className="font-medium text-gray-800">
              {p.stats?.defense ?? "-"}
            </div>
          </div>
        </div>
      </div>
    </li>
  );
});

function DragPreview({ p }) {
  if (!p) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 flex flex-col items-center w-24 sm:w-28">
      <img
        src={p.image}
        alt={p.name}
        className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-sm"
      />
      <p className="capitalize mt-1 sm:mt-2 text-xs sm:text-sm font-medium">{p.name}</p>
    </div>
  );
}

export default function Collection({ collection, setCollection }) {
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5, delay: 150, tolerance: 5 } })
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setCollection((items) => {
        const oldIndex = items.findIndex((p) => p.id === active.id);
        const newIndex = items.findIndex((p) => p.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
    setActiveId(null);
  };

  const handleRemove = (id, name) => {
    setCollection((prev) => prev.filter((p) => p.id !== id));
    toast.error(`${name} removed from your collection`, {
      position: "bottom-right",
    });
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8 pb-3 border-b border-gray-100">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight bg-gradient-to-r from-amber-600 to-pink-500 bg-clip-text text-transparent">
              My Collection
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {collection.length === 0
                ? "Your collection is empty. Add Pokémon from Discover!"
                : `${collection.length} Pokémon saved`}
            </p>
          </div>
          <span className="text-[10px] sm:text-xs text-gray-400 italic select-none">
            Tap & Hold to Drag
          </span>
        </div>

        {/* Empty state */}
        {collection.length === 0 ? (
          <div className="p-6 sm:p-10 text-center">
            <div className="text-4xl sm:text-5xl mb-3">✨</div>
            <p className="text-gray-500">
              No Pokémon yet — go catch some in{" "}
              <span className="font-medium text-amber-600">Discover</span>!
            </p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={collection}
              strategy={verticalListSortingStrategy}
            >
              <ul className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
                {collection.map((p) => (
                  <SortableItem key={p.id} p={p} handleRemove={handleRemove} />
                ))}
              </ul>
            </SortableContext>

            <DragOverlay>
              <DragPreview
                p={collection.find((p) => p.id === activeId)}
              />
            </DragOverlay>
          </DndContext>
        )}
      </div>
    </div>
  );
}
