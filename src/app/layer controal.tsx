
"use client";

interface Props {
  layers: {
    regions: boolean;
    formations: boolean;
    faults: boolean;
  };
  onChange: (key: "regions" | "formations" | "faults", value: boolean) => void;
}

export default function LayerControl({ layers, onChange }: Props) {
  const options = [
    { key: "regions" as const, label: "Geological Regions", color: "bg-sky-400" },
    { key: "formations" as const, label: "Rock Formations", color: "bg-violet-400" },
    { key: "faults" as const, label: "Faults & Structures", color: "bg-rose-400" },
  ];

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">
      <h2 className="mb-4 font-bold">Map Layers</h2>

      {options.map((item) => (
        <label key={item.key} className="mb-4 flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={layers[item.key]}
            onChange={(e) => onChange(item.key, e.target.checked)}
            className="h-4 w-4 accent-sky-400"
          />

          <span className={`h-3 w-3 rounded-full ${item.color}`} />

          <span className="text-sm text-slate-300">
            {item.label}
          </span>
        </label>
      ))}
    </div>
  );
}
