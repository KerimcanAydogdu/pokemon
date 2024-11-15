"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { FaChevronLeft, FaChevronRight, FaSearch, FaTimes } from "react-icons/fa";

const ITEMS_PER_PAGE = 24;
const TOTAL_POKEMON = 1025;

// Tip görselleri
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

const typeOptions = Object.keys(typeImages);

async function getAllPokemon(offset, limit = ITEMS_PER_PAGE) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
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

function PokemonList({ searchParams }) {
  const [pokemonList, setPokemonList] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [isSearchTriggered, setIsSearchTriggered] = useState(false);

  const router = useRouter();
  const searchParamsObj = useSearchParams();

  const page = parseInt(searchParamsObj.get("page") || "1", 10);
  const filterTypeFromUrl = searchParamsObj.get("type");
  const offset = (page - 1) * ITEMS_PER_PAGE;
  const totalPages = Math.ceil(TOTAL_POKEMON / ITEMS_PER_PAGE);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getAllPokemon(offset);
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
  }, [offset]);

  useEffect(() => {
    if (filterTypeFromUrl) {
      setFilterType(filterTypeFromUrl);
    }
  }, [filterTypeFromUrl]);

  async function handleSearch() {
    if (searchTerm.length >= 3 || filterType) {
      setIsSearchTriggered(true);
      setLoading(true);
  
      try {
        // Pokémonları yeniden alıyoruz.
        const data = await getAllPokemon(0, 1025);
  
        // Fuzzy matching (kapsamlı eşleşme): searchTerm içinde geçen Pokémon isimlerini alıyoruz
        const searchResults = data.results.filter((pokemon) => {
          const name = pokemon.name.toLowerCase();
          const term = searchTerm.toLowerCase();
          
          // Eğer ismin içinde her karakterin sırasını göz önünde bulundurup buluyorsa
          return term.split('').every(char => name.includes(char));
        });
  
        // Detayları alıyoruz
        const searchDetails = await Promise.all(
          searchResults.map(async (pokemon) => {
            const details = await getPokemonDetails(pokemon.url);
            return { ...pokemon, ...details };
          })
        );
  
        // Tür filtresi uygularsak, türleri de filtreliyoruz.
        const filteredResults = filterType
          ? searchDetails.filter((pokemon) => pokemon.types.includes(filterType))
          : searchDetails;
  
        setFilteredPokemon(filteredResults);
      } catch (err) {
        console.error("Error fetching search data:", err);
      } finally {
        setLoading(false);
      }
    }
  }
  
  

  const handleCancelSearch = () => {
    setSearchTerm("");
    setFilterType("");
    setFilteredPokemon(pokemonList);
    setIsSearchTriggered(false);
    router.push(`/pokemon?page=1`);
  };

  const handleTypeClick = (type) => {
    setFilterType(type);
    router.push(`/pokemon?page=1&type=${type}`);
  };

  const getPageNumbers = (currentPage, totalPages) => {
    const pageNumbers = [];
    const range = 2;
    pageNumbers.push(1);
    for (let i = currentPage - range; i <= currentPage + range; i++) {
      if (i > 1 && i < totalPages && !pageNumbers.includes(i)) {
        pageNumbers.push(i);
      }
    }
    if (!pageNumbers.includes(totalPages)) {
      pageNumbers.push(totalPages);
    }
    return pageNumbers;
  };

  const pageNumbers = getPageNumbers(page, totalPages);

  return (
    <div className="relative pt-12 overflow-hidden min-h-screen">
      <Image src="/a.jpeg" alt="Pokémon Logo" width={1000} height={96} className="absolute inset-0 w-full h-full object-cover z-0 brightness-50 blur-sm" />

<section className="relative p-10 z-10 pb-3 md:p-20 text-center text-white mt-52 md:mt-32">
<div className="flex flex-col lg:flex-row relative w-full md:w-3/6 mx-auto space-y-4 lg:space-y-0 md:space-x-1">
  <input
    type="text"
    placeholder="Bir Pokemon Ara..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    }}
    className="w-full px-8 py-2 text-lg bg-zinc-400 text-zinc-900 rounded-full shadow-2xl focus:outline-none placeholder-zinc-600"
  />
  <select
    value={filterType}
    onChange={(e) => setFilterType(e.target.value)}
    className="py-2 px-2 bg-zinc-400 text-zinc-700 text-lg rounded-full text-center lg:text-start shadow-2xl appearance-none cursor-pointer focus:outline-none"
  >
    <option value="">Tür Filtrele</option>
    {typeOptions.map((type) => (
      <option key={type} value={type}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </option>
    ))}
  </select>
  <button
    onClick={() => {
      handleSearch();
      setSearchTerm("");
    }}
    className="px-6 py-2 flex bg-blue-500 justify-center items-center text-white rounded-full shadow-xl hover:bg-blue-600 transition"
  >
    <FaSearch />
  </button>
  {isSearchTriggered && (
    <button
      onClick={handleCancelSearch}
      className="ml-2 px-6 py-2 flex bg-red-500 justify-center items-center text-white rounded-full shadow-xl hover:bg-red-600 transition"
    >
      <FaTimes className="" />
    </button>
  )}
</div>

{/* Eğer searchTerm veya filterType varsa ve butona basılmışsa, mesajı göster */}
{(searchTerm || filterType) && !isSearchTriggered && (
  <p className="text-sm text-red-800 lg:text-lg lg:text-red-400 mt-3">
    ! Arama ve filtreleme işleminden sonra butona basınız.
  </p>
)}



        {loading && (
          <div className="flex justify-center items-center h-screen">
            <img src="/loader.gif" alt="Yükleniyor..." className="w-40 h-40" />
          </div>
        )}

        {filteredPokemon.length === 0 && !loading && (
          <div className="flex flex-col items-center">
            <p className="text-5xl m-80 text-red-400">Pokémon bulunamadı.</p>
          </div>
        )}
        <ul className="grid grid-cols-1 2xl:grid-cols-6 xl:grid-cols-4 lg:grid-cols-3 mt-28 md:grid-cols-2 gap-10">
          {filteredPokemon.map((pokemon, index) => (
            <li key={index} className="relative hover:scale-105   active:scale-95 active:shadow-red-900 transition-transform">
              <Link href={`/pokemon/${pokemon.url.split("/")[6]}`}>
                <div className="flex flex-col items-center justify-center bg-gradient-to-tr   from-zinc-800 via-zinc-500  rounded-3xl shadow-2xl">
                  <span className="text-white bg-zinc-800 px-4   rounded-2xl bg-opacity-35 font-bold text-md mt-8 capitalize">{pokemon.name}</span>
                  <Image src={pokemon.image} alt={pokemon.name} width={155} height={145} className="mt-2 object-contain" />
                  <div className="flex space-x-4 m-4 items-center">
                    {pokemon.types.map((type) => (
                      <div key={type} onClick={() => handleTypeClick(type)} className="flex flex-col items-center cursor-pointer">
                        <Image src={typeImages[type]} alt={type} width={35} height={35} />
                        <span className="text-sm text-white capitalize">{type}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        {!isSearchTriggered && filteredPokemon.length > 0 && (
        <div className="flex justify-center items-center space-x-4 mt-16">
            <Link href={`?page=${page - 1}`} className={`text-3xl ${page === 1 && "hidden"} text-yellow-400`}>
              <FaChevronLeft />
            </Link>
            {pageNumbers.map((pageNum) => (
              <Link
                key={pageNum}
                href={`?page=${pageNum}`}
                className={`text-lg font-semibold ${pageNum === page ? "bg-yellow-500 px-2 py-2" : "hover:text-yellow-400"} rounded-lg`}
              >
                {pageNum}
              </Link>
            ))}
            <Link href={`?page=${page + 1}`} className={`text-3xl ${page === totalPages && "hidden"} text-yellow-400`}>
              <FaChevronRight />
            </Link>
          </div>
                  )}
      </section>
    </div>
  );
}
export default function PokemonPage({ searchParams }) {
  return (
    <Suspense fallback={<div>Yükleniyor...</div>}>
      <PokemonList searchParams={searchParams} />
    </Suspense>
  );
}