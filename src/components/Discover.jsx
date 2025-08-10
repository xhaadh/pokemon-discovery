import { useEffect, useMemo, useRef, useState } from 'react';
import { useInfinitePokemons } from '../hooks/useInfinitePokemons';
import PokemonCard from './PokemonCard';

export default function Discover({ onAdd }) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status, error } = useInfinitePokemons();
  const [visibleCount, setVisibleCount] = useState(6);
  const sentinelRef = useRef(null);

  const allPokemons = useMemo(() => (data ? data.pages.flatMap((p) => p.pokemons) : []), [data]);
  const visiblePokemons = allPokemons.slice(0, visibleCount);

  useEffect(() => {
    if (!sentinelRef.current) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Step 1: If we have more already-fetched Pokémon, just reveal them
            if (visibleCount < allPokemons.length) {
              setVisibleCount((prev) => prev + 6);
            }
            // Step 2: If we’ve revealed all and there’s more to fetch, load the next page
            else if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }
        });
      },
      { rootMargin: '200px' }
    );

    io.observe(sentinelRef.current);
    return () => io.disconnect();
  }, [visibleCount, allPokemons.length, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (status === 'loading') return <div className="text-center py-10 text-gray-500">Loading pokémons…</div>;
  if (status === 'error') return <div className="text-center py-10 text-red-500">Error: {String(error)}</div>;

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <header className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800">
          Discover Pokémon
        </h1>
        <p className="text-gray-500 mt-2">Catch your favorites and build your dream collection!</p>
      </header>

      {/* Pokemon Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {visiblePokemons.map((p) => (
          <PokemonCard key={p.id} pokemon={p} onAdd={onAdd} />
        ))}
      </div>

      {/* Infinite Scroll Sentinel */}
      <div ref={sentinelRef} className="h-6" />

      {/* Status Messages */}
      <div className="text-center mt-4 text-sm text-gray-500">
        {isFetchingNextPage && <span>Loading more…</span>}
        {!hasNextPage && visibleCount >= allPokemons.length && (
          <span>You’ve reached the end.</span>
        )}
      </div>
    </section>
  );
}
