"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Image from "next/image";

const ITEMS_PER_PAGE = 24;
const TOTAL_POKEMON = 1000;

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
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=0&limit=1000`);
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
  const totalPages = Math.ceil(TOTAL_POKEMON / ITEMS_PER_PAGE);

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

  const getPageNumbers = (currentPage, totalPages) => {
    const pageNumbers = [];
    const range = 2; // Aralık (örneğin, 1, 5, 12, 25... şeklinde)
    
    // İlk sayfayı ekle
    pageNumbers.push(1);

    // Önceki sayfa numaralarını ekle
    for (let i = currentPage - range; i <= currentPage + range; i++) {
      if (i > 1 && i < totalPages && !pageNumbers.includes(i)) {
        pageNumbers.push(i);
      }
    }

    // Son sayfayı ekle
    if (!pageNumbers.includes(totalPages)) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers(page, totalPages);

  const calculatecolors = (stats) => {
    const values = Object.values(stats);
    const total = values.reduce((acc, stat) => acc + stat, 0);
    return Math.round(total / values.length);
  };

  const getStatColor = (color) => {
    if (color < 41) {
      return "bg-gradient-to-br from-slate-950 via-gray-500 to-slate-900 "; // gri
    } else if (color < 56) {
      return "bg-gradient-to-br from-emerald-950 via-green-700 to-lime-950 "; // yeşil
    } else if (color < 71) {
      return "bg-gradient-to-br from-indigo-950 via-blue-900 to-slate-950 "; // mavi
    } else if (color < 81) {
      return "bg-gradient-to-br from-slate-900 via-purple-800 to-pink-900 "; // kırmızı (daha canlı renkler)
    } else if (color < 86) {
      return "bg-gradient-to-br from-slate-950 via-rose-600 to-blue-950 "; // mor (daha zengin tonlar)
    } else if (color < 100) {
      return "bg-gradient-to-br from-fuchsia-900 via-pink-600 to-yellow-600 "; // ihtişamlı renk geçişi (canlı ve dikkat çekici)
    }
     else if (color == 100) {
      return "bg-gradient-to-br from-red-900 via-yellow-500 to-rose-900 ";
    }
    else if (color > 100) {
      return "bg-rainbow";
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
    <div className="relative pt-12 overflow-hidden min-h-screen">
      <Image src="/a.jpeg" alt="Pokémon Logo" width={1000} height={96} className="absolute inset-0 w-full h-full object-cover z-0 brightness-50 blur-sm" />

      <section className="relative p-12 z-10 pb-3 md:p-20 text-center  text-white mt-52 md:mt-32">
        {loading && (
          <div className="flex justify-center items-center h-screen">
            <img src="/loader.gif" alt="Yükleniyor..." className="w-40 h-40" />
          </div>
        )}

        {pokemonList.length === 2 && !loading && (
          <div className="flex flex-col items-center">
            <p className="text-5xl m-80 text-red-400">Pokémon bulunamadı.</p>
          </div>
        )}

<div className="grid grid-cols-1 2xl:grid-cols-6 lg:grid-cols-3 sm:grid-cols-2 gap-10">
  {sortedPokemon.slice(offset, offset + ITEMS_PER_PAGE).map((pokemon, index) => {
    const averageStat = calculatecolors(pokemon.stats);
    const statColor = getStatColor(averageStat);
    return (
      <div key={index} className="relative hover:scale-105 active:scale-95 rounded-3xl transition-all border-2 border-white" >
        <Link href={`/pokemon/${pokemon.url.split("/")[6]}`}>
          <div className={`${statColor} rounded-3xl shadow-2xl p-4`}>
            <div className="flex justify-between items-start">
              <div className="flex flex-col mr-2 items-center">
                <div className="w-9 h-9 rounded-full bg-zinc-700 flex justify-center items-center text-white font-semibold">
                  {averageStat}
                </div>
                <div className="mt-2 flex flex-col">
                  {pokemon.types.map((type, index) => (
                    <div key={index} className="flex flex-col items-center mt-1">
                      <Image className="w-8 h-8" src={typeImages[type] || "/default.png"} width={40} height={40} alt={type} />
                      <span className="text-white text-sm">{type}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pokémon Resmi */}
              <div className="flex-auto flex justify-center items-center">
                <Image
                  className="w-44 h-44"
                  src={pokemon.image}
                  width={250}
                  height={200}
                  alt={pokemon.name}
                />
              </div>
            </div>

            {/* Pokémon İsmi */}
            <h2 className="text-base font-bold text-white mt-4 text-center">{pokemon.name}</h2>
            <hr className="custom-hr-x" />
            
            {/* Statlar Kısmı */}
            <div className="flex gap-2 mb-2">
       <div className="text-white w-full">
         <ul className="space-y-1 mx-2">
         <li className="flex justify-between">
             <span>ATK:</span>
             <span>{pokemon.stats.attack}</span>
           </li>
           <li className="flex justify-between">
             <span>DEF:</span>
             <span>{pokemon.stats.defense}</span>
           </li>
           <li className="flex justify-between">
             <span>SPD:</span>
             <span>{pokemon.stats.speed}</span>
           </li>
         </ul>
       </div>
  <div class="custom-hr-y ml-2"></div>
  <div className="text-white w-full pl-1">
    <ul className="space-y-1 mx-2">
      <li className="flex justify-between">
        <span>HP:</span>
        <span>{pokemon.stats.hp}</span>
      </li>
      <li className="flex justify-between">
        <span>SD:</span>
        <span>{pokemon.stats["special-defense"]}</span>
      </li>
      <li className="flex justify-between">
        <span>SA:</span>
        <span>{pokemon.stats["special-attack"]}</span>
      </li>
    </ul>
  </div>
</div>

          </div>
        </Link>
      </div>
    );
  })}
</div>


{!loading && pokemonList.length > 0 && (
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
