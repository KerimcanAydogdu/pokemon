"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

async function getAllPokemon() {
  const res = await fetch('https://pokeapi.co/api/v2/pokemon?offset=0&limit=500');
  if (!res.ok) {
    throw new Error('Failed to fetch Pokémon data');
  }
  return res.json();
}

async function getPokemonDetails(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch Pokémon details');
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

export default function PokemonPage() {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();  //yönlendirme

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getAllPokemon();
        const pokemonDetails = await Promise.all(
          data.results.map(async (pokemon) => {
            const details = await getPokemonDetails(pokemon.url);
            return { ...pokemon, ...details };
          })
        );
        setPokemonList(pokemonDetails);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateAverageStat = (stats) => {
    const values = Object.values(stats);
    const total = values.reduce((acc, stat) => acc + stat, 0);
    return Math.round(total / values.length);
  };

  const sortedPokemonByType = pokemonList.reduce((acc, pokemon) => {
    pokemon.types.forEach((type) => {
      const avgStat = calculateAverageStat(pokemon.stats);
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push({ ...pokemon, avgStat });
    });
    return acc;
  }, {});

  const topPokemonByType = Object.keys(sortedPokemonByType).reduce((acc, type) => {
    const sortedByType = sortedPokemonByType[type].sort((a, b) => b.avgStat - a.avgStat);
    acc[type] = sortedByType.slice(0, 3);
    return acc;
  }, {});

  const sortedTypesByAvgStat = Object.keys(topPokemonByType)
    .map((type) => {
      const avgStat = topPokemonByType[type].reduce((acc, pokemon) => acc + pokemon.avgStat, 0) / 3;
      return { type, avgStat };
    })
    .sort((a, b) => b.avgStat - a.avgStat);

  const getTypeEffect = (type) => {
    switch (type) {
      case 'fire':
        return 'fire-effect';
      case 'water':
        return 'water-effect';
      case 'grass':
        return 'grass-effect';
      case 'electric':
        return 'electric-effect';
      case 'ice':
        return 'ice-effect';
      case 'fighting':
        return 'fighting-effect';
      case 'poison':
        return 'poison-effect';
      case 'flying':
        return 'flying-effect';
      case 'bug':
        return 'bug-effect';
      case 'normal':
        return 'normal-effect';
      case 'ground':
        return 'ground-effect';
      case 'fairy':
        return 'fairy-effect';
      case 'psychic':
        return 'psychic-effect';
      case 'rock':
        return 'rock-effect';
      case 'ghost':
        return 'ghost-effect';
      case 'dragon':
        return 'dragon-effect';
      case 'steel':
        return 'steel-effect';
      case 'dark':
        return 'dark-effect';
      default:
        return '';
    }
  };

  const handleTypeClick = (type) => {
    router.push(`/pokemon?page=1&type=${type}`);
  };

  return (
<div className="relative pt-12 overflow-hidden bg-gray-900">
      <Image src="/a.jpeg" alt="Pokémon Logo" width={1000} height={96} className="absolute inset-0 w-full h-full object-cover z-0 brightness-50 blur-md" />
      <section className="relative p-8 md:pt-24 2xl:px-20 text-center text-white mt-32 md:mt-16 z-10">
        {loading && (
          <div className="flex justify-center items-center h-screen">
            <img src="/loader.gif" alt="Yükleniyor..." className="w-40 h-40" />
          </div>
        )}

        {pokemonList.length === 0 && !loading && (
          <div className="flex flex-col items-center">
            <p className="text-3xl md:text-5xl m-80 text-red-400">Pokémon bulunamadı.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sortedTypesByAvgStat.map(({ type, avgStat }) => (
            <div key={type} className="px-4  py-4">
              <h2
                className={`text-2xl cursor-pointer bg-zinc-950 bg-opacity-55 font-semibold py-2 rounded-lg transition transform hover:scale-105 ${getTypeEffect(type)}`}
                onClick={() => handleTypeClick(type)}
              >
                {type.toUpperCase()} - {Math.round(avgStat)}
              </h2>
              <div className="flex flex-wrap justify-center gap-5 mt-5">
                {topPokemonByType[type].map((pokemon, index) => (
                  <div key={index} className="group relative transition-transform hover:scale-105 rounded-xl shadow-lg border border-gray-800 hover:border-white">
                    <Link href={`/pokemon/${pokemon.url.split("/")[6]}`}>
                      <div className={`rounded-xl p-4  group-hover:shadow-xl ${getTypeEffect(type)}`}>
                        <div className="flex justify-between items-start">
                          <div className="flex flex-col items-center">
                            <div className="w-10 h-10 rounded-full bg-gray-700 flex justify-center items-center text-white font-bold">
                              {calculateAverageStat(pokemon.stats)}
                            </div>
                          </div>
                          <Image src={pokemon.image} width={100} height={100} alt={pokemon.name} className="w-28 h-28 object-cover rounded-md"/>
                        </div>
                        <h2 className="text-lg font-semibold text-white mt-4 text-center">{pokemon.name}</h2>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
