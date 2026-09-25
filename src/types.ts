export interface UserInputs {
  fullName: string;
  birthDate: string; // YYYY-MM-DD
  birthTime?: string; // HH:mm
  email?: string;
  phone?: string; // WhatsApp com DDD
}


export interface NumberBreakdown {
  number: number;
  isMaster: boolean;
  name: string;
  archetype: string;
  calculationExplanation: string;
  essence: string;
  strengths: string[];
  challenges: string[];
  prosperityImpact: string;
}

export interface NameOptimization {
  originalName: string;
  currentExpression: number;
  targetExpression: number;
  targetArchetype: string;
  letterToAdd: string;
  letterValue: number;
  suggestedName: string;
  signatureGuideline: string;
  metaphysicalRationale: string;
  practicalActionPlan: string[];
}

export interface EnergyBath {
  title: string;
  category: 'limpeza' | 'prosperidade' | 'aura_luz';
  herbsAndIngredients: string[];
  bestDayAndMoon: string;
  preparationRitual: string;
  prayerOrIntention: string;
  spiritualBenefit: string;
}

export interface SoundFrequency {
  hz: number;
  title: string;
  element: string;
  sacredPurpose: string;
  bestListeningTime: string;
  recommendation: string;
  youtubeUrl?: string;
  youtubeEmbedId?: string;
}

export interface SacredSymbolAndVerse {
  symbolName: string;
  biblicalReference: string;
  scriptureText: string;
  spiritualMeaning: string;
  applicationGuidance: string;
}

export interface ProsperityDiagnosis {
  score: number; // 0 to 100
  archetype: string;
  archetypeDescription: string;
  financialBlocks: string[];
  abundancePotential: string;
  monetizationSuperpowers: string[];
  sacredCodes: {
    code: string;
    purpose: string;
    mantra: string;
  }[];
  moneyMindsetGuidance: string;
}

export interface PersonalYearInfo {
  yearNumber: number;
  calendarYear: number;
  theme: string;
  forecast: string;
  quarterlyFocus: {
    period: string;
    focus: string;
  }[];
  luckyDays: string[];
  powerHours: string;
}

export interface AuraReading {
  captured: boolean;
  capturedWithCamera: boolean;
  capturedImageUrl?: string;
  primaryColorName: string;
  colorHex: string;
  accentHex: string;
  secondaryColorName: string;
  secondaryHex: string;
  fieldExpansion: string;
  frequencyHz: string;
  vibrationalState: string;
  auraArchetype: string;
  freeTastingSummary: string;
  deepAnalysis: string;
  prosperityCorrelation: string;
  shieldingProtocol: string;
  recommendedCrystals: string[];
  clothingHarmonization: string;
}

export interface SemesterLuckyNumbers {
  semesterLabel: string; // e.g., "2º Semestre de 2026"
  numbers: number[]; // 6 distinct numbers between 1 and 60
  formattedNumbers: string[]; // ['07', '14', '23', '38', '45', '52']
  metaphysicalPurpose: string;
  activationMantra: string;
  bestDays: string[];
}

export interface NumerologyReport {
  user: {
    fullName: string;
    birthDate: string;
    birthTime?: string;
    formattedDate: string;
    email?: string;
    phone?: string;
  };
  generatedAt: string;
  referralId: string;
  lifePath: NumberBreakdown;
  expression: NumberBreakdown;
  soulUrge: NumberBreakdown;
  personality: NumberBreakdown;
  prosperity: ProsperityDiagnosis;
  personalYear: PersonalYearInfo;
  nameOptimization: NameOptimization;
  semesterLuckyNumbers: SemesterLuckyNumbers;
  energyBaths: EnergyBath[];
  soundFrequencies: SoundFrequency[];
  sacredSymbolsAndVerses: SacredSymbolAndVerse[];
  aura?: AuraReading;
}

export type AppStep = 'form' | 'preview' | 'full_report';

export type PaymentStatus = 'pago' | 'pendente';

export interface AdminOrderRecord {
  id: string; // unique referralId or record ID
  clientName: string;
  birthDate: string;
  email?: string;
  phone?: string;
  pdfEmissionDate: string; // Date and time when the PDF was emitted/requested
  paymentStatus: PaymentStatus;
  amount: number;
  pixTxId?: string;
  report?: NumerologyReport;
  createdAt: string;
  updatedAt: string;
}

