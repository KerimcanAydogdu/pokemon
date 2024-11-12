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
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=0&limit=400`);
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
  }, [searchParams]);

  const TOTAL_PAGES = Math.ceil(pokemonList.length / ITEMS_PER_PAGE);
  const getPageNumbers = () => {
    const pageNumbers = [];
    if (TOTAL_PAGES <= 5) {
      for (let i = 1; i <= TOTAL_PAGES; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      if (page > 3) pageNumbers.push("...");
      if (page > 2) pageNumbers.push(page - 1);
      pageNumbers.push(page);
      if (page < TOTAL_PAGES - 1) pageNumbers.push(page + 1);
      if (page < TOTAL_PAGES - 2) pageNumbers.push("...");
      pageNumbers.push(TOTAL_PAGES);
    }
    return pageNumbers;
  };

  const calculatecolors = (stats) => {
    const values = Object.values(stats);
    const total = values.reduce((acc, stat) => acc + stat, 0);
    return Math.round(total / values.length);
  };

  const getStatColor = (color) => {
    if (color < 60) {
      return "bg-gradient-to-br from-gray-600";
    } else if (color < 80) {
      return "bg-gradient-to-br from-blue-600 ";
    } else if (color < 100) {
      return "bg-gradient-to-br from-fuchsia-600";
    }
    else{
      return "bg-gradient-to-br from-yellow-600";
    }
  };

  const sortedPokemon = [...pokemonList].sort((a, b) => {
    const avgStatA = calculatecolors(a.stats);
    const avgStatB = calculatecolors(b.stats);
    return avgStatB - avgStatA;
  });

  return (
    <div className="relative pt-12 overflow-hidden">
      <Image src="/a.jpeg" alt="Pokémon Logo" width={1000} height={96} className="absolute inset-0 w-full h-full object-cover z-0 brightness-50 blur-sm" />

      <section className="relative p-12 z-10 pb-3 md:p-20 text-center text-white mt-52 md:mt-32">
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

        <ul className="grid grid-cols-1 2xl:grid-cols-6 lg:grid-cols-3 sm:grid-cols-2 gap-10">
          {sortedPokemon.slice(offset, offset + ITEMS_PER_PAGE).map((pokemon, index) => {
            const averageStat = calculatecolors(pokemon.stats);
            const statColor = getStatColor(averageStat);
            return (
              <li key={index} className="relative  hover:scale-105 active:scale-95 rounded-3xl transition-transform">
                <Link href={`/pokemon/${pokemon.url.split("/")[6]}`}>
                  <div className={` ${statColor} rounded-xl shadow-2xl`}>
                    <div className="absolute top-8 left-2">
                      <div className={`w-10 h-10  rounded-full bg-zinc-700 flex justify-center items-center text-white font-semibold`}>
                        {averageStat}
                      </div>
                      <div className="mt-2">
                        {pokemon.types.map((type, index) => (
                          <div key={index} className="flex flex-col items-center mt-1">
                            <Image className="w-8 h-8" src={typeImages[type] || "/default.png"} width={40} height={40} alt={type} />
                            <span className="text-white text-sm">{type}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Image className="w-48 h-48 mx-16 mt-5" src={pokemon.image} width={200} height={200} alt={pokemon.name} />
                    <h2 className="text-xl font-bold text-white mt-4">{pokemon.name}</h2>
                    <hr className="my-4 border-t-2 border-white mx-5" />
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <ul className="text-white">
                          <li>HP: {pokemon.stats.hp}</li>
                          <li>ATK: {pokemon.stats.attack}</li>
                          <li>DEF: {pokemon.stats.defense}</li>
                        </ul>
                      </div>
                      <div>
                        <ul className="text-white border-l-2 border-white h-18 mb-3">
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
            {getPageNumbers().map((num, index) => (
              <Link key={index} href={`/power?page=${num === "..." ? page : num}`}>
                <span className={`px-4 py-2 rounded-lg ${num === page ? "bg-red-600 text-white" : "bg-red-400 hover:bg-red-500"} transition-colors`}>
                  {num}
                </span>
              </Link>
            ))}
          </div>
          {page < TOTAL_PAGES && <Link href={`/power?page=${page + 1}`} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"><FaChevronRight className="ml-2" /></Link>}
        </div>
      </section>
    </div>
  );
}
