export enum AppStep {
  LANDING = 'LANDING',
  STYLE_SELECTION = 'STYLE_SELECTION',
  PSYCH_QUIZ = 'PSYCH_QUIZ',
  GENERATING = 'GENERATING',
  RESULT = 'RESULT',
}

export interface DesignStyle {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: 'Modern' | 'Traditional' | 'Fusion';
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

export interface UserPreferences {
  selectedStyle: DesignStyle | null;
  quizAnswers: Record<number, string>; // questionId -> sentiment
}