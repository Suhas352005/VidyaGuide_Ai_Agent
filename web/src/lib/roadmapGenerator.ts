export type RoadmapPhase = {
  id: string;
  title: string;
  description: string;
  skills: string[];
  resources: string[];
  estimatedWeeks: number;
};

export type CareerRoadmap = {
  role: string;
  level: string;
  timeline: string;
  phases: RoadmapPhase[];
};

export type RoleOption = 'frontend' | 'backend' | 'fullstack' | 'data-ai';
export type LevelOption = 'beginner' | 'intermediate' | 'advanced';
export type TimelineOption = '3m' | '6m' | '12m';

type BasePhaseInput = {
  role: RoleOption;
  level: LevelOption;
};

const BASE_PHASES: {
  id: string;
  title: (ctx: BasePhaseInput) => string;
  description: (ctx: BasePhaseInput) => string;
  skills: (ctx: BasePhaseInput) => string[];
  resources: (ctx: BasePhaseInput) => string[];
  baseWeeks: number;
}[] = [
  {
    id: 'fundamentals',
    title: () => 'Phase 1 · Fundamentals',
    description: ({ level }) =>
      level === 'beginner'
        ? 'Lay down the core language and tooling foundations you will reuse everywhere.'
        : 'Quickly tighten fundamentals to remove any weak links before going deeper.',
    skills: ({ role }) => {
      switch (role) {
        case 'backend':
          return ['TypeScript / Python refresh', 'Async I/O basics', 'Git workflow', 'API mental model'];
        case 'data-ai':
          return ['Python + notebooks', 'SQL basics', 'Git workflow', 'Metric thinking'];
        default:
          return ['Modern JavaScript + TypeScript', 'Git workflow', 'HTTP & APIs', 'Basic accessibility'];
      }
    },
    resources: ({ role }) => {
      if (role === 'backend') {
        return [
          'TypeScript handbook (typescriptlang.org)',
          'FastAPI tutorial (fastapi.tiangolo.com)',
          'Git branching model (Atlassian Gitflow)'
        ];
      }
      if (role === 'data-ai') {
        return [
          'SQLBolt interactive lessons',
          'Pandas documentation walkthrough',
          'dbt blog: defining KPIs'
        ];
      }
      return [
        'React docs: Describing the UI',
        'TypeScript for React devs',
        'MDN: HTTP fundamentals'
      ];
    },
    baseWeeks: 3
  },
  {
    id: 'core',
    title: ({ role }) =>
      role === 'backend'
        ? 'Phase 2 · Core API and data skills'
        : role === 'data-ai'
          ? 'Phase 2 · Core analytics and modeling'
          : 'Phase 2 · Core UI and state skills',
    description: ({ role }) =>
      role === 'backend'
        ? 'Design reliable APIs, data models, and auth flows that scale with product complexity.'
        : role === 'data-ai'
          ? 'Learn to turn raw data into trustworthy dashboards and clear decisions.'
          : 'Build interactive, resilient UIs with predictable data‑flow and performance in mind.',
    skills: ({ role }) => {
      if (role === 'backend') {
        return ['API design & versioning', 'Data modeling', 'Auth & sessions', 'Error handling & logging'];
      }
      if (role === 'fullstack') {
        return ['React routing & layouts', 'API integration patterns', 'Form handling', 'Basic CI/CD'];
      }
      if (role === 'data-ai') {
        return ['Query optimization', 'Dashboard building', 'Experiment design basics', 'Communicating insights'];
      }
      return ['Component patterns', 'Global vs local state', 'Form + validation flows', 'Performance basics'];
    },
    resources: ({ role }) => {
      if (role === 'backend') {
        return ['FastAPI advanced docs', '12-factor app manifesto', 'Designing HTTP+JSON APIs (blog series)'];
      }
      if (role === 'data-ai') {
        return ['Mode Analytics SQL school', 'Analytics engineering best practices', 'A/B testing primers'];
      }
      return ['React Router tutorial', 'TanStack Query docs', 'Kent C. Dodds blog on forms and UX'];
    },
    baseWeeks: 4
  },
  {
    id: 'projects',
    title: () => 'Phase 3 · Projects',
    description: ({ role }) =>
      role === 'data-ai'
        ? 'Ship at least one analytics project that answers a real business-style question.'
        : 'Prove your skills with visible, end‑to‑end projects you can talk about in interviews.',
    skills: ({ role }) => {
      if (role === 'backend') {
        return ['One production‑like API', 'Background jobs or workers', 'Basic monitoring'];
      }
      if (role === 'data-ai') {
        return ['One dashboard with KPIs', 'SQL model layer', 'Write-up of findings'];
      }
      return ['Flagship UI or fullstack app', 'Responsive + accessible design', 'Performance profiling'];
    },
    resources: ({ role }) => {
      if (role === 'data-ai') {
        return ['Sample analytics case studies', 'Public datasets (Kaggle)', 'Mode gallery dashboards'];
      }
      return ['Frontend Mentor / Frontend Practice briefs', 'Open API specs to integrate', 'Vercel deployment guides'];
    },
    baseWeeks: 5
  },
  {
    id: 'interview',
    title: () => 'Phase 4 · Interview preparation',
    description: ({ level }) =>
      level === 'beginner'
        ? 'Prepare for junior interviews with strong stories and fundamentals.'
        : 'Practice explaining trade‑offs, system design, and impact like a mid‑senior engineer.',
    skills: ({ role }) => {
      if (role === 'backend') {
        return ['System design warmups', 'API scenario questions', 'Behavioral question bank'];
      }
      if (role === 'data-ai') {
        return ['Product sense questions', 'Metric definition drills', 'Behavioral stories around ambiguity'];
      }
      return ['UI/UX critique questions', 'System design for frontends/edge', 'Behavioral stories with metrics'];
    },
    resources: () => [
      'Pramp / interviewing.io for mock interviews',
      'Behavioral interview question banks',
      'System design primer (GitHub)'
    ],
    baseWeeks: 2
  }
];

const timelineMultiplier = (timeline: TimelineOption): number => {
  switch (timeline) {
    case '3m':
      return 0.6;
    case '6m':
      return 1;
    case '12m':
      return 1.6;
    default:
      return 1;
  }
};

const levelAdjustment = (level: LevelOption): number => {
  switch (level) {
    case 'beginner':
      return 1.1;
    case 'intermediate':
      return 1;
    case 'advanced':
      return 0.9;
    default:
      return 1;
  }
};

export const generateRoadmap = (
  role: RoleOption,
  level: LevelOption,
  timeline: TimelineOption
): CareerRoadmap => {
  const mult = timelineMultiplier(timeline);
  const levelMult = levelAdjustment(level);

  const phases: RoadmapPhase[] = BASE_PHASES.map((base) => {
    const ctx: BasePhaseInput = { role, level };
    const scaledWeeks = Math.max(1, Math.round(base.baseWeeks * mult * levelMult));
    const skills = base.skills(ctx);

    const adjustedSkills =
      level === 'advanced'
        ? skills.map((s) => `${s} (deeper)`)
        : level === 'beginner'
          ? skills
          : skills;

    return {
      id: base.id,
      title: base.title(ctx),
      description: base.description(ctx),
      skills: adjustedSkills,
      resources: base.resources(ctx),
      estimatedWeeks: scaledWeeks
    };
  });

  return {
    role,
    level,
    timeline,
    phases
  };
};

