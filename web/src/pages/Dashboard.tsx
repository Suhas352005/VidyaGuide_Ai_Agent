import React, { useMemo } from 'react';
import { motion, animate } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MagneticButton from '../components/MagneticButton';
import { useUserData } from '../hooks/useUserData';

type StatCardProps = {
  label: string;
  value: number | null;
  suffix?: string;
  trend?: number | null;
};

const StatCard: React.FC<StatCardProps> = ({ label, value, suffix = '', trend }) => {
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    if (value == null) {
      setDisplayValue(0);
      return;
    }
    const controls = animate(displayValue, value, {
      duration: 1.1,
      ease: 'easeOut',
      onUpdate: (v) => setDisplayValue(Math.round(v))
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <motion.div
      className="vm-glass vm-glass-hover relative h-32 overflow-hidden"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 160, damping: 20 }}
    >
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-aurora via-neon to-lime opacity-60" />
      <div className="flex h-full flex-col justify-between p-4">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          {label}
        </p>
        {value == null ? (
          <p className="text-xs text-slate-500 dark:text-slate-400">No data yet</p>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
              {displayValue}
              {suffix}
            </p>
            {trend != null && trend !== 0 && (
              <span
                className={
                  'text-xs font-semibold ' +
                  (trend > 0 ? 'text-emerald-500' : 'text-red-400')
                }
              >
                {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { resumeHistory, quizHistory, roadmap, activity } = useUserData();

  const resumeStats = useMemo(() => {
    if (!resumeHistory.length) return { current: null, trend: null };
    const latest = resumeHistory[resumeHistory.length - 1].atsScore;
    const prev = resumeHistory.length > 1 ? resumeHistory[resumeHistory.length - 2].atsScore : null;
    const trend = prev != null ? latest - prev : null;
    return { current: latest, trend };
  }, [resumeHistory]);

  const quizStats = useMemo(() => {
    if (!quizHistory.length) return { index: null, trend: null, lastScores: [] as number[] };
    const lastScores = quizHistory.slice(0, 6).map((a) => a.scorePct);
    const weighted = lastScores.reduce((acc, s, i) => acc + s * (1 - i * 0.1), 0);
    const denom = lastScores.reduce((acc, _, i) => acc + (1 - i * 0.1), 0);
    const mockIndex = Math.round(weighted / denom);
    const prev = quizHistory[1]?.scorePct ?? null;
    const trend = prev != null ? quizHistory[0].scorePct - prev : null;
    return { index: mockIndex, trend, lastScores };
  }, [quizHistory]);

  const streakDays = useMemo(() => {
    if (!activity.length) return 0;
    const dates = Array.from(
      new Set(
        activity.map((a) => new Date(a.at).toISOString().slice(0, 10))
      )
    ).sort();
    const today = new Date().toISOString().slice(0, 10);
    if (!dates.includes(today)) return 0;
    let streak = 1;
    let cursor = new Date(today);
    // walk backwards
    while (true) {
      cursor.setDate(cursor.getDate() - 1);
      const day = cursor.toISOString().slice(0, 10);
      if (dates.includes(day)) {
        streak += 1;
      } else {
        break;
      }
    }
    return streak;
  }, [activity]);

  const nextActions = useMemo(() => {
    const actions: { label: string; to: string }[] = [];
    if (!resumeHistory.length) {
      actions.push({ label: 'Upload your resume to get ATS feedback', to: '/resume' });
    }
    const lastQuiz = quizHistory[0];
    if (lastQuiz && lastQuiz.scorePct < 60) {
      actions.push({ label: 'Retake a quiz in your weak topics', to: '/quiz' });
    }
    if (roadmap.progressPct < 30 && roadmap.weakSkills.length) {
      actions.push({
        label: `Work on roadmap skill: ${roadmap.weakSkills[0]}`,
        to: '/roadmap'
      });
    }
    if (streakDays === 0 && (quizHistory.length || resumeHistory.length)) {
      actions.push({
        label: 'Restart your streak with a quick quiz',
        to: '/quiz'
      });
    }
    if (!actions.length) {
      actions.push({ label: 'Continue progressing through your roadmap', to: '/roadmap' });
    }
    return actions;
  }, [resumeHistory, quizHistory, roadmap, streakDays]);

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Dashboard
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Live view of your career signals, quiz performance and interview readiness.
          </p>
        </div>
        <MagneticButton
          className="bg-gradient-to-r from-aurora to-neon text-slate-950"
          onClick={() => navigate('/progress')}
          aria-label="Go to progress"
        >
          Sync now
        </MagneticButton>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Resume match score"
          value={resumeStats.current}
          suffix="%"
          trend={resumeStats.trend}
        />
        <StatCard
          label="Mock interview index"
          value={quizStats.index}
          suffix="%"
          trend={quizStats.trend}
        />
        <StatCard
          label="Weekly learning streak"
          value={streakDays || null}
          suffix={streakDays ? ' days' : ''}
        />
      </section>

      <section className="grid gap-4 md:grid-cols-[2fr,1.2fr]">
        <motion.div
          className="vm-glass p-5"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 150, damping: 22 }}
        >
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
            Skill trajectory
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Quiz scores over your last attempts. Use this trend to decide when to schedule interviews.
          </p>
          {quizStats.lastScores.length === 0 ? (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              No quiz attempts yet. Start a quiz to begin tracking your trajectory.
            </p>
          ) : (
            <div className="mt-2 flex h-32 items-end gap-2">
              {quizStats.lastScores.map((score, idx) => (
                <motion.div
                  key={`${score}-${idx}`}
                  className="relative flex-1 rounded-full bg-gradient-to-t from-slate-800 to-aurora"
                  initial={{ height: 0 }}
                  animate={{ height: `${score}%` }}
                  transition={{ delay: 0.15 + idx * 0.05, type: 'spring', stiffness: 200, damping: 18 }}
                >
                  <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-slate-200">
                    {score}%
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
        <motion.div
          className="vm-glass p-5 flex flex-col justify-between"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 150, damping: 22 }}
        >
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
            Next actions
          </h2>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            {nextActions.map((a) => (
              <li key={a.label}>• {a.label}</li>
            ))}
          </ul>
          <div className="mt-3 flex flex-wrap gap-2">
            {nextActions.map((a) => (
              <MagneticButton
                key={a.label}
                className="bg-slate-900 text-slate-200 border border-slate-700"
                onClick={() => navigate(a.to)}
              >
                Go · {a.to.replace('/', '') || 'home'}
              </MagneticButton>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Dashboard;

