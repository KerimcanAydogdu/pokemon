"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Image from "next/image";

const ITEMS_PER_PAGE = 24;

const typeImages = {
  grass: "/grass.png",
  poison: "/poison.png",
  fire: "/fire.png",
  water: "/water.png",
  flying: "/flying.png",
  bug: "/bug.png",
  normal: "/normal.png",
  electric: "/electric.png",
  ground: "/ground.png",
  fairy: "/fairy.png",
  fighting: "/fighting.png",
  psychic: "/psychic.png",
  rock: "/rock.png",
  ghost: "/ghost.png",
  ice: "/ice.png",
  dragon: "/dragon.png",
  steel: "/steel.png",
  dark: "/dark.png",
};

async function getAllPokemon() {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=0&limit=120`);
  if (!res.ok) {
    throw new Error("Failed to fetch Pokémon data");
  }
  return res.json();
}

async function getPokemonDetails(url) {
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

export default function PokemonPage({ searchParams }) {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);

  const page = parseInt(searchParams.page || "1", 10);
  const offset = (page - 1) * ITEMS_PER_PAGE;

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
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams.page]);

  const TOTAL_PAGES = Math.ceil(pokemonList.length / ITEMS_PER_PAGE);
  const pageNumbers = Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1);

  const calculateAverageStats = (stats) => {
    const values = Object.values(stats);
    const total = values.reduce((acc, stat) => acc + stat, 0);
    return Math.round(total / values.length);
  };

  const getStatColor = (averageStat) => {
    if (averageStat < 60) {
      return "bg-gradient-to-tr from-gray-600";
    } else if (averageStat < 80) {
      return "bg-gradient-to-tr from-blue-600 ";
    } else {
      return "bg-gradient-to-tr from-yellow-600";
    }
  };

  // Sıralama işlemi: Pokémon'ları ortalama statlarına göre büyükten küçüğe sırala
  const sortedPokemon = [...pokemonList].sort((a, b) => {
    const avgStatA = calculateAverageStats(a.stats);
    const avgStatB = calculateAverageStats(b.stats);
    return avgStatB - avgStatA; // Büyükten küçüğe sıralama
  });

  return (
    <div className="relative pt-12 overflow-hidden">
      <Image src="/a.jpeg" alt="Pokémon Logo" width={1000} height={96} className="absolute inset-0 w-full h-full object-cover z-0 brightness-50 blur-sm" />

      <section className="relative p-10 z-10 pb-3 md:p-28 text-center text-white mt-52 md:mt-32">
        {loading && (
          <div className="flex justify-center items-center h-screen">
            <img src="/loader.gif" alt="Yükleniyor..." className="w-40 h-40" />
          </div>
        )}

        {pokemonList.length === 0 && !loading && (
          <div className="flex flex-col items-center">
            <p className="text-5xl m-80 text-red-400">Pokémon bulunamadı.</p>
          </div>
        )}

        <ul className="grid grid-cols-2 2xl:grid-cols-6 lg:grid-cols-4 md:grid-cols-2 gap-10">
          {sortedPokemon.slice(offset, offset + ITEMS_PER_PAGE).map((pokemon, index) => {
            const averageStat = calculateAverageStats(pokemon.stats);
            const statColor = getStatColor(averageStat);
            return (
              <li key={index} className="relative shadow-xl hover:scale-105 active:scale-95 rounded-3xl active:shadow-red-900 transition-transform">
                <Link href={`/pokemon/${pokemon.url.split("/")[6]}`}>
                  <div className={`box ${statColor} rounded-3xl shadow-2xl`}>
                    <div className="flex items-center">
                      <div className="relative flex flex-col items-center mr-3">
                        <div className={`w-10 h-10 rounded-full ${statColor} flex justify-center items-center text-white font-semibold`}>
                          {averageStat}
                        </div>
                        <img className="w-10 h-10 mt-2" src={typeImages[pokemon.types[0]] || "/default.png"} alt={pokemon.types[0]} />
                        <span className="text-white mt-1 text-sm">{pokemon.types[0]}</span>
                      </div>
                      <img className="w-32 h-auto rounded-full shadow-lg" src={pokemon.image} alt={pokemon.name} />
                    </div>
                    <h2 className="text-xl font-bold text-white mt-4">{pokemon.name}</h2>
                    <hr className="my-3 border-t-2 border-white" />
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div>
                        <ul className="text-white">
                          <li>HP: {pokemon.stats.hp}</li>
                          <li>ATK: {pokemon.stats.attack}</li>
                          <li>DEF: {pokemon.stats.defense}</li>
                        </ul>
                      </div>
                      <div>
                        <ul className="text-white">
                          <li>SA: {pokemon.stats["special-attack"]}</li>
                          <li>SD: {pokemon.stats["special-defense"]}</li>
                          <li>SPD: {pokemon.stats.speed}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-14 flex justify-center items-center space-x-4">
          {page > 1 && <Link href={`/power?page=${page - 1}`} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"><FaChevronLeft className="mr-2" /></Link>}
          <div className="flex space-x-2">
            {pageNumbers.map((num) => (
              <Link key={num} href={`/power?page=${num}`}>
                <span className={`px-4 py-2 rounded-lg ${num === page ? "bg-red-600 text-white" : "bg-red-400 hover:bg-red-500"} transition-colors`}>{num}</span>
              </Link>
            ))}
          </div>
          {page < TOTAL_PAGES && <Link href={`/power?page=${page + 1}`} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"><FaChevronRight className="ml-2" /></Link>}
        </div>
      </section>
    </div>
  );
}
