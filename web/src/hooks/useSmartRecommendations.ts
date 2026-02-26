import { CareerRoadmap } from '../lib/roadmapGenerator';

type CompletionMap = Record<string, boolean>;

export type SmartRecommendations = {
  nextSkill: string | null;
  weakestPhaseTitle: string | null;
  suggestedProject: string | null;
};

export const useSmartRecommendations = (
  roadmap: CareerRoadmap,
  completed: CompletionMap
): SmartRecommendations => {
  if (!roadmap.phases.length) {
    return { nextSkill: null, weakestPhaseTitle: null, suggestedProject: null };
  }

  let weakestPhaseIndex = 0;
  let lowestCompletionRatio = 1;

  roadmap.phases.forEach((phase, index) => {
    const skillIds = phase.skills.map((s) => `${phase.id}::${s}`);
    const total = skillIds.length || 1;
    const done = skillIds.filter((id) => completed[id]).length;
    const ratio = done / total;
    if (ratio < lowestCompletionRatio) {
      lowestCompletionRatio = ratio;
      weakestPhaseIndex = index;
    }
  });

  const weakestPhase = roadmap.phases[weakestPhaseIndex];
  const nextSkill =
    weakestPhase.skills
      .map((s) => ({ id: `${weakestPhase.id}::${s}`, label: s }))
      .find((x) => !completed[x.id])?.label ?? null;

  let suggestedProject: string | null = null;
  if (roadmap.role === 'frontend' || roadmap.role === 'fullstack') {
    suggestedProject = 'Build a small dashboard with filters, charts, and dark/light mode toggle.';
  } else if (roadmap.role === 'backend') {
    suggestedProject =
      'Design a metrics API with authentication, pagination, and clear error envelopes.';
  } else if (roadmap.role === 'data-ai') {
    suggestedProject =
      'Create a KPI dashboard for a sample product (signups, activation, retention, revenue).';
  }

  return {
    nextSkill,
    weakestPhaseTitle: weakestPhase.title,
    suggestedProject
  };
};

