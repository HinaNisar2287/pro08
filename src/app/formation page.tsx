
"use client";

import Link from "next/link";
import { useState } from "react";

const formations = [
  {
    name: "Himalayan Region",
    type: "Mountain Geological Region",
    location: "Northern Pakistan",
    description: "A major mountain belt associated with continental collision."
  },
  {
    name: "Karakoram Region",
    type: "Mountain Geological Region",
    location: "Northern Pakistan",
    description: "A complex geological region containing diverse rock units."
  },
  {
    name: "Balochistan Region",
    type: "Geological Region",
    location: "Southwestern Pakistan",
    description: "A geologically diverse region with sedimentary and tectonic features."
  },
  {
    name: "Indus Basin",
    type: "Sedimentary Basin",
    location: "Eastern and central Pakistan",
    description: "A major sedimentary basin associated with the Indus drainage system."
  }
];

export default function FormationsPage() {
  const [search, setSearch] = useState("");

  const filtered = formations.filter((item) =>
    Object.values(item).some((value) =>
      value.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <main className="min-h-screen bg-[#07111f] px-6 py-10 text-white">

      <Link href="/" className="text-sky-400">
        ← Back Home
      </Link>

      <h1 className="mt-8 text-3xl font-bold">
        Geological Records
      </h1>

      <p className="mt-3 text-slate-400">
        Explore introductory geological region records.
      </p>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search geological records..."
        className="mt-7 w-full rounded-xl border border-slate-700 bg-slate-900 p-4 outline-none focus:border-sky-400"
      />

      <div className="mt-7 grid gap-5 md:grid-cols-2">

        {filtered.map((item) => (
          <div
            key={item.name}
            className="rounded-xl border border-slate-700 bg-slate-900 p-6"
          >
            <h2 className="text-xl font-bold text-sky-400">
              {item.name}
            </h2>

            <p className="mt-3 text-sm text-slate-300">
              {item.type}
            </p>

            <p className="mt-2 text-sm text-slate-400">
              Location: {item.location}
            </p>

            <p className="mt-4 text-sm leading-6 text-slate-400">
              {item.description}
            </p>

            <p className="mt-4 text-xs text-amber-300">
              Introductory record — verify with geological references.
            </p>
          </div>
        ))}

      </div>

      {filtered.length === 0 && (
        <p className="mt-8 text-slate-400">
          No matching records found.
        </p>
      )}
    </main>
  );
}
