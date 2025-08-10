const TYPE_COLORS = {
  fire: 'bg-red-200 text-red-800',
  water: 'bg-sky-200 text-sky-800',
  grass: 'bg-green-200 text-green-800',
  electric: 'bg-yellow-200 text-yellow-800',
  psychic: 'bg-pink-200 text-pink-800',
  ice: 'bg-cyan-200 text-cyan-800',
  dragon: 'bg-indigo-200 text-indigo-800',
  dark: 'bg-gray-300 text-gray-800',
  fairy: 'bg-rose-200 text-rose-800',
};

export default function PokemonCard({ pokemon, onAdd }) {
  return (
    <article className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-xl transition border border-gray-100 overflow-hidden">
      <div className="p-4 flex flex-col items-center">
        <img src={pokemon.image} alt={pokemon.name} className="w-28 h-28 object-contain drop-shadow-lg" />
        <h3 className="capitalize font-bold text-lg mt-4">{pokemon.name}</h3>

        <div className="flex gap-2 mt-2 flex-wrap justify-center">
          {pokemon.types.map((t) => (
            <span
              key={t}
              className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${TYPE_COLORS[t] || 'bg-gray-100 text-gray-800'}`}
            >
              {t}
            </span>
          ))}
        </div>

        <div className="flex gap-4 text-sm mt-4 text-gray-600">
          <Stat label="HP" value={pokemon.stats.hp} />
          <Stat label="Atk" value={pokemon.stats.attack} />
          <Stat label="Def" value={pokemon.stats.defense} />
        </div>

        <button
          onClick={() => onAdd(pokemon)}
          className="mt-5 px-5 py-2 rounded-full bg-gray-700 text-white font-semibold shadow hover:scale-105 transition"
        >
          Add to Collection
        </button>
      </div>
    </article>
  );
}

function Stat({ label, value }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-xs text-gray-400">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
