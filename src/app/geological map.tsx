
"use client";

import { useEffect, useRef, useState } from "react";
type GeologicalProperties = Record<string, unknown>;

interface Props {
  regions: boolean;
  formations: boolean;
  faults: boolean;
  onSelect: (properties: GeologicalProperties) => void;
}

export default function GeologicalMap({
  regions,
  formations,
  faults,
  onSelect,
}: Props) {
  const [data, setData] = useState<Record<string, any>>({});
  const [zoom, setZoom] = useState(5);
  const [center, setCenter] = useState<[number, number]>([29.5, 69.3]);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const mapRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ x: number; y: number; center: [number, number] } | null>(null);

  useEffect(() => {
    const element = mapRef.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      setSize({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    async function loadData() {
      const names = ["regions", "formations", "faults"];

      const results = await Promise.all(
        names.map(async (name) => {
          const response = await fetch(`/data/${name}.geojson`);

          if (!response.ok) {
            throw new Error(`Could not load ${name}`);
          }

          return [name, await response.json()] as const;
        })
      );

      setData(Object.fromEntries(results));
    }

    loadData().catch(console.error);
  }, []);

  const layerColors: Record<string, string> = {
    regions: "#0ea5e9",
    formations: "#a78bfa",
    faults: "#f43f5e",
  };

  const enabled = { regions, formations, faults };
  const tileSize = 256;
  const worldSize = tileSize * 2 ** zoom;
  const project = (latitude: number, longitude: number) => {
    const lat = Math.max(-85.0511, Math.min(85.0511, latitude));
    const sin = Math.sin((lat * Math.PI) / 180);
    return {
      x: ((longitude + 180) / 360) * worldSize,
      y: (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * worldSize,
    };
  };
  const centerPoint = project(center[0], center[1]);
  const toScreen = (coordinate: number[]) => {
    const point = project(coordinate[1], coordinate[0]);
    return `${point.x - centerPoint.x + size.width / 2},${point.y - centerPoint.y + size.height / 2}`;
  };
  const tileX = Math.floor(centerPoint.x / tileSize);
  const tileY = Math.floor(centerPoint.y / tileSize);
  const radius = Math.ceil(Math.max(size.width, size.height) / tileSize / 2) + 1;
  const tiles = [];
  for (let x = tileX - radius; x <= tileX + radius; x++) {
    for (let y = tileY - radius; y <= tileY + radius; y++) {
      const max = 2 ** zoom;
      if (y < 0 || y >= max) continue;
      const wrappedX = ((x % max) + max) % max;
      tiles.push(
        <img
          key={`${zoom}-${x}-${y}`}
          alt=""
          draggable={false}
          src={`https://tile.openstreetmap.org/${zoom}/${wrappedX}/${y}.png`}
          style={{
            position: "absolute",
            width: tileSize,
            height: tileSize,
            left: x * tileSize - centerPoint.x + size.width / 2,
            top: y * tileSize - centerPoint.y + size.height / 2,
          }}
        />
      );
    }
  }

  const geometryPath = (geometry: any): string => {
    if (!geometry) return "";
    const line = (coordinates: number[][], close = false) =>
      coordinates.map((point, index) => `${index ? "L" : "M"}${toScreen(point)}`).join(" ") + (close ? " Z" : "");
    switch (geometry.type) {
      case "LineString": return line(geometry.coordinates);
      case "MultiLineString": return geometry.coordinates.map((part: number[][]) => line(part)).join(" ");
      case "Polygon": return geometry.coordinates.map((ring: number[][]) => line(ring, true)).join(" ");
      case "MultiPolygon": return geometry.coordinates.flatMap((polygon: number[][][]) => polygon.map((ring) => line(ring, true))).join(" ");
      default: return "";
    }
  };

  return (
    <div
      ref={mapRef}
      role="application"
      aria-label="Geological map"
      style={{ height: "100%", width: "100%", overflow: "hidden", position: "relative", cursor: "grab", touchAction: "none" }}
      onWheel={(event) => {
        event.preventDefault();
        setZoom((current) => Math.max(4, Math.min(18, current + (event.deltaY < 0 ? 1 : -1))));
      }}
      onPointerDown={(event) => {
        dragRef.current = { x: event.clientX, y: event.clientY, center };
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        if (!dragRef.current) return;
        const origin = project(dragRef.current.center[0], dragRef.current.center[1]);
        const x = origin.x - (event.clientX - dragRef.current.x);
        const y = origin.y - (event.clientY - dragRef.current.y);
        const longitude = (x / worldSize) * 360 - 180;
        const n = Math.PI - (2 * Math.PI * y) / worldSize;
        const latitude = (180 / Math.PI) * Math.atan(Math.sinh(n));
        setCenter([latitude, longitude]);
      }}
      onPointerUp={() => { dragRef.current = null; }}
    >
      {tiles}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}>
        {Object.entries(enabled).map(([name, visible]) => {
          if (!visible || !data[name]) return null;
          const features = data[name].type === "FeatureCollection" ? data[name].features : [data[name]];
          return features.map((feature: any, index: number) => {
            const properties = feature.properties as GeologicalProperties;
            const geometry = feature.geometry;
            const fill = geometry?.type === "Polygon" || geometry?.type === "MultiPolygon";
            const handleClick = () => onSelect(properties);
            if (geometry?.type === "Point") {
              const point = project(geometry.coordinates[1], geometry.coordinates[0]);
              return <circle key={`${name}-${index}`} cx={point.x - centerPoint.x + size.width / 2} cy={point.y - centerPoint.y + size.height / 2} r={6} fill={layerColors[name]} stroke="white" strokeWidth={2} onClick={handleClick} style={{ cursor: "pointer" }} />;
            }
            return (
              <path
                key={`${name}-${index}`}
                d={geometryPath(geometry)}
                fill={fill ? layerColors[name] : "none"}
                fillOpacity={fill ? 0.2 : 0}
                stroke={layerColors[name]}
                strokeWidth={name === "faults" ? 3 : 2}
                onClick={handleClick}
                style={{ cursor: "pointer", pointerEvents: "visiblePainted" }}
              />
            );
          });
        })}
      </svg>

      <div style={{ position: "absolute", bottom: 4, left: 4, fontSize: 11, background: "rgba(255,255,255,.8)", padding: "2px 4px" }}>
        &copy; OpenStreetMap contributors
      </div>
    </div>
  );
}
