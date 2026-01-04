
export type CityType = 'Kandang' | 'Ekspansi';

export interface CityTarget {
  id: number;
  name: string;
  slug: string;
  type: CityType;
  created_at?: string;
}

export interface SEOFormState {
  id: number | null;
  name: string;
  type: CityType;
}

export interface SEOLogicState {
  cities: CityTarget[];
  filteredCities: CityTarget[];
  loading: boolean;
  searchTerm: string;
  form: SEOFormState;
}
