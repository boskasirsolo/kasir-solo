
export interface CalcOption {
  id: string;
  label: string;
  price: number;
  desc?: string;
  longDesc?: string; 
  founderNote?: string; // Teks pesan pribadi founder (Amin)
  includes?: string[]; // Item standar yang didapatkan (Baru)
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
