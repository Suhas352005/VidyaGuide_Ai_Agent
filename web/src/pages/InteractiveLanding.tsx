import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

type SpotlightProps = {
  children: React.ReactNode;
};

const SpotlightBackground: React.FC<SpotlightProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [spotlightPos, setSpotlightPos] = useState({ x: 50, y: 50 });
  const frame = useRef<number | null>(null);

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    if (frame.current !== null) {
      cancelAnimationFrame(frame.current);
    }

    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((event.clientX - left) / width) * 100;
    const y = ((event.clientY - top) / height) * 100;

    frame.current = requestAnimationFrame(() => {
      setSpotlightPos({ x, y });
    });
  }, []);

  useEffect(
    () => () => {
      if (frame.current !== null) {
        cancelAnimationFrame(frame.current);
      }
    },
    []
  );

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-midnight dark:text-slate-50 transition-colors duration-300"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 10% 20%, rgba(56,189,248,0.18) 0, transparent 45%),
            radial-gradient(circle at 80% 0%, rgba(244,114,182,0.18) 0, transparent 55%),
            radial-gradient(circle at 50% 80%, rgba(129,140,248,0.18) 0, transparent 55%),
            radial-gradient(circle at 0% 100%, rgba(74,222,128,0.10) 0, transparent 55%)
          `
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-transparent mix-blend-screen"
        style={{
          background: `radial-gradient(circle at ${spotlightPos.x}% ${spotlightPos.y}%, rgba(255,255,255,0.12), transparent 55%)`
        }}
      />

      <div className="relative z-10">{children}</div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/0 via-white/0 to-white/0 dark:from-black/40 dark:via-transparent dark:to-black/80" />
    </div>
  );
};

type TiltCardProps = {
  title: string;
  subtitle: string;
  metric: string;
  accent: 'aurora' | 'neon' | 'lime';
};

const TiltCard: React.FC<TiltCardProps> = ({ title, subtitle, metric, accent }) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 210, damping: 20, mass: 0.8 });
  const springY = useSpring(y, { stiffness: 210, damping: 20, mass: 0.8 });
  const springRotateX = useSpring(rotateX, { stiffness: 130, damping: 18, mass: 0.8 });
  const springRotateY = useSpring(rotateY, { stiffness: 130, damping: 18, mass: 0.8 });

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const relativeX = event.clientX - rect.left;
    const relativeY = event.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const dx = relativeX - centerX;
    const dy = relativeY - centerY;

    const maxTranslation = 10;
    const maxRotation = 12;

    const newX = (dx / centerX) * maxTranslation;
    const newY = (dy / centerY) * maxTranslation;

    const newRotateX = (-dy / centerY) * maxRotation;
    const newRotateY = (dx / centerX) * maxRotation;

    x.set(newX);
    y.set(newY);
    rotateX.set(newRotateX);
    rotateY.set(newRotateY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    rotateX.set(0);
    rotateY.set(0);
  };

  const accentMap: Record<TiltCardProps['accent'], string> = {
    aurora: 'from-cyan-400/80 to-sky-500/80',
    neon: 'from-fuchsia-500/80 to-violet-500/80',
    lime: 'from-lime-300/80 to-emerald-400/80'
  };

  return (
    <motion.div
      ref={cardRef}
      style={{
        x: springX,
        y: springY,
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformStyle: 'preserve-3d'
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="vm-glass vm-glass-hover relative h-52 cursor-pointer p-[1px]"
    >
      <div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${accentMap[accent]} opacity-40 blur-xl`}
        aria-hidden
      />
      <div className="relative flex h-full flex-col justify-between rounded-2xl bg-slate-950/80 p-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
            {subtitle}
          </p>
          <h3 className="mt-2 text-lg font-semibold text-slate-50">{title}</h3>
        </div>
        <div className="flex items-end justify-between">
          <p className="text-3xl font-semibold text-slate-50">{metric}</p>
          <span className="rounded-full bg-slate-900/80 px-3 py-1 text-xs font-medium text-slate-300">
            Live · 60fps
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const primaryButton = {
  initial: { scale: 1, y: 0 },
  hover: { scale: 1.02, y: -1 },
  tap: { scale: 0.97, y: 1 }
} as const;

const subtleButton = {
  initial: { scale: 1, y: 0 },
  hover: { scale: 1.01, y: -0.5 },
  tap: { scale: 0.98, y: 0.5 }
} as const;

const InteractiveLanding: React.FC = () => {
  const navigate = useNavigate();

  return (
    <SpotlightBackground>
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-16 pt-10 md:pt-14">
        <header className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-aurora to-neon shadow-lg shadow-cyan-500/40">
              <span className="text-xs font-semibold text-slate-950">VA</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-50">Vidyamitra Alpha</p>
              <p className="text-[11px] text-slate-400">Neural wealth interface</p>
            </div>
          </div>
            <div className="flex items-center gap-3">
            <motion.button
              variants={subtleButton}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              className="rounded-full border border-slate-700/80 bg-slate-900/70 px-3 py-1.5 text-xs font-medium text-slate-200"
                type="button"
                onClick={() => navigate('/explore')}
                aria-label="Open explore"
            >
              Changelog
            </motion.button>
            <motion.button
              variants={primaryButton}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              className="rounded-full bg-gradient-to-r from-aurora to-neon px-4 py-1.5 text-xs font-semibold text-slate-950 shadow-lg shadow-cyan-500/40"
                type="button"
                onClick={() => navigate('/dashboard')}
                aria-label="Launch dashboard"
            >
              Launch console
            </motion.button>
          </div>
        </header>

        <main className="grid flex-1 gap-8 md:grid-cols-[1.4fr,1.1fr]">
          <section className="flex flex-col justify-center space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 120, damping: 18 }}
              className="relative max-w-xl"
            >
              <div className="pointer-events-none absolute -inset-4 rounded-3xl bg-gradient-to-br from-slate-200/90 via-slate-100/90 to-slate-50/80 blur-2xl dark:from-slate-950/80 dark:via-slate-950/70 dark:to-slate-900/60" />
              <div className="relative">
                <p className="inline-flex items-center rounded-full border border-slate-300/80 bg-white/80 px-3 py-1 text-[11px] font-medium text-slate-700 backdrop-blur dark:border-slate-700/80 dark:bg-slate-900/70 dark:text-slate-200">
                  <span className="mr-2 h-1.5 w-1.5 rounded-full bg-emerald-400" /> Realtime
                  employability engine
                </p>
                <h1 className="mt-4 text-3xl font-semibold leading-tight text-slate-900 md:text-4xl drop-shadow-[0_10px_25px_rgba(148,163,184,0.45)] dark:text-slate-50 dark:drop-shadow-[0_10px_25px_rgba(15,23,42,0.75)]">
                  Build, test & grow your career like a{' '}
                  <span className="bg-gradient-to-r from-aurora via-neon to-lime bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(59,130,246,0.55)] dark:drop-shadow-[0_0_18px_rgba(8,47,73,0.85)]">
                    fintech portfolio
                  </span>
                  .
                </h1>
                <p className="mt-3 text-sm text-slate-700 md:text-[15px] dark:text-slate-200">
                  Vidyamitra continuously parses your resume, stress‑tests your skills with adaptive
                  quizzes and simulates interviews to keep your job‑market value compounding.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="flex flex-wrap items-center gap-3 pt-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 130, damping: 18 }}
            >
              <motion.button
                variants={primaryButton}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                className="rounded-full bg-gradient-to-r from-aurora to-neon px-5 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/40 hover:shadow-[0_0_45px_rgba(34,211,238,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aurora focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                type="button"
                onClick={() => navigate('/quiz')}
                aria-label="Start career stress test"
              >
                Start career stress test
              </motion.button>
              <motion.button
                variants={subtleButton}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                className="rounded-full border border-slate-700/80 bg-slate-900/70 px-4 py-2 text-sm font-medium text-slate-200"
                type="button"
                onClick={() => navigate('/resume')}
                aria-label="View resume insights"
              >
                View resume insights
              </motion.button>
              <p className="text-[11px] text-slate-400">
                <span className="font-semibold text-aurora">60s</span> to your first AI report.
              </p>
            </motion.div>

            <motion.div
              className="mt-4 flex flex-wrap items-center gap-3"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, type: 'spring', stiffness: 130, damping: 18 }}
            >
              <button
                type="button"
                onClick={() => navigate('/roadmap')}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-700/80 bg-slate-900/70 px-4 py-2 text-xs font-medium text-slate-200 hover:border-aurora hover:text-aurora transition-colors"
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-xl bg-gradient-to-br from-aurora/90 to-neon/90 text-[11px] font-semibold text-slate-950">
                  ⇢
                </span>
                <span>
                  Generate&nbsp;
                  <span className="text-aurora">career roadmap</span>
                </span>
              </button>
            </motion.div>
          </section>

          <section className="flex flex-col gap-4 pb-6 pt-2 md:pt-0">
            <TiltCard
              title="Real‑time resume delta"
              subtitle="Gap analysis"
              metric="+18%"
              accent="aurora"
            />
            <TiltCard
              title="Mock interview readiness"
              subtitle="Signal score"
              metric="7.9 / 10"
              accent="neon"
            />
            <TiltCard
              title="Learning runway funded"
              subtitle="Upskilling coverage"
              metric="63%"
              accent="lime"
            />
          </section>
        </main>
      </div>
    </SpotlightBackground>
  );
};

export default InteractiveLanding;

