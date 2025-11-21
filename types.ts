export interface PlantCare {
  light: string;
  water: string;
  soil: string;
  toxicity: string;
}

export interface PlantInfo {
  commonName: string;
  scientificName: string;
  description: string;
  care: PlantCare;
  funFact: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  RESULTS = 'RESULTS',
  ERROR = 'ERROR'
}