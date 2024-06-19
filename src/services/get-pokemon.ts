export interface Pokemon {
  [index: string]: any;
}

// let pokemonCache: Pokemon[] = [];

export const getPokemon = async (offset: number) => {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=10&offset=${offset}`
  );
  const data: { results: Pokemon[] } = await response.json();
  const pokemon: Pokemon[] = await Promise.all(
    data.results.map(async (pokemon: any) => {
      const response = await fetch(pokemon.url);
      const data = await response.json();
      return data;
    })
  );
      
      // const set1 = new Set(pokemonCache.map(poke => poke.name));
      // const set2 = new Set(pokemon.map(poke => poke.name));

      // const hasCommonItem = [...set1].some(item => set2.has(item));

      // console.log(`cache before ${pokemonCache.map(poke => poke.name)}`);
      // if(!hasCommonItem) {
      //     pokemonCache = [...pokemonCache, ...pokemon]
      // }

      // console.log(`cache after ${pokemonCache.map(poke => poke.name)}`);
  // return pokemonCache;
  return pokemon;
};