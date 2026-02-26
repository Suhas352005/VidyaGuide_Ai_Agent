import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type ResumeInsight = {
  atsScore: number;
  summary: string;
  strengths: string[];
  gaps: string[];
  suggestions: string[];
  suggestedSkills: string[];
  parsedText: string;
  analyzedAt: string;
};

export type QuizAttempt = {
  id: string;
  domain: string;
  difficulty: string;
  scorePct: number;
  total: number;
  correct: number;
  incorrect: number;
  weakTopics: string[];
  takenAt: string;
};

export type RoadmapSummary = {
  progressPct: number;
  weakSkills: string[];
  lastUpdatedAt: string | null;
};

export type ActivityEventType = 'resume_analyzed' | 'quiz_completed' | 'roadmap_updated';

export type ActivityEvent = {
  id: string;
  type: ActivityEventType;
  label: string;
  at: string;
};

export type UserDataState = {
  resumeHistory: ResumeInsight[];
  quizHistory: QuizAttempt[];
  roadmap: RoadmapSummary;
  activity: ActivityEvent[];
};

type UserDataContextValue = UserDataState & {
  setResumeInsight: (insight: ResumeInsight) => void;
  recordQuizAttempt: (attempt: QuizAttempt) => void;
  updateRoadmapSummary: (partial: Partial<RoadmapSummary>) => void;
  addGapSkillToRoadmap: (skill: string) => void;
};

const STORAGE_KEY = 'vm_user_data';

const defaultState: UserDataState = {
  resumeHistory: [],
  quizHistory: [],
  roadmap: {
    progressPct: 0,
    weakSkills: [],
    lastUpdatedAt: null
  },
  activity: []
};

const UserDataContext = createContext<UserDataContextValue | undefined>(undefined);

const loadInitialState = (): UserDataState => {
  if (typeof window === 'undefined') return defaultState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as UserDataState;
    return {
      resumeHistory: parsed.resumeHistory ?? [],
      quizHistory: parsed.quizHistory ?? [],
      roadmap: parsed.roadmap ?? defaultState.roadmap,
      activity: parsed.activity ?? []
    };
  } catch {
    return defaultState;
  }
};

export const UserDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<UserDataState>(() => loadInitialState());

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore storage errors in UI
    }
  }, [state]);

  const value = useMemo<UserDataContextValue>(() => {
    const setResumeInsight = (insight: ResumeInsight) => {
      setState((prev) => ({
        ...prev,
        resumeHistory: [...prev.resumeHistory, insight],
        activity: [
          {
            id: `activity-${Date.now()}`,
            type: 'resume_analyzed',
            label: `Resume analyzed (${insight.atsScore}%)`,
            at: insight.analyzedAt
          },
          ...prev.activity
        ].slice(0, 50)
      }));
    };

    const recordQuizAttempt = (attempt: QuizAttempt) => {
      setState((prev) => ({
        ...prev,
        quizHistory: [attempt, ...prev.quizHistory].slice(0, 25),
        activity: [
          {
            id: `activity-${Date.now()}`,
            type: 'quiz_completed',
            label: `Quiz ${attempt.domain} (${attempt.scorePct}%)`,
            at: attempt.takenAt
          },
          ...prev.activity
        ].slice(0, 50)
      }));
    };

    const updateRoadmapSummary = (partial: Partial<RoadmapSummary>) => {
      setState((prev) => {
        const nextRoadmap: RoadmapSummary = {
          ...prev.roadmap,
          ...partial,
          lastUpdatedAt: partial.lastUpdatedAt ?? new Date().toISOString()
        };
        return {
          ...prev,
          roadmap: nextRoadmap,
          activity: [
            {
              id: `activity-${Date.now()}`,
              type: 'roadmap_updated',
              label: `Roadmap progress ${nextRoadmap.progressPct}%`,
              at: nextRoadmap.lastUpdatedAt!
            },
            ...prev.activity
          ].slice(0, 50)
        };
      });
    };

    const addGapSkillToRoadmap = (skill: string) => {
      setState((prev) => {
        // de-duplicate, keep small set
        const existing = new Set(prev.roadmap.weakSkills);
        existing.add(skill);
        const weakSkills = Array.from(existing).slice(0, 20);
        const lastUpdatedAt = new Date().toISOString();
        return {
          ...prev,
          roadmap: {
            ...prev.roadmap,
            weakSkills,
            lastUpdatedAt
          },
          activity: [
            {
              id: `activity-${Date.now()}`,
              type: 'roadmap_updated',
              label: `Added skill gap: ${skill}`,
              at: lastUpdatedAt
            },
            ...prev.activity
          ].slice(0, 50)
        };
      });
    };

    return {
      ...state,
      setResumeInsight,
      recordQuizAttempt,
      updateRoadmapSummary,
      addGapSkillToRoadmap
    };
  }, [state]);

  return <UserDataContext.Provider value={value}>{children}</UserDataContext.Provider>;
};

export const useUserData = (): UserDataContextValue => {
  const ctx = useContext(UserDataContext);
  if (!ctx) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return ctx;
};

