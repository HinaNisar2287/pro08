
"use client";

export default function FeatureDetails({
  feature,
}: {
  feature: object | null;
}) {
  if (!feature) {
    return (
      <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">
        <h2 className="font-bold">Feature Details</h2>
        <p className="mt-3 text-sm text-slate-400">
          Click any geological feature on the map to see its information.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">
      <h2 className="mb-4 font-bold text-sky-400">
        Geological Information
      </h2>

      {Object.entries(feature).map(([key, value]) => (
        <div key={key} className="mb-3 border-b border-slate-800 pb-2">
          <p className="text-xs uppercase text-slate-500">
            {key.replaceAll("_", " ")}
          </p>
          <p className="mt-1 break-words text-sm text-slate-200">
            {String(value ?? "Not available")}
          </p>
        </div>
      ))}
    </div>
  );
}
