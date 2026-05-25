export type GameType = 'matching' | 'gap-filling' | 'guess-word' | 'drag-drop';

export interface Subject {
  id: string;
  name: string;
  icon: string; // lucide icon name or emoji
  questionsCount: number;
  description: string;
}

export interface Question {
  id: string;
  subjectId: string;
  content: string; // The main clue or sentence or word
  type: GameType;
  options?: string[]; // Multiple choice options (for matching/gap-fill if applicable)
  correctAnswer: string; // The actual correct word/word-pair/letter
  explanation: string; // Explanation of the answer
  difficulty: 'easy' | 'medium' | 'hard';
  clue?: string; // Optional clue
  matchedPairs?: { left: string; right: string }[]; // For matching game type
}

export interface GameSession {
  id: string;
  subjectId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number; // in seconds
  date: string; // ISO string
}

export interface Progress {
  totalAttempts: number;
  averageScore: number;
  streakDays: number;
  weakTopics: string[]; // subject IDs that need focus
  stars: number; // Points / Stars gained
}

export interface Settings {
  theme: 'light' | 'dark';
  soundEnabled: boolean;
  autoSave: boolean;
  aiModel: string;
  customApiKey?: string;
}

export interface AppState {
  subjects: Subject[];
  questions: Question[];
  sessions: GameSession[];
  progress: Progress;
  settings: Settings;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}
