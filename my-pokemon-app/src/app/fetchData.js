// fetchData.js
export async function fetchAllPokemon() {
    const res = await fetch("https://pokeapi.co/api/v2/pokemon?offset=0&limit=500");
    if (!res.ok) {
      throw new Error("Failed to fetch Pokémon data");
    }
    const data = await res.json();
  
    const pokemonDetails = await Promise.all(
      data.results.map(async (pokemon) => {
        const details = await fetchPokemonDetails(pokemon.url);
        return { ...pokemon, ...details };
      })
    );
  
    return pokemonDetails;
  }
  
  async function fetchPokemonDetails(url) {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Failed to fetch Pokémon details");
    }
    const data = await res.json();
    const id = data.id;
  
    const stats = data.stats.reduce((acc, stat) => {
      acc[stat.stat.name] = stat.base_stat;
      return acc;
    }, {});
  
    return {
      image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
      types: data.types.map((t) => t.type.name),
      stats,
    };
  }
  