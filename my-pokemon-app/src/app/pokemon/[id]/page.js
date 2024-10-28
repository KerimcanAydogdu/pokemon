import Link from 'next/link';
import { notFound } from 'next/navigation';

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
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 brightness-50"
      >
        <source src="/pokeball.mp4" type="video/mp4" />
        Tarayıcınız bu videoyu desteklemiyor.
      </video>

      <section className="relative z-10 p-10 max-w-6xl mx-auto mt-52">
        <div className="flex items-center justify-between bg-white bg-opacity-20 p-4 rounded-md backdrop-blur-md">
          <h1 className="text-4xl text-white capitalize tracking-wide">
            {pokemon.name} <span className="text-gray-400">#{pokemon.id.toString().padStart(3, '0')}</span>
          </h1>
          <button className="inline-block px-6 py-3 btn">
  <Link href={`/pokemon/${pokemon.id}/evolutions`}>Evrimleri Gör</Link>
</button>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 p-10 rounded-lg">
          <div className="relative">
            <div className={`rounded-full w-80 h-80 mx-auto flex items-center justify-center bg-opacity-60 ${backgroundColor}`}>
              <img
                src={pokemon.sprites.other["official-artwork"].front_default}
                alt={pokemon.name}
                className="w-56 h-56 object-contain"
              />
            </div>
            <div className="flex gap-2 justify-center mt-5">
              {pokemon.types.map(type => (
                <span
                  key={type.type.name}
                  className={`inline-block px-2 py-1 rounded-lg text-white ${typeColors[type.type.name]}`}
                >
                  {type.type.name}
                </span>
              ))}
            </div>

            <div className="space-y-1 mt-5">
              {['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'].map((stat, index) => (
                <div key={index} className="flex items-center">
                  <span className="text-gray-100 text-lg capitalize">{stat.replace('-', ' ')}</span>
                  <div className="ml-4 w-72 bg-gray-300 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-pink-400 h-full"
                      style={{ width: `${pokemon.stats[index].base_stat}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 text-gray-100">{pokemon.stats[index].base_stat}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-10 space-y-4">
            <div className={`bg-opacity-35 p-6 rounded-md backdrop-blur-md ${backgroundColor}`}>
              <h2 className="text-xl font-bold mb-5 bg-opacity-40 p-1 bg-black rounded-full text-white">Pokemonu Tanıyalım</h2>
              <p className="text-gray-200">{species.flavor_text_entries[0].flavor_text}</p>
            </div>

            <div className={`bg-opacity-35 p-6 rounded-md backdrop-blur-md ${backgroundColor}`}>
              <h2 className="text-xl font-bold mb-5 bg-opacity-40 p-1 bg-black rounded-full text-white">Yetenekleri</h2>
              <ul className="text-gray-200">
                {pokemon.abilities.map((ability) => (
                  <li key={ability.ability.name} className="capitalize">{ability.ability.name}</li>
                ))}
              </ul>
            </div>

            <div className={`bg-opacity-35 p-6 rounded-md backdrop-blur-md ${backgroundColor}`}>
              <h2 className="text-xl font-bold mb-5 bg-opacity-40 p-1 bg-black rounded-full text-white">Diğer Bilgiler</h2>
              <p className="text-gray-200">Boyu: {pokemon.height / 10} m</p>
              <p className="text-gray-200">Ağırlık: {pokemon.weight / 10} kg</p>
              <p className="text-gray-200">Tecrübesi: {pokemon.base_experience}</p>
            </div>
          </div>
        </div>
        <div className="text-center mt-10">
          <Link href="/pokemon" className="inline-block px-6 py-3 btn">
            Listeye Geri Dön
          </Link>
        </div>
      </section>
    </div>
  );
}
