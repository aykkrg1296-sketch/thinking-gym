import { useState, useEffect, useCallback } from 'react';
import type { ModuleId, UserProgress } from '../data/types';

const STORAGE_KEY = 'thinking-gym-progress';

const defaultProgress: UserProgress = {
  modules: {
    'abstraction-ladder': { moduleId: 'abstraction-ladder', completedQuestions: [], insights: [] },
    'essence-catcher': { moduleId: 'essence-catcher', completedQuestions: [], insights: [] },
    'purpose-means': { moduleId: 'purpose-means', completedQuestions: [], insights: [] },
    'verbalization': { moduleId: 'verbalization', completedQuestions: [], insights: [] },
    'decomposition': { moduleId: 'decomposition', completedQuestions: [], insights: [] },
  },
  streak: 0,
  lastTrainingDate: null,
  totalSessions: 0,
};

function loadProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress;
    return JSON.parse(raw);
  } catch {
    return defaultProgress;
  }
}

function saveProgress(progress: UserProgress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

function calculateStreak(lastDate: string | null, currentStreak: number): number {
  if (!lastDate) return 1;
  const today = new Date(getToday());
  const last = new Date(lastDate);
  const diffDays = Math.floor((today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return currentStreak;
  if (diffDays === 1) return currentStreak + 1;
  return 1;
}

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(loadProgress);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const completeQuestion = useCallback((moduleId: ModuleId, questionId: string) => {
    setProgress(prev => {
      const mod = prev.modules[moduleId];
      if (mod.completedQuestions.includes(questionId)) return prev;
      const today = getToday();
      const isNewSession = prev.lastTrainingDate !== today;
      return {
        ...prev,
        modules: {
          ...prev.modules,
          [moduleId]: {
            ...mod,
            completedQuestions: [...mod.completedQuestions, questionId],
          },
        },
        streak: calculateStreak(prev.lastTrainingDate, prev.streak),
        lastTrainingDate: today,
        totalSessions: isNewSession ? prev.totalSessions + 1 : prev.totalSessions,
      };
    });
  }, []);

  const addInsight = useCallback((moduleId: ModuleId, questionId: string, text: string) => {
    if (!text.trim()) return;
    setProgress(prev => {
      const mod = prev.modules[moduleId];
      return {
        ...prev,
        modules: {
          ...prev.modules,
          [moduleId]: {
            ...mod,
            insights: [
              ...mod.insights,
              { questionId, text: text.trim(), date: getToday() },
            ],
          },
        },
      };
    });
  }, []);

  const getModuleProgress = useCallback((moduleId: ModuleId) => {
    return progress.modules[moduleId];
  }, [progress]);

  const getTodayCount = useCallback(() => {
    const today = getToday();
    if (progress.lastTrainingDate !== today) return 0;
    return Object.values(progress.modules).reduce(
      (sum, mod) => sum + mod.completedQuestions.length,
      0
    );
  }, [progress]);

  const getAllInsights = useCallback(() => {
    return Object.values(progress.modules)
      .flatMap(mod => mod.insights)
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [progress]);

  return {
    progress,
    completeQuestion,
    addInsight,
    getModuleProgress,
    getTodayCount,
    getAllInsights,
  };
}
