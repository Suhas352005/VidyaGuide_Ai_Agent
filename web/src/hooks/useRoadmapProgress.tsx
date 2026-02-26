import { useEffect, useMemo, useState } from 'react';
import { useUserData } from './useUserData';

export type Role = 'frontend' | 'backend' | 'fullstack';
export type Level = 'beginner' | 'intermediate' | 'advanced';

export type RoadmapStep = {
  id: string;
  label: string;
  description: string;
};

export type PhaseId = 'fundamentals' | 'core' | 'projects' | 'interview';

export type RoadmapPhase = {
  id: PhaseId;
  title: string;
  steps: RoadmapStep[];
};

const STORAGE_KEY_PREFIX = 'vm_roadmap_';

const buildRoadmap = (role: Role, level: Level): RoadmapPhase[] => {
  const suffix = role === 'frontend' ? 'UI' : role === 'backend' ? 'API' : 'end‑to‑end';

  const difficultyTag =
    level === 'beginner' ? 'Start here' : level === 'intermediate' ? 'Level up' : 'Deep dive';

  return [
    {
      id: 'fundamentals',
      title: `Phase 1 · Fundamentals (${difficultyTag})`,
      steps: [
        {
          id: 'fundamentals-language',
          label: 'Language essentials',
          description:
            role === 'backend'
              ? 'Consolidate TypeScript + Node.js primitives and async patterns.'
              : 'Solidify modern JavaScript + TypeScript and browser APIs.'
        },
        {
          id: 'fundamentals-git',
          label: 'Git & environments',
          description:
            'Work with feature branches, clean commits and .env‑driven configuration per environment.'
        }
      ]
    },
    {
      id: 'core',
      title: `Phase 2 · Core ${suffix} skills`,
      steps: [
        {
          id: 'core-framework',
          label: role === 'backend' ? 'FastAPI / API design' : 'React 18 patterns',
          description:
            role === 'backend'
              ? 'Design typed REST endpoints, request validation and error envelopes.'
              : 'Learn hooks, composition, suspense and error boundaries with strict TypeScript.'
        },
        {
          id: 'core-data',
          label: 'Data & state',
          description:
            'Practice data‑fetching, caching and local state orchestration with clear typing.'
        }
      ]
    },
    {
      id: 'projects',
      title: 'Phase 3 · Portfolio projects',
      steps: [
        {
          id: 'projects-main',
          label: 'Flagship project',
          description:
            'Ship one end‑to‑end project with auth, routing, state, and a polished UI demonstrating your chosen role.'
        },
        {
          id: 'projects-iter',
          label: 'Iteration & refactor',
          description:
            'Refine the project based on feedback: tighten API contracts, performance and UX polish.'
        }
      ]
    },
    {
      id: 'interview',
      title: 'Phase 4 · Interview preparation',
      steps: [
        {
          id: 'interview-questions',
          label: 'System & behavioral bank',
          description:
            'Assemble 20–30 system design and behavioral questions mapped to your projects.'
        },
        {
          id: 'interview-mocks',
          label: 'Mock interview loop',
          description:
            'Run recorded mock interviews, review answers, and update notes after each session.'
        }
      ]
    }
  ];
};

export const useRoadmapProgress = (role: Role, level: Level) => {
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const { updateRoadmapSummary } = useUserData();

  const storageKey = `${STORAGE_KEY_PREFIX}${role}_${level}`;

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, boolean>;
        setCompleted(parsed);
      } else {
        setCompleted({});
      }
    } catch {
      setCompleted({});
    }
  }, [storageKey]);

  const roadmap = useMemo(() => buildRoadmap(role, level), [role, level]);

  const toggleStep = (id: string) => {
    setCompleted((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        // ignore storage errors in production UI
      }
      return next;
    });
  };

  const { totalSteps, completedSteps } = useMemo(() => {
    const steps = roadmap.flatMap((phase) => phase.steps);
    const total = steps.length;
    const done = steps.filter((s) => completed[s.id]).length;
    return { totalSteps: total, completedSteps: done };
  }, [roadmap, completed]);

  const progress = totalSteps === 0 ? 0 : Math.round((completedSteps / totalSteps) * 100);

  useEffect(() => {
    updateRoadmapSummary({
      progressPct: progress
    });
  }, [progress, updateRoadmapSummary]);

  return {
    roadmap,
    completed,
    toggleStep,
    progress,
    totalSteps,
    completedSteps
  };
};

