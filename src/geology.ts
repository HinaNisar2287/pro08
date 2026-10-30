
export interface GeologicalProperties {
  id?: string;
  name?: string;
  category?: string;
  formation?: string;
  rock_type?: string;
  age?: string;
  source?: string;
  description?: string;
}

export interface GeologicalFeature {
  type: "Feature";
  geometry: {
    type: string;
    coordinates: unknown;
  } | null;
  properties: GeologicalProperties | null;
}

export interface GeologicalData {
  type: "FeatureCollection";
  features: GeologicalFeature[];
}
