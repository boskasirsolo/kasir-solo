
export type CityType = 'Kandang' | 'Ekspansi';

export interface CityTarget {
  id: number;
  name: string;
  slug: string;
  type: CityType;
  narrative?: string; // NEW: Konten spesifik kota
  template_id?: number; // NEW: Link ke master template
  created_at?: string;
}

export interface SEOTemplate {
    id: number;
    title: string;
    prompt_structure: string;
    created_at?: string;
}

export interface SEOFormState {
  id: number | null;
  name: string;
  type: CityType;
  narrative: string;
  template_id: number;
}

export interface AITargetSuggestion {
  name: string;
  slug: string;
  type: CityType;
  reason: string;
}

export interface SEOLogicState {
  cities: CityTarget[];
  templates: SEOTemplate[];
  filteredCities: CityTarget[];
  loading: boolean;
  searchTerm: string;
  form: SEOFormState;
}
