import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  useRoadmapProgress,
  Role,
  Level,
  RoadmapPhase,
  RoadmapStep
} from '../hooks/useRoadmapProgress';
import MagneticButton from '../components/MagneticButton';

const selectClass =
  'rounded-full border border-slate-300 bg-white/80 px-3 py-1.5 text-xs font-medium text-slate-800 shadow-sm shadow-slate-900/5 outline-none focus-visible:ring-2 focus-visible:ring-aurora focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100 dark:focus-visible:ring-offset-slate-950';

type PhaseProps = {
  phase: RoadmapPhase;
  completed: Record<string, boolean>;
  onToggle: (id: string) => void;
  index: number;
};

const PhaseCard: React.FC<PhaseProps> = ({ phase, completed, onToggle, index }) => {
  return (
    <motion.li
      className="relative flex gap-4"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ delay: 0.05 * index, type: 'spring', stiffness: 140, damping: 20 }}
    >
      <div className="relative flex flex-col items-center pt-2">
        <div className="h-3 w-3 rounded-full bg-aurora shadow-[0_0_0_4px_rgba(34,211,238,0.35)]" />
        {index < 3 && (
          <div className="mt-1 h-full w-px flex-1 bg-gradient-to-b from-aurora/70 to-slate-600/40 dark:from-aurora/60 dark:to-slate-700" />
        )}
      </div>
      <div className="vm-glass vm-glass-hover w-full p-4">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
          {phase.title}
        </h2>
        <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-200">
          {phase.steps.map((step: RoadmapStep) => (
            <li
              key={step.id}
              className="flex items-start gap-3 rounded-xl bg-slate-50/70 p-2.5 dark:bg-slate-900/70"
            >
              <button
                type="button"
                onClick={() => onToggle(step.id)}
                className="mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded border border-slate-300 bg-white text-[10px] font-semibold text-emerald-500 shadow-sm shadow-slate-900/5 dark:border-slate-600 dark:bg-slate-950"
                aria-pressed={completed[step.id] ?? false}
              >
                {completed[step.id] ? '✓' : ''}
              </button>
              <div>
                <p className="text-[11px] font-semibold text-slate-900 dark:text-slate-100">
                  {step.label}
                </p>
                <p className="mt-0.5 text-[11px] text-slate-600 dark:text-slate-300">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </motion.li>
  );
};

const Roadmap: React.FC = () => {
  const [role, setRole] = useState<Role>('frontend');
  const [level, setLevel] = useState<Level>('beginner');
  const navigate = useNavigate();
  const { roadmap, completed, toggleStep, progress, completedSteps, totalSteps } =
    useRoadmapProgress(role, level);

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Career roadmap</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            An adaptive path from fundamentals to interview‑ready for your chosen role.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full bg-slate-100/80 px-3 py-1 text-[11px] text-slate-700 shadow-sm shadow-slate-900/5 dark:bg-slate-900/80 dark:text-slate-200">
            <span className="font-semibold text-aurora">{progress}%</span>
            <span className="text-slate-500 dark:text-slate-400">
              {completedSteps}/{totalSteps} steps
            </span>
          </div>
          <MagneticButton
            className="bg-slate-900 text-slate-200 border border-slate-700"
            onClick={() => navigate('/')}
          >
            Back to Home
          </MagneticButton>
        </div>
      </header>

      <section className="vm-glass p-4 flex flex-wrap items-center gap-4">
        <div className="space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Role
          </p>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            className={selectClass}
          >
            <option value="frontend">Frontend</option>
            <option value="backend">Backend</option>
            <option value="fullstack">Full Stack</option>
          </select>
        </div>
        <div className="space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Experience
          </p>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value as Level)}
            className={selectClass}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </section>

      <section className="space-y-4">
        <ol className="space-y-5">
          {roadmap.map((phase: RoadmapPhase, index: number) => (
            <PhaseCard
              // eslint-disable-next-line react/no-array-index-key
              key={`${phase.id}-${index}`}
              phase={phase}
              completed={completed}
              onToggle={toggleStep}
              index={index}
            />
          ))}
        </ol>
      </section>
    </div>
  );
};

export default Roadmap;

