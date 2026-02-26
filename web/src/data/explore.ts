export type ExploreItem = {
  id: string;
  title: string;
  description: string;
  category: 'learning' | 'interview' | 'projects' | 'soft-skills' | 'resume' | 'internships';
  level: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
};

export type ExploreTrack =
  | 'frontend'
  | 'backend'
  | 'fullstack'
  | 'data-ai'
  | 'resume'
  | 'internships';

export type ExploreItemMeta = {
  skillsCovered: string[];
  estimatedHours: number;
  track: ExploreTrack;
  relatedIds: string[];
  template?: {
    atsScore: number; // UI only
    tips: string[];
  };
  internship?: {
    company: string;
    role: string;
    location: string;
    stipend: string;
    remote: boolean;
    paid: boolean;
  };
  interview?: {
    topics: string[];
  };
};

export type ExploreItemFull = ExploreItem & { meta: ExploreItemMeta };

export const EXPLORE_ITEMS: ExploreItemFull[] = [
  {
    id: 'learn-react-fintech-ui',
    title: 'Frontend foundations for premium SaaS UI',
    description:
      'Build a Linear/Vercel-grade UI system with React 18, strict TypeScript, routing, and motion.',
    category: 'learning',
    level: 'beginner',
    tags: ['frontend', 'react', 'typescript', 'tailwind', 'motion'],
    meta: {
      track: 'frontend',
      estimatedHours: 16,
      skillsCovered: ['React 18 patterns', 'TypeScript strict', 'Tailwind design systems', 'Motion'],
      relatedIds: ['resume-frontend-dev', 'interview-frontend-01', 'project-ui-kit']
    }
  },
  {
    id: 'learn-fullstack-product',
    title: 'Full stack: Ship a complete product end‑to‑end',
    description:
      'A practical path for full stack roles: UI, API, data, deployment, and “why” decisions.',
    category: 'learning',
    level: 'intermediate',
    tags: ['fullstack', 'react', 'api', 'deployment', 'auth'],
    meta: {
      track: 'fullstack',
      estimatedHours: 20,
      skillsCovered: ['End-to-end architecture', 'Auth + routing', 'API integration', 'Deploy basics'],
      relatedIds: ['resume-fullstack', 'project-ui-kit', 'interview-frontend-01']
    }
  },
  {
    id: 'learn-data-ai-kpis',
    title: 'Data/AI track: KPIs, dashboards, and decision-making',
    description:
      'Build a KPI dashboard, define success metrics, and communicate insights like a product analyst.',
    category: 'learning',
    level: 'beginner',
    tags: ['data-ai', 'dashboards', 'kpis', 'sql', 'communication'],
    meta: {
      track: 'data-ai',
      estimatedHours: 10,
      skillsCovered: ['Metric design', 'SQL fundamentals', 'Dashboard thinking', 'Narrative'],
      relatedIds: ['intern-open-data-ai', 'softskills-storytelling', 'resume-ats-friendly']
    }
  },
  {
    id: 'learn-fastapi-backend-core',
    title: 'Backend core: FastAPI, auth, and clean API contracts',
    description:
      'Design production-grade REST APIs with validation, error envelopes, and auth flows you can defend in interviews.',
    category: 'learning',
    level: 'beginner',
    tags: ['backend', 'fastapi', 'python', 'auth', 'rest'],
    meta: {
      track: 'backend',
      estimatedHours: 18,
      skillsCovered: ['FastAPI routers', 'Request validation', 'Auth flows', 'API error design'],
      relatedIds: ['resume-backend-dev', 'intern-neoapi-backend', 'interview-backend-01']
    }
  },
  {
    id: 'project-ui-kit',
    title: 'Project: Build a premium UI kit (glass + motion)',
    description:
      'Ship reusable components: magnetic buttons, tilt cards, skeletons, and tokens that scale across pages.',
    category: 'projects',
    level: 'intermediate',
    tags: ['frontend', 'design-system', 'tailwind', 'motion'],
    meta: {
      track: 'frontend',
      estimatedHours: 12,
      skillsCovered: ['Component architecture', 'Design tokens', 'Motion polish', 'Accessibility'],
      relatedIds: ['learn-react-fintech-ui', 'resume-ats-friendly', 'interview-frontend-01']
    }
  },
  {
    id: 'softskills-storytelling',
    title: 'Soft skills: Storytelling for interviews (high signal answers)',
    description:
      'Turn projects into crisp, quantified narratives that sound senior and stay memorable.',
    category: 'soft-skills',
    level: 'beginner',
    tags: ['soft-skills', 'communication', 'interviews'],
    meta: {
      track: 'fullstack',
      estimatedHours: 4,
      skillsCovered: ['STAR method', 'Metrics & outcomes', 'Clarity drills', 'Tone control'],
      relatedIds: ['interview-frontend-01', 'interview-backend-01']
    }
  },

  // Mock interview tracks
  {
    id: 'interview-frontend-01',
    title: 'Mock interview track: Frontend (React + UI systems)',
    description:
      'Practice questions around state, rendering, performance, and building a scalable design system.',
    category: 'interview',
    level: 'intermediate',
    tags: ['frontend', 'react', 'interview', 'performance'],
    meta: {
      track: 'frontend',
      estimatedHours: 3,
      skillsCovered: ['React mental model', 'Performance', 'Component patterns', 'Testing basics'],
      relatedIds: ['learn-react-fintech-ui', 'project-ui-kit', 'softskills-storytelling'],
      interview: {
        topics: ['State & rendering', 'Performance profiling', 'Design system decisions', 'Trade-offs']
      }
    }
  },
  {
    id: 'interview-backend-01',
    title: 'Mock interview track: Backend (APIs + systems)',
    description:
      'Structured rounds on API design, data modeling, caching, and reliability thinking.',
    category: 'interview',
    level: 'intermediate',
    tags: ['backend', 'api', 'interview', 'systems'],
    meta: {
      track: 'backend',
      estimatedHours: 3,
      skillsCovered: ['API design', 'Data modeling', 'Reliability', 'Observability basics'],
      relatedIds: ['learn-fastapi-backend-core', 'softskills-storytelling'],
      interview: {
        topics: ['API contracts', 'DB modeling', 'Caching strategies', 'Failure modes']
      }
    }
  },

  // Resume templates
  {
    id: 'resume-ats-friendly',
    title: 'Resume template: ATS-friendly (general)',
    description:
      'Clean, keyword-ready layout optimized for parsing and scanning. Works for most roles.',
    category: 'resume',
    level: 'beginner',
    tags: ['resume', 'ats', 'general'],
    meta: {
      track: 'resume',
      estimatedHours: 1,
      skillsCovered: ['ATS formatting', 'Keywords', 'Impact bullets', 'Structure'],
      relatedIds: ['resume-frontend-dev', 'resume-backend-dev', 'resume-internship'],
      template: {
        atsScore: 92,
        tips: [
          'Use a single-column layout for best parsing.',
          'Quantify impact: latency ↓, revenue ↑, conversions ↑.',
          'Mirror keywords from the job description naturally.'
        ]
      }
    }
  },
  {
    id: 'resume-frontend-dev',
    title: 'Resume template: Frontend developer',
    description:
      'Highlight UI craftsmanship, component systems, performance wins, and UX metrics.',
    category: 'resume',
    level: 'beginner',
    tags: ['resume', 'frontend', 'react', 'ui'],
    meta: {
      track: 'resume',
      estimatedHours: 1,
      skillsCovered: ['Portfolio positioning', 'UI impact bullets', 'Performance metrics'],
      relatedIds: ['resume-ats-friendly', 'interview-frontend-01', 'project-ui-kit'],
      template: {
        atsScore: 90,
        tips: [
          'Include Lighthouse/perf improvements with before/after.',
          'Show component reuse impact (reduced dev time, fewer bugs).',
          'Add “Design system” and accessibility wins explicitly.'
        ]
      }
    }
  },
  {
    id: 'resume-backend-dev',
    title: 'Resume template: Backend developer',
    description:
      'Emphasize API reliability, scalability improvements, data modeling, and latency reductions.',
    category: 'resume',
    level: 'beginner',
    tags: ['resume', 'backend', 'api', 'fastapi'],
    meta: {
      track: 'resume',
      estimatedHours: 1,
      skillsCovered: ['API metrics', 'Reliability bullet writing', 'Architecture clarity'],
      relatedIds: ['resume-ats-friendly', 'interview-backend-01', 'learn-fastapi-backend-core'],
      template: {
        atsScore: 89,
        tips: [
          'Lead with outcomes (p95 latency, error rate, throughput).',
          'Call out data model decisions and why they matter.',
          'Show ownership: monitoring, alerts, incident learnings.'
        ]
      }
    }
  },
  {
    id: 'resume-fullstack',
    title: 'Resume template: Full stack',
    description:
      'Balanced template to showcase end-to-end ownership from UI to APIs to deployment.',
    category: 'resume',
    level: 'beginner',
    tags: ['resume', 'fullstack', 'react', 'api'],
    meta: {
      track: 'resume',
      estimatedHours: 1,
      skillsCovered: ['End-to-end narrative', 'Trade-offs', 'Cross-functional impact'],
      relatedIds: ['resume-ats-friendly', 'interview-frontend-01', 'interview-backend-01'],
      template: {
        atsScore: 88,
        tips: [
          'Show one flagship system end-to-end with metrics.',
          'Make boundaries clear: frontend, backend, data, deploy.',
          'Mention collaboration: product, design, QA.'
        ]
      }
    }
  },
  {
    id: 'resume-internship',
    title: 'Resume template: Internship',
    description:
      'Optimize for potential: projects, learning velocity, and fundamentals with strong verbs.',
    category: 'resume',
    level: 'beginner',
    tags: ['resume', 'internships', 'students'],
    meta: {
      track: 'resume',
      estimatedHours: 1,
      skillsCovered: ['Project framing', 'Clear fundamentals', 'Results even for small projects'],
      relatedIds: ['resume-ats-friendly', 'intern-aurora-ui', 'intern-neoapi-backend'],
      template: {
        atsScore: 86,
        tips: [
          'Lead with 2–3 strong projects with measurable outcomes.',
          'Keep education concise but include relevant coursework.',
          'Add GitHub links and demos for credibility.'
        ]
      }
    }
  },

  // Internship opportunities (mock but realistic)
  {
    id: 'intern-aurora-ui',
    title: 'Internship: Frontend UI Engineer',
    description:
      'Work on a premium dashboard experience: motion, design systems, and performance.',
    category: 'internships',
    level: 'beginner',
    tags: ['internships', 'frontend', 'react', 'remote', 'paid'],
    meta: {
      track: 'internships',
      estimatedHours: 0,
      skillsCovered: ['React', 'UI systems', 'Performance', 'Accessibility'],
      relatedIds: ['resume-frontend-dev', 'interview-frontend-01'],
      internship: {
        company: 'Aurora Labs',
        role: 'Frontend UI Engineer Intern',
        location: 'Remote',
        stipend: '₹25,000 / month',
        remote: true,
        paid: true
      }
    }
  },
  {
    id: 'intern-neoapi-backend',
    title: 'Internship: Backend API Developer',
    description:
      'Build and harden API endpoints, integrate data sources, and improve reliability.',
    category: 'internships',
    level: 'beginner',
    tags: ['internships', 'backend', 'python', 'onsite', 'paid'],
    meta: {
      track: 'internships',
      estimatedHours: 0,
      skillsCovered: ['FastAPI', 'Postgres basics', 'Auth', 'Observability'],
      relatedIds: ['resume-backend-dev', 'interview-backend-01'],
      internship: {
        company: 'NeoAPI Systems',
        role: 'Backend Developer Intern',
        location: 'Hyderabad (Onsite)',
        stipend: '₹20,000 / month',
        remote: false,
        paid: true
      }
    }
  },
  {
    id: 'intern-open-data-ai',
    title: 'Internship: Data/AI Analyst',
    description:
      'Work on analytics dashboards, experiment design, and KPI pipelines.',
    category: 'internships',
    level: 'beginner',
    tags: ['internships', 'data-ai', 'remote', 'unpaid'],
    meta: {
      track: 'internships',
      estimatedHours: 0,
      skillsCovered: ['SQL', 'Dashboards', 'Experimentation', 'Communication'],
      relatedIds: ['resume-ats-friendly', 'softskills-storytelling'],
      internship: {
        company: 'OpenMetric Studio',
        role: 'Data/AI Analyst Intern',
        location: 'Remote',
        stipend: 'Unpaid (certificate + mentorship)',
        remote: true,
        paid: false
      }
    }
  }
];

export const getExploreItemById = (id: string): ExploreItemFull | undefined =>
  EXPLORE_ITEMS.find((i) => i.id === id);


