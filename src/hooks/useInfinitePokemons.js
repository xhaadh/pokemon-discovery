import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchPokemons = async ({ pageParam = 0 }) => {
  const limit = 6;
  const offset = pageParam;
  const res = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);

  // Fetch details for each Pokémon
  const detailed = await Promise.all(
    res.data.results.map(async (p) => {
      const details = await axios.get(p.url);
      return {
        id: details.data.id,
        name: details.data.name,
        image: details.data.sprites.other['official-artwork'].front_default,
        types: details.data.types.map((t) => t.type.name),
        stats: {
          hp: details.data.stats[0].base_stat,
          attack: details.data.stats[1].base_stat,
          defense: details.data.stats[2].base_stat,
        },
      };
    })
  );

  return {
    pokemons: detailed,
    nextOffset: offset + limit,
    hasMore: !!res.data.next,
  };
};

export function useInfinitePokemons() {
  return useInfiniteQuery({
    queryKey: ['pokemons'],
    queryFn: fetchPokemons,
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextOffset : undefined,
    staleTime: 1000 * 60 * 2,
  });
}
