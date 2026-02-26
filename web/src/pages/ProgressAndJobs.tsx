import { useEffect, useState } from 'react';
import api from '../lib/api';

type ProgressEntry = {
  date: string;
  metric: string;
  value: number;
  label: string;
};

type ProgressOverview = {
  quiz_scores: ProgressEntry[];
  interview_scores: ProgressEntry[];
  completed_skills: string[];
};

type JobRecommendation = {
  title: string;
  company: string;
  location: string;
  url: string;
  match_score: number;
};

export function ProgressPage() {
  const [data, setData] = useState<ProgressOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get<ProgressOverview>('/progress/');
        setData(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch progress data.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-8">
      <div className="max-w-3xl">
        <h1 className="text-2xl font-semibold mb-2">Learning progress</h1>
        <p className="text-sm text-slate-400">
          View a high-level timeline of your quiz scores, interview performance and completed
          skills.
        </p>
      </div>
      {loading && <p className="text-sm text-slate-400">Loading progress…</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}
      {data && (
        <div className="grid gap-4 md:grid-cols-3">
          <section className="vm-glass p-4 md:col-span-2">
            <h2 className="mb-2 text-sm font-semibold text-slate-200">Quiz history</h2>
            <ul className="space-y-2 text-xs text-slate-200">
              {data.quiz_scores.map((q) => (
                <li
                  key={q.label}
                  className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/40 px-3 py-2"
                >
                  <span>{q.label}</span>
                  <span className="text-primary-300 font-semibold">{q.value}</span>
                </li>
              ))}
            </ul>
          </section>
          <section className="vm-glass p-4">
            <h2 className="mb-2 text-sm font-semibold text-slate-200">Interview scores</h2>
            <ul className="space-y-2 text-xs text-slate-200">
              {data.interview_scores.map((i) => (
                <li
                  key={i.label}
                  className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/40 px-3 py-2"
                >
                  <span>{i.label}</span>
                  <span className="text-emerald-300 font-semibold">{i.value}</span>
                </li>
              ))}
            </ul>
          </section>
          <section className="vm-glass p-4 md:col-span-3">
            <h2 className="mb-2 text-sm font-semibold text-slate-200">Completed skills</h2>
            <div className="flex flex-wrap gap-2">
              {data.completed_skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-100"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export function JobsPage() {
  const [jobs, setJobs] = useState<JobRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get<JobRecommendation[]>('/jobs/recommendations');
        setJobs(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch job recommendations.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-8">
      <div className="max-w-3xl">
        <h1 className="text-2xl font-semibold mb-2">Job recommendations</h1>
        <p className="text-sm text-slate-400">
          View sample roles that align with your skills. You can later plug in real job feeds from
          external APIs.
        </p>
      </div>
      {loading && <p className="text-sm text-slate-400">Loading jobs…</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="grid gap-4 md:grid-cols-2">
        {jobs.map((job) => (
          <a
            key={job.title + job.company}
            href={job.url}
            target="_blank"
            rel="noreferrer"
            className="vm-glass vm-glass-hover p-4"
          >
            <p className="text-sm font-semibold text-slate-100">
              {job.title}{' '}
              <span className="ml-1 text-xs text-primary-300">{job.match_score}% match</span>
            </p>
            <p className="text-xs text-slate-400">
              {job.company} · {job.location}
            </p>
            <p className="mt-2 text-xs text-primary-300">Open details / Apply →</p>
          </a>
        ))}
      </div>
    </div>
  );
}

