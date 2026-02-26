import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import MagneticButton from '../components/MagneticButton';
import { EXPLORE_ITEMS, ExploreItemFull, getExploreItemById } from '../data/explore';

const badgeBase =
  'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold';

const levelStyles: Record<ExploreItemFull['level'], string> = {
  beginner: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
  intermediate: 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
  advanced: 'bg-fuchsia-500/15 text-fuchsia-700 dark:text-fuchsia-300'
};

const categoryLabel: Record<ExploreItemFull['category'], string> = {
  learning: 'Learning',
  interview: 'Mock interview',
  projects: 'Projects',
  'soft-skills': 'Soft skills',
  resume: 'Resume templates',
  internships: 'Internships'
};

const storageSessionsKey = (id: string) => `vm_explore_sessions_${id}`;

const ExploreDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const item = id ? getExploreItemById(id) : undefined;

  const related = useMemo(() => {
    if (!item) return [];
    const relIds = item.meta.relatedIds ?? [];
    const byId = relIds
      .map((rid) => getExploreItemById(rid))
      .filter(Boolean) as ExploreItemFull[];

    if (byId.length > 0) return byId.slice(0, 3);

    return EXPLORE_ITEMS.filter((x) => x.category === item.category && x.id !== item.id).slice(0, 3);
  }, [item]);

  const [difficulty, setDifficulty] = useState(item?.level ?? 'beginner');
  const [sessions, setSessions] = useState<number>(() => {
    if (!item) return 0;
    const raw = window.localStorage.getItem(storageSessionsKey(item.id));
    const n = raw ? Number(raw) : 0;
    return Number.isFinite(n) ? n : 0;
  });

  if (!item) {
    return (
      <div className="space-y-6">
        <div className="vm-glass p-5">
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-50">Not found</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            This explore item doesn&apos;t exist. Try going back to Explore.
          </p>
          <div className="mt-4">
            <MagneticButton
              className="bg-slate-900 text-slate-200 border border-slate-700"
              onClick={() => navigate('/explore')}
            >
              Back to Explore
            </MagneticButton>
          </div>
        </div>
      </div>
    );
  }

  const onPrimaryAction = () => {
    if (item.category === 'resume') {
      window.alert('Mock download: In production, this would download a PDF/DOCX template.');
      return;
    }
    if (item.category === 'internships') {
      window.alert('Mock apply: In production, this would open the apply link or form.');
      return;
    }
    if (item.category === 'interview') {
      const nextSessions = sessions + 1;
      setSessions(nextSessions);
      window.localStorage.setItem(storageSessionsKey(item.id), String(nextSessions));
      navigate('/interview');
      return;
    }
    navigate('/roadmap');
  };

  const primaryLabel =
    item.category === 'resume'
      ? 'Download template'
      : item.category === 'internships'
        ? 'Apply now'
        : item.category === 'interview'
          ? 'Start mock interview'
          : 'Open roadmap';

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`${badgeBase} bg-slate-900/5 text-slate-700 dark:bg-slate-900/70 dark:text-slate-200`}>
              {categoryLabel[item.category]}
            </span>
            <span className={`${badgeBase} ${levelStyles[item.level]}`}>{item.level}</span>
            <span className={`${badgeBase} bg-slate-900/5 text-slate-700 dark:bg-slate-900/70 dark:text-slate-200`}>
              {item.meta.estimatedHours === 0 ? 'Listing' : `~${item.meta.estimatedHours}h`}
            </span>
          </div>
          <h1 className="mt-3 text-2xl md:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            {item.title}
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{item.description}</p>
        </div>
        <div className="flex items-center gap-3">
          <MagneticButton
            className="bg-slate-900 text-slate-200 border border-slate-700"
            onClick={() => navigate('/explore')}
          >
            Back to Explore
          </MagneticButton>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-[1.6fr,1fr]">
        <div className="vm-glass p-5 space-y-4">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Skills covered</h2>
          <div className="flex flex-wrap gap-2">
            {item.meta.skillsCovered.map((s) => (
              <span
                key={s}
                className="rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-[11px] font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-200"
              >
                {s}
              </span>
            ))}
          </div>

          {item.category === 'interview' && item.meta.interview && (
            <div className="mt-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                Topics
              </p>
              <ul className="mt-2 space-y-1 text-xs text-slate-700 dark:text-slate-200">
                {item.meta.interview.topics.map((t) => (
                  <li key={t}>• {t}</li>
                ))}
              </ul>
              <div className="mt-4 flex items-center gap-3">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as ExploreItemFull['level'])}
                  className="rounded-full border border-slate-300 bg-white/80 px-3 py-1.5 text-xs font-medium text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
                <div className="ml-auto text-[11px] text-slate-500 dark:text-slate-400">
                  Sessions completed: <span className="font-semibold text-aurora">{sessions}</span>
                </div>
              </div>
            </div>
          )}

          {item.category === 'resume' && item.meta.template && (
            <div className="mt-2 space-y-3">
              <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 p-4 text-xs text-slate-700 dark:border-slate-800 dark:from-slate-950 dark:to-slate-900 dark:text-slate-200">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  Preview (UI)
                </p>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <div className="col-span-2 h-3 rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="h-3 rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="col-span-3 h-16 rounded bg-slate-200/80 dark:bg-slate-800/60" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  ATS score (UI)
                </p>
                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-300">
                  {item.meta.template.atsScore}%
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-aurora to-lime"
                  style={{ width: `${item.meta.template.atsScore}%` }}
                />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  Tips
                </p>
                <ul className="mt-2 space-y-1 text-xs text-slate-700 dark:text-slate-200">
                  {item.meta.template.tips.map((t) => (
                    <li key={t}>• {t}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {item.category === 'internships' && item.meta.internship && (
            <div className="mt-2 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                Listing
              </p>
              <div className="grid gap-2 text-xs text-slate-700 dark:text-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Company</span>
                  <span className="font-semibold">{item.meta.internship.company}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Role</span>
                  <span className="font-semibold">{item.meta.internship.role}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Location</span>
                  <span className="font-semibold">{item.meta.internship.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Stipend</span>
                  <span className="font-semibold">{item.meta.internship.stipend}</span>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className={`${badgeBase} bg-slate-900/5 text-slate-700 dark:bg-slate-900/70 dark:text-slate-200`}>
                  {item.meta.internship.remote ? 'Remote' : 'Onsite'}
                </span>
                <span className={`${badgeBase} bg-slate-900/5 text-slate-700 dark:bg-slate-900/70 dark:text-slate-200`}>
                  {item.meta.internship.paid ? 'Paid' : 'Unpaid'}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="vm-glass p-5">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Actions</h2>
            <div className="mt-4 flex flex-col gap-2">
              <MagneticButton
                className="bg-gradient-to-r from-aurora to-neon text-slate-950"
                onClick={onPrimaryAction}
                aria-label={primaryLabel}
              >
                {primaryLabel}
              </MagneticButton>
              {item.category === 'resume' && (
                <MagneticButton
                  className="bg-slate-900 text-slate-200 border border-slate-700"
                  onClick={() => navigate('/resume/templates')}
                  aria-label="Open resume templates"
                >
                  Open resume templates
                </MagneticButton>
              )}
              {item.category === 'internships' && (
                <MagneticButton
                  className="bg-slate-900 text-slate-200 border border-slate-700"
                  onClick={() => navigate('/resume')}
                  aria-label="Improve resume for internships"
                >
                  Improve your resume
                </MagneticButton>
              )}
            </div>
          </div>

          <div className="vm-glass p-5">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Related items
            </h2>
            <div className="mt-3 space-y-2">
              {related.length === 0 ? (
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  No related items yet.
                </p>
              ) : (
                related.map((r) => (
                  <motion.button
                    key={r.id}
                    type="button"
                    onClick={() => navigate(`/explore/${r.id}`)}
                    whileTap={{ scale: 0.98 }}
                    className="w-full text-left rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-xs text-slate-800 hover:border-aurora dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-200"
                    aria-label={`Open details for ${r.title}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold">{r.title}</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        {categoryLabel[r.category]}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2">
                      {r.description}
                    </p>
                  </motion.button>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ExploreDetail;

