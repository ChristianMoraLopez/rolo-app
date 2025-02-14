// src/components/features/Welcome.tsx
import Link from 'next/link'

export function Welcome() {
  return (
    <section className="px-6 py-16 bg-gradient-to-r from-azulprimary to-azulsecundario rounded-lg mb-8">
      <div className="max-w-3xl mx-auto text-center text-white">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
          Mapa de Sensaciones de Bogotá
        </h1>
        <p className="text-lg sm:text-xl mb-8 text-white/90">
          Comparte y descubre las emociones y sensaciones que despiertan los diferentes lugares de nuestra ciudad. Un espacio para mapear la experiencia colectiva de vivir en Bogotá.
        </p>
        <Link 
          href="/about"
          className="inline-flex px-6 py-3 bg-white/10 backdrop-blur-sm rounded-lg text-white font-medium transition-all duration-300 hover:bg-white/20"
        >
          Conoce más sobre el proyecto
        </Link>
      </div>
    </section>
  );
}