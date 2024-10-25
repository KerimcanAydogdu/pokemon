"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const ITEMS_PER_PAGE = 20;
const MAX_POKEMON = 100;

const typeColors = {
  grass: "bg-green-500",
  poison: "bg-purple-500",
  fire: "bg-red-500",
  water: "bg-blue-500",
  flying: "bg-blue-200",
  bug: "bg-lime-500",
  normal: "bg-gray-400",
  electric: "bg-yellow-500",
  ground: "bg-yellow-700",
  fairy: "bg-pink-500",
  fighting: "bg-red-700",
  psychic: "bg-pink-600",
  rock: "bg-yellow-600",
  ghost: "bg-purple-700",
  ice: "bg-blue-300",
  dragon: "bg-indigo-700",
  steel: "bg-gray-500",
  dark: "bg-gray-700",
};

async function getAllPokemon() {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=100`);
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
  return {
    image: data.sprites.front_default,
    types: data.types.map((t) => t.type.name),
  };
}

export default function PokemonPage({ searchParams }) {
  const [pokemonList, setPokemonList] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const page = parseInt(searchParams.page || "1", 10);
  const offset = (page - 1) * ITEMS_PER_PAGE;

  useEffect(() => {
    const fetchData = async () => {
      setError(null);
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
        setError("Veri alımı sırasında bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (type) => {
    setSelectedType(type);
    if (type === "Tümü") {
      setFilteredPokemon(pokemonList);
    } else {
      const filtered = pokemonList.filter((pokemon) =>
        pokemon.types.includes(type)
      );
      setFilteredPokemon(filtered);
    }
    setIsOpen(false);
  };

  const TOTAL_PAGES = Math.ceil(filteredPokemon.length / ITEMS_PER_PAGE);
  const paginatedPokemon = filteredPokemon.slice(
    offset,
    offset + ITEMS_PER_PAGE
  );

  const pageNumbers = Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const options = [
    "Tümü",
    "fire",
    "water",
    "grass",
    "electric",
    "poison",
    "bug",
    "flying",
    "normal",
    "fairy",
  ];

  return (
    <div className="relative w-full h-full overflow-hidden min-h-screen">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 brightness-50"
      >
        <source src="/pokeballl.mp4" type="video/mp4" />
        Tarayıcınız bu videoyu desteklemiyor.
      </video>

      <section className="relative z-10 p-10 md:p-28 text-center text-white mt-52 md:mt-32">
        <div className="mb-20 relative w-80 md:w-96 mx-auto">
          <button
            onClick={toggleDropdown}
            className="w-full h-full px-8 py-2 bg-gray-300 text-gray-900 rounded-full flex justify-between items-center"
          >
            <span>{selectedType || "Tür Filtrele"}</span>
            <span className="m-1">{isOpen ? "▲" : "▼"}</span>
          </button>

          {isOpen && (
            <ul className="absolute w-full bg-gray-300 rounded-2xl mt-1 max-h-60 overflow-auto custom-scrollbar z-10">
              {options.map((option, index) => (
                <li
                  key={index}
                  onClick={() => handleFilterChange(option)}
                  className="p-2 text-gray-700 hover:bg-gray-500 hover:text-white rounded-xl cursor-pointer transition-colors"
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </li>
              ))}
            </ul>
          )}
        </div>

        {loading && <p>Yükleniyor...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <ul className="grid grid-cols-2 gap-6 lg:grid-cols-5">
          {paginatedPokemon.map((pokemon, index) => (
            <li
              key={index}
              className="relative  p-3 group hover:scale-105 transition-transform"
            >
              <Link href={`/pokemon/${pokemon.url.split("/")[6]}`}>
                <div className="flex flex-col items-center justify-center">
                  <img
                    src={pokemon.image}
                    alt={pokemon.name}
                    className="w-64 h-auto object-contain bg-gray-300  rounded-3xl shadow-md"
                  />
                  <span className="text-white font-bold text-lg mt-2 capitalize">
                    {pokemon.name}
                  </span>
                  <div className="flex space-x-1 mt-1">
                    {pokemon.types.map((type) => (
                      <span
                        key={type}
                        className={`inline-block px-2 py-1 text-white rounded-lg ${
                          typeColors[type] || "bg-gray-500"
                        }`}
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-14 flex justify-center items-center space-x-4">
          {page > 1 && (
            <Link
              href={`/pokemon?page=${page - 1}`}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
            >
              <FaChevronLeft className="mr-2" />
            </Link>
          )}
          <div className="flex space-x-2">
            {pageNumbers.map((num) => (
              <Link key={num} href={`/pokemon?page=${num}`}>
                <span
                  className={`px-4 py-2 rounded-lg ${
                    num === page
                      ? "bg-red-600 text-white"
                      : "bg-red-400 hover:bg-red-500"
                  } transition-colors`}
                >
                  {num}
                </span>
              </Link>
            ))}
          </div>
          {page < TOTAL_PAGES && (
            <Link
              href={`/pokemon?page=${page + 1}`}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
            >
              <FaChevronRight className="ml-2" />
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
