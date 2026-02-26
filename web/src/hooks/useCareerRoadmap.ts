import { useEffect, useMemo, useState } from 'react';
import {
  CareerRoadmap,
  generateRoadmap,
  LevelOption,
  RoleOption,
  TimelineOption
} from '../lib/roadmapGenerator';

type CompletionMap = Record<string, boolean>;

const STORAGE_PREFIX = 'vm_career_roadmap_';

const storageKey = (role: RoleOption, level: LevelOption, timeline: TimelineOption): string =>
  `${STORAGE_PREFIX}${role}_${level}_${timeline}`;

export const useCareerRoadmap = (role: RoleOption, level: LevelOption, timeline: TimelineOption) => {
  const [roadmap, setRoadmap] = useState<CareerRoadmap>(() => generateRoadmap(role, level, timeline));
  const [completed, setCompleted] = useState<CompletionMap>({});
  const [expandedPhases, setExpandedPhases] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const key = storageKey(role, level, timeline);
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw) as CompletionMap;
        setCompleted(parsed);
      } else {
        setCompleted({});
      }
    } catch {
      setCompleted({});
    }
  }, [role, level, timeline]);

  useEffect(() => {
    setRoadmap(generateRoadmap(role, level, timeline));
  }, [role, level, timeline]);

  const toggleSkill = (phaseId: string, skill: string) => {
    const id = `${phaseId}::${skill}`;
    setCompleted((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      const key = storageKey(role, level, timeline);
      try {
        window.localStorage.setItem(key, JSON.stringify(next));
      } catch {
        // ignore storage issues in UI
      }
      return next;
    });
  };

  const togglePhaseExpanded = (id: string) => {
    setExpandedPhases((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const { totalSkills, completedSkills } = useMemo(() => {
    const allSkills: string[] = roadmap.phases.flatMap((p) =>
      p.skills.map((s) => `${p.id}::${s}`)
    );
    const total = allSkills.length;
    const done = allSkills.filter((id) => completed[id]).length;
    return { totalSkills: total, completedSkills: done };
  }, [roadmap, completed]);

  const progress = totalSkills === 0 ? 0 : Math.round((completedSkills / totalSkills) * 100);

  const resetProgress = () => {
    setCompleted({});
    try {
      window.localStorage.removeItem(storageKey(role, level, timeline));
    } catch {
      // ignore
    }
  };

  return {
    roadmap,
    completed,
    progress,
    completedSkills,
    totalSkills,
    expandedPhases,
    toggleSkill,
    togglePhaseExpanded,
    resetProgress
  };
};

