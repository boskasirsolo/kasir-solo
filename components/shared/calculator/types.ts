
export interface CalcOption {
  id: string;
  label: string;
  price: number;
  desc?: string;
  longDesc?: string; 
  founderNote?: string; 
  includes?: string[]; 
  tier?: 'basic' | 'advanced'; // NEW: Untuk pengelompokan UI
}

export interface CalcData {
  title: string;
  subtitle: string;
  baseLabel: string;
  baseOptions: CalcOption[];
  addonLabel: string;
  addons: CalcOption[];
}

export interface CalculatorProps {
  data: CalcData;
  serviceName: string;
}
