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
  return {
    image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
    types: data.types.map((t) => t.type.name),
  };
}

export default function PokemonPage({ searchParams }) {
  const [pokemonList, setPokemonList] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

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
        setFilteredPokemon(pokemonDetails);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams.page]);

  useEffect(() => {
    const filtered = pokemonList.filter((pokemon) => {
        const lowerCaseName = pokemon.name.toLowerCase();
        const lowerCaseSearchTerm = searchTerm.toLowerCase();

        // Arama terimini Pokémon adında sırasıyla bulma
        let match = true;
        let lastIndex = 0;

        for (let char of lowerCaseSearchTerm) {
            lastIndex = lowerCaseName.indexOf(char, lastIndex);
            if (lastIndex === -1) {
                match = false;
                break;
            }
            lastIndex++;
        }

        return match;
    }).filter((pokemon) =>
      selectedType ? pokemon.types.includes(selectedType) : true
    );
    setFilteredPokemon(filtered);
  }, [searchTerm, selectedType, pokemonList]);

  const TOTAL_PAGES = Math.ceil(filteredPokemon.length / ITEMS_PER_PAGE);
  const paginatedPokemon = filteredPokemon.slice(offset, offset + ITEMS_PER_PAGE);
  const pageNumbers = Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1);

  return (
    <div className="relative pt-12 overflow-hidden">
      <Image src="/a.jpeg" alt="Pokémon Logo" width={1000} height={96} className="absolute inset-0 w-full h-full object-cover z-0 brightness-50 blur-sm" />

      <section className="relative p-10 z-10 pb-3 md:p-28 text-center text-white mt-52 md:mt-32">
        <div className="flex mb-24 relative  w-full md:w-3/6 lg:w-2/6 mx-auto space-x-1">
          <input
            type="text"
            placeholder="Bir Pokemon Ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-8 py-2 text-lg bg-zinc-400 text-zinc-900 rounded-full shadow-2xl focus:outline-none placeholder-zinc-600 "
          />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-6 py-2 bg-zinc-400 text-zinc-700 text-lg rounded-full shadow-2xl appearance-none cursor-pointer focus:outline-none"
          >
            <option value="">Tür Filtrele</option>
            {["fire", "water", "grass", "electric", "poison", "flying", "bug", "ghost", "normal", "dark", "ground", "ice", "rock", "psychic", "fighting", "fairy"].map((type) => (
              <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
            ))}
          </select>
        </div>

        {loading && (
          <div className="flex justify-center items-center h-screen">
            <img 
              src="/loader.gif" 
              alt="Yükleniyor..." 
              className="w-40 h-40" 
            />
          </div>
        )}

        {filteredPokemon.length === 0 && !loading && (
          <div className="flex flex-col items-center">
            <p className="text-5xl m-80 text-red-400">Pokémon bulunamadı.</p>
          </div>
        )}

        <ul className="grid grid-cols-2 2xl:grid-cols-6 lg:grid-cols-4 md:grid-col-2 gap-10">
          {paginatedPokemon.map((pokemon, index) => (
            <li key={index} className="relative shadow-xl hover:scale-105 active:scale-95 rounded-3xl active:shadow-red-900 transition-transform">
              <Link href={`/pokemon/${pokemon.url.split("/")[6]}`}>
                <div className="flex flex-col items-center justify-center bg-gradient-to-tr from-zinc-600 rounded-3xl shadow-2xl">
                  <span className="text-white bg-zinc-800 w-36 rounded-full bg-opacity-35 font-bold text-2xl mt-8 capitalize">{pokemon.name}</span>
                  <Image src={pokemon.image} alt={pokemon.name} width={176} height={176} className="mt-2 object-contain" />
                  <div className="flex space-x-4 m-4 items-center">
                    {pokemon.types.map((type) => (
                      <div key={type} className="flex flex-col items-center">
                        <Image src={typeImages[type] || "/default.png"} alt={type} width={40} height={40} />
                        <span className="text-white text-lg font-bold capitalize mt-1">{type}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-14 flex justify-center items-center space-x-4">
          {page > 1 && <Link href={`/pokemon?page=${page - 1}`} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"><FaChevronLeft className="mr-2" /></Link>}
          <div className="flex space-x-2">
            {pageNumbers.map((num) => (
              <Link key={num} href={`/pokemon?page=${num}`}>
                <span className={`px-4 py-2 rounded-lg ${num === page ? "bg-red-600 text-white" : "bg-red-400 hover:bg-red-500"} transition-colors`}>{num}</span>
              </Link>
            ))}
          </div>
          {page < TOTAL_PAGES && <Link href={`/pokemon?page=${page + 1}`} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"><FaChevronRight className="ml-2" /></Link>}
        </div>

      </section>
    </div>
  );
}
