export enum AppStep {
  LANDING = 'LANDING',
  GENDER_SELECTION = 'GENDER_SELECTION',
  STYLE_SELECTION = 'STYLE_SELECTION',
  PSYCH_QUIZ = 'PSYCH_QUIZ',
  GENERATING = 'GENERATING',
  RESULT = 'RESULT',
  HISTORY = 'HISTORY',
}

export type Gender = 'Male' | 'Female';

export interface DesignStyle {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: 'Modern' | 'Traditional' | 'Fusion';
  gender: Gender;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: QuizOption[];
}

export interface QuizOption {
  label: string;
  sentiment: string; // The keyword passed to the AI
}

export interface GeneratedDesign {
  imageUrl: string;
  description: string;
  sentimentAnalysis: string;
}

export interface SavedDesign extends GeneratedDesign {
  id: string;
  timestamp: number;
  styleName: string;
  gender: Gender;
}

export interface UserPreferences {
  gender: Gender | null;
  selectedStyle: DesignStyle | null;
  quizAnswers: Record<number, string>; // questionId -> sentiment
  uploadedImage: string | null; // Base64 string
}