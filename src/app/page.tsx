
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <nav className="flex items-center justify-between border-b border-slate-700 p-6">
        <h1 className="text-xl font-bold">
          Pakistan <span className="text-sky-400">Geological Atlas</span>
        </h1>
        <Link href="/map" className="text-sky-400">
          Explore Map →
        </Link>
      </nav>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <p className="mb-4 text-sm tracking-widest text-sky-400">
          GEOSPATIAL EXPLORATION PLATFORM
        </p>

        <h2 className="max-w-4xl text-5xl font-bold leading-tight md:text-7xl">
          Explore the Geological
          <span className="text-sky-400"> Landscape of Pakistan</span>
        </h2>

        <p className="mt-6 max-w-2xl text-lg text-slate-400">
          Discover geological regions, rock formations,
          tectonic structures and geographic information
          through an interactive mapping platform.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/map"
            className="rounded-xl bg-sky-400 px-7 py-4 font-semibold text-slate-950"
          >
            Open Geological Map
          </Link>

          <Link
            href="/formations"
            className="rounded-xl border border-slate-600 px-7 py-4"
          >
            Explore Formations
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-6 pb-20 md:grid-cols-3">
        {[
          ["Geological Regions", "Explore geographic and geological regions."],
          ["Rock Formations", "Study rock types and geological records."],
          ["Tectonic Structures", "Explore faults and structural features."],
        ].map(([title, description]) => (
          <div
            key={title}
            className="rounded-2xl border border-slate-700 bg-slate-900 p-6"
          >
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="mt-3 text-sm text-slate-400">
              {description}
            </p>
          </div>
        ))}
      </section>
    </main>
  );
}
