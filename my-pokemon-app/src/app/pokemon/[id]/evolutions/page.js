import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';

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
  dark: 'bg-gray-700',
};

async function getEvolutions(id) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`, {
    cache: 'force-cache',
  });

  if (!res.ok) {
    notFound();
  }

  return res.json();
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

const renderEvolutions = (chain, mainType, types) => {
  const pokemonId = chain.species.url.split('/').slice(-2, -1)[0];
  const backgroundColor = typeColors[mainType] || 'bg-gray-500';

  return (
    <div
      key={chain.species.name}
      className={`${backgroundColor} bg-opacity-40 rounded-2xl shadow-lg p-10 xl:p-14 md:p-12 flex flex-col items-center text-gray-300 transition-transform duration-200 hover:scale-105 m-8`}
    >
      <h2 className="text-xl font-bold mb-2 text-center capitalize">
        {chain.species.name}
      </h2>
      <Link href={`/pokemon/${pokemonId}`}>
        <img
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`}
          alt={chain.species.name}
          width={160}
          height={160}
          className="w-40 h-40 object-contain"
        />
      </Link>
      <div className="flex space-x-2 mt-2">
        {types.map((type) => (
          <Image
            key={type}
            src={`/${type}.png`}
            alt={type}
            width={160}
            height={160}
            className="w-10 h-10"
          />
        ))}
      </div>
    </div>
  );
};

const renderFullEvolutionChain = (chain) => {
  const evolutions = [chain];

  if (chain.evolves_to) {
    for (const evolution of chain.evolves_to) {
      evolutions.push(...renderFullEvolutionChain(evolution));
    }
  }

  return evolutions;
};

export default async function EvolutionPage({ params }) {
  const { id } = params;
  const species = await getEvolutions(id);
  const pokemonDetails = await getPokemonDetails(id);
  const mainType = pokemonDetails.types[0].type.name;
  const backgroundColor = typeColors[mainType] || 'bg-gray-500';

  const evolutionChainUrl = species.evolution_chain.url;
  const evolutionChainResponse = await fetch(evolutionChainUrl);
  const evolutionChain = await evolutionChainResponse.json();

  const evolutionCards = renderFullEvolutionChain(evolutionChain.chain);

  return (
    <div className="relative overflow-hidden">
      <Image
        src="/a.jpeg"
        alt="Pokémon Logo"
        width={1000}
        height={96}
        className="absolute inset-0 w-full h-full object-cover z-0 brightness-50 blur-sm"
      />

      <section className="relative z-10 p-10 max-w-6xl mx-auto mt-52">
        <h1 className="text-4xl text-white font-bold text-center mb-10">Evrim Zinciri</h1>
        <div className="flex flex-wrap justify-center">
          {evolutionCards.map((chain) =>
            renderEvolutions(chain, mainType, pokemonDetails.types.map(type => type.type.name))
          )}
        </div>
        <div className="text-center mt-10 space-y-4">
          <div className={`bg-opacity-20 p-8 rounded-md backdrop-blur-md ${backgroundColor}`}>
            <h2 className="text-xl font-bold mb-5 bg-opacity-40 p-1 bg-black rounded-full text-white">Pokémon'u Tanıyalım</h2>
            <p className="text-gray-200">{species.flavor_text_entries[0].flavor_text}</p>
          </div>
        </div>
        <div className="text-center mt-32">
          <Link href={`/pokemon/${id}`} className="inline-block px-6 py-3 btn">
            Pokémon&apos;a Geri Dön
          </Link>
        </div>
      </section>
    </div>
  );
}
