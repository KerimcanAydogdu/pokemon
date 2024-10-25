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

export async function generateStaticParams() {
  const res = await fetch('https://pokeapi.co/api/v2/pokemon');
  const data = await res.json();
  const count = data.count;
  const ids = Array.from({ length: count }, (_, i) => (i + 1).toString());
  return ids.map((id) => ({ id }));
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
        <div className="text-center mb-10">
          <h1 className="text-6xl text-white capitalize tracking-wide">
            {pokemon.name} <span className="text-gray-400">#{pokemon.id}</span>
          </h1>
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-10 ${backgroundColor} bg-opacity-55 backdrop-brightness-200 p-6 rounded-lg`}>
          <img
            src={pokemon.sprites.front_default}
            alt={pokemon.name}
            className="w-full h-auto object-contain bg-gray-200 bg-opacity-85 rounded-2xl shadow-md"
          />

          <div className="space-y-4 text-center lg:text-start">
            <p className="text-gray-900 text-2xl">
              <strong className="block text-gray-100">Yüksekliği:</strong> {pokemon.height / 10} m
            </p>
            <p className="text-gray-900 text-2xl">
              <strong className="block text-gray-100">Ağırlığı:</strong> {pokemon.weight / 10} kg
            </p>
            <p className="text-gray-900 text-2xl">
              <strong className="block text-gray-100">Yetenekleri:</strong> {pokemon.abilities.map(ability => ability.ability.name).join(', ')}
            </p>
            <div className="space-y-2">
              <strong className="block text-gray-100 text-2xl">Türü:</strong>
              {pokemon.types.map(type => (
                <span
                  key={type.type.name}
                  className={`inline-block mx-1 px-3 py-1 rounded-lg text-xl text-white ${typeColors[type.type.name] || 'bg-gray-500'}`}
                >
                  {type.type.name}
                </span>
              ))}
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
