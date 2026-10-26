export type Language = 'javascript';
export type AppLanguage = 'en' | 'hi' | 'hinglish';
export type Theme = 'light' | 'dark' | 'midnight' | 'candy' | 'orange' | 'forest' | 'coffee' | 'golden' | 'neon' | 'berry' | 'lemon' | 'cosmic' | 'aqua';
export type LessonType = 'code' | 'quiz' | 'test';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface TestItem {
  id: string;
  type: 'mcq' | 'code';
  question: string;
  options?: string[];
  correctIndex?: number;
  initialCode?: string;
  expectedOutput?: string;
  solutionCode?: string;
  hint?: string;
}

export interface Lesson {
  id: string;
  type: LessonType;
  title: string;
  description: string;
  language: Language;
  order: number;
  chapter: string;
  content: {
    // 1. Concept Explanation
    intro?: string;
    intro_hi?: string;
    intro_hinglish?: string;
    
    // 2. Quick Summary
    summary?: string[]; 
    
    // 3. Mission / Task
    instructions?: string;
    instructions_hi?: string;
    instructions_hinglish?: string;
    
    // 4. Solution & Explanation
    solutionCode?: string;
    codeExplanation?: string;

    // Execution Fields
    initialCode?: string;
    expectedOutput?: string;
    hints?: string[];
    
    // Quiz Lesson Fields
    questions?: QuizQuestion[];

    // Chapter Test Fields
    testItems?: TestItem[];
    passThreshold?: number;
  };
}

export interface TestCase {
  input: string;
  expected: string;
  description?: string;
}

export interface Problem {
  id: string;
  title: string;
  description: string;
  category: 'Fundamentals' | 'Arrays & Objects' | 'Async & Promises' | 'Functions & Closures' | 'Algorithms';
  language: Language;
  difficulty: 'easy' | 'medium' | 'hard';
  instructions: string;
  initialCode: string;
  expectedOutput: string;
  solutionCode: string;
  hints?: string[];
  testCases?: TestCase[];
}

export interface UserState {
  completedLessons: string[];
  completedProblems: string[];
  currentStreak: number;
  lastLoginDate: string | null;
  xp: number;
  badges: string[];
  adminUnlocked: boolean;
  apiKey: string | null;
  lastActiveLanguage?: Language;
  settings: {
    appLanguage: AppLanguage;
    theme: Theme;
  };
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

export interface Translation {
  welcome: string;
  continue: string;
  check: string;
  run: string;
  nextLesson: string;
  reset: string;
  dashboard: string;
  profile: string;
  lessons: string;
  settings: string;
  problems: string;
  playground: string;
  arcade: string;
  aboutDev: string;
  streak: string;
  xp: string;
  developedBy: string;
  loading: string;
  successMsg: string;
  errorMsg: string;
  consoleOutput: string;
  selectLanguage: string;
  selectTheme: string;
  completedTitle: string;
  comingSoon: string;
  locked: string;
  start: string;
  quizTitle: string;
  submitQuiz: string;
  quizPassed: string;
  quizFailed: string;
  back: string;
  translateLesson: string;
  lessonLanguage: string;
  solve: string;
  difficulty: string;
  unlockAll: string;
  unlockMsg: string;
  confirmUnlock: string;
}

export interface AuthUser {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  avatar?: string;
  xp?: number;
  currentStreak?: number;
  lastLoginDate?: string;
  completedLessons?: string[];
  completedProblems?: string[];
  badges?: string[];
  adminUnlocked?: boolean;
  settings?: {
    appLanguage: AppLanguage;
    theme: Theme;
  };
  createdAt?: string;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAtlasConnected?: boolean;
  databaseEngine?: string;
}
