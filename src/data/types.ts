export type ModuleId =
  | 'abstraction-ladder'
  | 'essence-catcher'
  | 'purpose-means'
  | 'verbalization'
  | 'decomposition';

export interface ModuleInfo {
  id: ModuleId;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
}

// 抽象化ラダー
export interface LadderQuestion {
  id: string;
  direction: 'up' | 'down';
  start: string;
  steps: number;
  hints: string[];
  sampleAnswer: string[];
  explanation: string;
}

// 本質キャッチ
export interface EssenceQuestion {
  id: string;
  examples: string[];
  surfaceAnswer: string;
  essenceAnswer: string;
  hints: string[];
  explanation: string;
}

// 目的⇔手段
export interface PurposeMeansQuestion {
  id: string;
  statement: string;
  whyChain: string[];
  betterMeans: string;
  hints: string[];
  explanation: string;
}

// 言語化チャレンジ
export interface VerbalizationQuestion {
  id: string;
  concept: string;
  audience: string;
  badExample: string;
  goodExample: string;
  checkpoints: string[];
  explanation: string;
}

// 分解ドリル
export interface DecompositionQuestion {
  id: string;
  subject: string;
  components: string[];
  relationships: string;
  leverPoint: string;
  hints: string[];
  explanation: string;
}

export type Question =
  | LadderQuestion
  | EssenceQuestion
  | PurposeMeansQuestion
  | VerbalizationQuestion
  | DecompositionQuestion;

// 進捗
export interface ModuleProgress {
  moduleId: ModuleId;
  completedQuestions: string[];
  insights: { questionId: string; text: string; date: string }[];
}

export interface UserProgress {
  modules: Record<ModuleId, ModuleProgress>;
  streak: number;
  lastTrainingDate: string | null;
  totalSessions: number;
}
