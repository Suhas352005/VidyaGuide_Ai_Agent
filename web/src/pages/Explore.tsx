import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MagneticButton from '../components/MagneticButton';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { EXPLORE_ITEMS, ExploreItemFull, ExploreTrack } from '../data/explore';

type TrackChip =
  | 'all'
  | 'frontend'
  | 'backend'
  | 'fullstack'
  | 'data-ai'
  | 'resume'
  | 'internships';

type CategoryChip =
  | 'all'
  | ExploreItemFull['category'];

const trackChips: { id: TrackChip; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'frontend', label: 'Frontend' },
  { id: 'backend', label: 'Backend' },
  { id: 'fullstack', label: 'Full Stack' },
  { id: 'data-ai', label: 'Data/AI' },
  { id: 'resume', label: 'Resume' },
  { id: 'internships', label: 'Internships' }
];

const categoryChips: { id: CategoryChip; label: string }[] = [
  { id: 'all', label: 'All categories' },
  { id: 'learning', label: 'Learning' },
  { id: 'interview', label: 'Mock interview' },
  { id: 'projects', label: 'Projects' },
  { id: 'soft-skills', label: 'Soft skills' },
  { id: 'resume', label: 'Resume templates' },
  { id: 'internships', label: 'Internships' }
];

const levelBadge: Record<ExploreItemFull['level'], string> = {
  beginner: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
  intermediate: 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
  advanced: 'bg-fuchsia-500/15 text-fuchsia-700 dark:text-fuchsia-300'
};

const badgeBase =
  'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold';

const chipClass = (active: boolean) =>
  `rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
    active
      ? 'border-aurora bg-aurora/10 text-aurora'
      : 'border-slate-200 bg-white/70 text-slate-700 hover:border-aurora dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-200'
  }`;

const ExploreCard: React.FC<{ item: ExploreItemFull; onOpen: () => void }> = ({ item, onOpen }) => {
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      whileTap={{ scale: 0.98 }}
      className="vm-glass vm-glass-hover group relative overflow-hidden text-left p-5"
      layout
      aria-label={`View details for ${item.title}`}
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-br from-aurora/25 via-neon/15 to-lime/15 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100"
      />
      <div className="relative flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`${badgeBase} bg-slate-900/5 text-slate-700 dark:bg-slate-900/70 dark:text-slate-200`}>
            {item.category.replace('-', ' ')}
          </span>
          <span className={`${badgeBase} ${levelBadge[item.level]}`}>{item.level}</span>
          {item.category === 'internships' && item.meta.internship && (
            <span className={`${badgeBase} bg-slate-900/5 text-slate-700 dark:bg-slate-900/70 dark:text-slate-200`}>
              {item.meta.internship.remote ? 'Remote' : 'Onsite'} · {item.meta.internship.paid ? 'Paid' : 'Unpaid'}
            </span>
          )}
        </div>
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">{item.title}</p>
        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">{item.description}</p>
        <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span>{item.meta.estimatedHours === 0 ? 'Listing' : `~${item.meta.estimatedHours}h`}</span>
          <span className="text-aurora">View details →</span>
        </div>
      </div>
    </motion.button>
  );
};

const Explore: React.FC = () => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 300);
  const [track, setTrack] = useState<TrackChip>('all');
  const [category, setCategory] = useState<CategoryChip>('all');
  const [internRemote, setInternRemote] = useState(false);
  const [internOnsite, setInternOnsite] = useState(false);
  const [internPaid, setInternPaid] = useState(false);
  const [internUnpaid, setInternUnpaid] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const handle = window.setTimeout(() => setLoading(false), 350);
    return () => window.clearTimeout(handle);
  }, []);

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();

    const matchesQuery = (item: ExploreItemFull) => {
      if (!q) return true;
      const hay = [
        item.title,
        item.description,
        item.category,
        item.level,
        item.meta.track,
        ...item.tags
      ]
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    };

    const matchesTrack = (item: ExploreItemFull) => {
      if (track === 'all') return true;
      const t = item.meta.track as ExploreTrack;
      return t === track;
    };

    const matchesCategory = (item: ExploreItemFull) => {
      if (category === 'all') return true;
      return item.category === category;
    };

    const matchesInternshipFlags = (item: ExploreItemFull) => {
      if (track !== 'internships' && category !== 'internships') return true;
      if (item.category !== 'internships' || !item.meta.internship) return false;

      const anyLoc = internRemote || internOnsite;
      const anyPay = internPaid || internUnpaid;

      const locOk = !anyLoc || (internRemote && item.meta.internship.remote) || (internOnsite && !item.meta.internship.remote);
      const payOk = !anyPay || (internPaid && item.meta.internship.paid) || (internUnpaid && !item.meta.internship.paid);

      return locOk && payOk;
    };

    return EXPLORE_ITEMS.filter(
      (item) => matchesQuery(item) && matchesTrack(item) && matchesCategory(item) && matchesInternshipFlags(item)
    );
  }, [debouncedQuery, track, category, internRemote, internOnsite, internPaid, internUnpaid]);

  const showInternshipFilters = track === 'internships' || category === 'internships';
  const isSearching = query.trim().length > 0 && debouncedQuery.trim() !== query.trim();

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Explore
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            A discovery hub for learning tracks, mock interviews, resume templates, and internship opportunities.
          </p>
        </div>
        <MagneticButton
          className="bg-slate-900 text-slate-200 border border-slate-700"
          onClick={() => navigate('/dashboard')}
          aria-label="Back to dashboard"
        >
          Back to Dashboard
        </MagneticButton>
      </header>

      <motion.div
        className="vm-glass p-3 flex items-center gap-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 150, damping: 20 }}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/80 text-xs text-slate-300">
          🔍
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, tag, category..."
          className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-500 outline-none dark:text-slate-100"
          aria-label="Search explore items"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs text-slate-700 hover:border-aurora dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-200"
            aria-label="Clear search"
          >
            Clear
          </button>
        )}
      </motion.div>
      {isSearching && (
        <div className="text-xs text-slate-500 dark:text-slate-400">
          Searching…
        </div>
      )}

      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {trackChips.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setTrack(c.id)}
              className={chipClass(track === c.id)}
              aria-pressed={track === c.id}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {categoryChips.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategory(c.id)}
              className={chipClass(category === c.id)}
              aria-pressed={category === c.id}
            >
              {c.label}
            </button>
          ))}
        </div>

        {showInternshipFilters && (
          <div className="vm-glass p-3 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Internship filters
            </span>
            <button type="button" onClick={() => setInternRemote((v) => !v)} className={chipClass(internRemote)} aria-pressed={internRemote}>
              Remote
            </button>
            <button type="button" onClick={() => setInternOnsite((v) => !v)} className={chipClass(internOnsite)} aria-pressed={internOnsite}>
              Onsite
            </button>
            <button type="button" onClick={() => setInternPaid((v) => !v)} className={chipClass(internPaid)} aria-pressed={internPaid}>
              Paid
            </button>
            <button type="button" onClick={() => setInternUnpaid((v) => !v)} className={chipClass(internUnpaid)} aria-pressed={internUnpaid}>
              Unpaid
            </button>
          </div>
        )}
      </div>

      <motion.div layout className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="vm-glass h-44 animate-pulse">
              <div className="h-full w-full rounded-2xl bg-slate-200/60 dark:bg-slate-800/40" />
            </div>
          ))
        ) : (
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
              >
                <ExploreCard item={item} onOpen={() => navigate(`/explore/${item.id}`)} />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </motion.div>

      {!loading && filtered.length === 0 && (
        <div className="vm-glass p-6 text-center">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">No results</p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Try a different query or clear filters.
          </p>
          <div className="mt-4 flex justify-center">
            <MagneticButton
              className="bg-slate-900 text-slate-200 border border-slate-700"
              onClick={() => {
                setQuery('');
                setTrack('all');
                setCategory('all');
                setInternRemote(false);
                setInternOnsite(false);
                setInternPaid(false);
                setInternUnpaid(false);
              }}
              aria-label="Reset filters"
            >
              Reset filters
            </MagneticButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default Explore;

