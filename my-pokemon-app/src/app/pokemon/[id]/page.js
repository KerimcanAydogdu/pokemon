import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  const { id } = params;
  const pokemon = await getPokemonDetails(id);

  return {
    title: `${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}`,
  };
}

async function getPokemonDetails(id) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`, {
    cache: 'force-cache',
  });

  if (!res.ok) {
    notFound();
  }

  return res.json();  
}

async function getPokemonSpecies(id) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`, {
    cache: 'force-cache',
  });

  if (!res.ok) {
    notFound();
  }

  return res.json();
}

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

const typeColors = {
  grass: 'bg-green-500',
  poison: 'bg-purple-500',
  fire: 'bg-red-500',
  water: 'bg-blue-500',
  flying: 'bg-blue-200',
  bug: 'bg-lime-500',
  normal: 'bg-gray-400',
  electric: 'bg-yellow-500',
  ground: 'bg-yellow-700',
  fairy: 'bg-pink-500',
  fighting: 'bg-red-700',
  psychic: 'bg-pink-600',
  rock: 'bg-yellow-600',
  ghost: 'bg-purple-700',
  ice: 'bg-blue-300',
  dragon: 'bg-indigo-700',
  steel: 'bg-gray-500',
  dark: 'bg-gray-700'
};

export default async function PokemonDetailPage({ params }) {
  const { id } = params;
  const pokemon = await getPokemonDetails(id);
  const species = await getPokemonSpecies(id);
  const mainType = pokemon.types[0].type.name;
  const backgroundColor = typeColors[mainType] || 'bg-gray-500';

  return (
    <div className="relative w-full h-full overflow-hidden">
      <Image src="/a.jpeg" alt="Pokémon Logo" 
      width={1000}
      height={96} 
      className="absolute inset-0 w-full h-full object-cover z-0 brightness-50 blur-sm " />

      <section className="relative z-10 p-2 max-w-7xl  mx-auto mt-52">
        <div className="flex items-center justify-between bg-white bg-opacity-30 p-4 rounded-md backdrop-blur-md">
          <h1 className="text-4xl text-white capitalize tracking-wide">
            {pokemon.name} <span className="text-gray-800">#{pokemon.id.toString().padStart(3, '0')}</span>
          </h1>
          <Link href={`/pokemon/${pokemon.id}/evolutions`} className="inline-block px-6 py-3 btn text-center">
            Evrimleri Gör
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 p-10 rounded-lg">
          <div className="relative">
            <div className={`rounded-full w-64 h-64 xl:w-96 xl:h-96 mx-auto flex items-center justify-center bg-opacity-60 ${backgroundColor}`}>
              <img
                src={pokemon.sprites.other["official-artwork"].front_default}
                alt={pokemon.name}
                className="w-60 h-60 object-contain"
              />
            </div>
            <div className="flex gap-2 justify-center mt-5">
              {pokemon.types.map(type => (
                <div key={type.type.name} className="flex flex-col items-center">
                  <Image 
                    src={typeImages[type.type.name] || "/default.png"} 
                    alt={type.type.name} 
                    width={50} 
                    height={50} 
                  />
                  <span
                    className={`inline-block px-3 py-2 text-xl font-bold rounded-lg text-white`}
                  >
                    {type.type.name}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-1 mt-5">
              {['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'].map((stat, index) => (
                <div key={index} className="flex items-center justify-center">
                  <span className="text-gray-100 text-lg capitalize w-36 ">{stat.replace('-',' ')}</span>
                  <div className="w-60 bg-gray-300 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-3 bg-pink-500"
                      style={{ width: `${pokemon.stats[index].base_stat}%` }}
                    ></div>
                  </div>
                  <span className="ml-5 text-gray-100">{pokemon.stats[index].base_stat}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-10 space-y-5">
            <div className={`bg-opacity-35 p-6 xl:p-10 rounded-md backdrop-blur-md ${backgroundColor}`}>
              <h2 className="text-2xl font-bold mb-5 bg-opacity-40 p-1 bg-black rounded-full text-white">Pokemonu Tanıyalım</h2>
              <p className="text-gray-200 text-start">{species.flavor_text_entries[0].flavor_text}</p>
            </div>

            <div className={`bg-opacity-35 p-6 xl:p-10 rounded-md backdrop-blur-md ${backgroundColor}`}>
              <h2 className="text-xl font-bold mb-5 bg-opacity-40 p-1 bg-black rounded-full text-white">Yetenekleri</h2>
              <ul className="text-gray-200">
                {pokemon.abilities.map((ability) => (
                  <li key={ability.ability.name} className="capitalize">{ability.ability.name}</li>
                ))}
              </ul>
            </div>

            <div className={`bg-opacity-35 p-6 xl:p-10 rounded-md backdrop-blur-md ${backgroundColor}`}>
              <h2 className="text-xl font-bold mb-5 bg-opacity-40 p-1 bg-black rounded-full text-white">Diğer Bilgiler</h2>
              <p className="text-gray-200">Boyu: {pokemon.height / 10} m</p>
              <p className="text-gray-200">Ağırlık: {pokemon.weight / 10} kg</p>
              <p className="text-gray-200">Tecrübesi: {pokemon.base_experience}</p>
            </div>
          </div>
        </div>
        <div className="text-center mt-10 mb-5">
          <Link href="/pokemon" className="inline-block px-6 py-3 btn">
            Listeye Geri Dön
          </Link>
        </div>
      </section>
    </div>
  );
}
