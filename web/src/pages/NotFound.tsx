import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound: React.FC = () => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 150, damping: 18 }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
          404 · Not found
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-50">
          This route drifted off course.
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          The page you&apos;re looking for doesn&apos;t exist. You can always return to the home console.
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 150, damping: 18 }}
        className="flex gap-3"
      >
        <Link
          to="/"
          className="rounded-full bg-gradient-to-r from-aurora to-neon px-5 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/40"
        >
          Back to Home
        </Link>
        <Link
          to="/explore"
          className="rounded-full border border-slate-300 px-5 py-2 text-sm font-medium text-slate-900 dark:border-slate-700 dark:text-slate-100"
        >
          Explore tracks
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;

