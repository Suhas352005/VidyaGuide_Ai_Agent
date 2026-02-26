import { useEffect, useMemo, useState } from 'react';
import api from '../lib/api';
import { useUserData } from '../hooks/useUserData';

type Question = {
  id: number;
  question: string;
  options: string[];
  correct_index: number;
};

type QuizStartResponse = {
  quiz_id: string;
  questions: Question[];
};

const QUESTION_TIME_SECONDS = 45;

const inferTopic = (q: Question): string => {
  const txt = q.question.toLowerCase();
  if (txt.includes('http') || txt.includes('cors')) return 'HTTP & APIs';
  if (txt.includes('react') || txt.includes('hook')) return 'React state & hooks';
  if (txt.includes('fastapi')) return 'FastAPI & backend';
  if (txt.includes('supabase') || txt.includes('database')) return 'Data & storage';
  return 'General fundamentals';
};

export default function QuizPage() {
  const [domain, setDomain] = useState('Full-Stack');
  const [difficulty, setDifficulty] = useState('easy');
  const [numQuestions, setNumQuestions] = useState(5);
  const [starting, setStarting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [session, setSession] = useState<QuizStartResponse | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(QUESTION_TIME_SECONDS);
  const [result, setResult] = useState<{
    score: number;
    total: number;
    feedback: string;
    weakTopics: string[];
  } | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const { recordQuizAttempt, addGapSkillToRoadmap } = useUserData();

  useEffect(() => {
    if (!session || submitted) return;
    if (timeLeft <= 0) {
      // auto-advance
      setTimeLeft(QUESTION_TIME_SECONDS);
      setCurrentIndex((prev) =>
        prev + 1 < (session?.questions.length ?? 0) ? prev + 1 : prev
      );
      return;
    }
    const id = window.setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => window.clearTimeout(id);
  }, [session, timeLeft, submitted]);

  const startQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    setStarting(true);
    setError(null);
    setResult(null);
    try {
      const res = await api.post<QuizStartResponse>('/quiz/start', {
        domain,
        difficulty,
        num_questions: numQuestions
      });
      const qs = res.data.questions.slice(0, numQuestions);
      setSession({ ...res.data, questions: qs });
      setAnswers(Array(qs.length).fill(-1));
      setCurrentIndex(0);
      setTimeLeft(QUESTION_TIME_SECONDS);
      setSubmitted(false);
    } catch (err) {
      console.error(err);
      setError('Failed to start quiz. Ensure backend is running.');
    } finally {
      setStarting(false);
    }
  };

  const canGoNext = useMemo(
    () => session && answers[currentIndex] !== -1,
    [session, answers, currentIndex]
  );

  const handleNext = () => {
    if (!session) return;
    if (currentIndex + 1 < session.questions.length) {
      setCurrentIndex((i) => i + 1);
      setTimeLeft(QUESTION_TIME_SECONDS);
    }
  };

  const submitQuiz = async () => {
    if (!session) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await api.post<{ score: number; total: number; feedback: string }>('/quiz/submit', {
        quiz_id: session.quiz_id,
        answers
      });
      const scorePct = Math.round((res.data.score / res.data.total) * 100);

      const wrongTopics: string[] = [];
      session.questions.forEach((q, idx) => {
        if (answers[idx] === -1) return;
        if (answers[idx] !== q.correct_index) {
          wrongTopics.push(inferTopic(q));
        }
      });
      const weakTopics = Array.from(new Set(wrongTopics));

      const attempt = {
        id: `quiz-${Date.now()}`,
        domain,
        difficulty,
        scorePct,
        total: res.data.total,
        correct: res.data.score,
        incorrect: res.data.total - res.data.score,
        weakTopics,
        takenAt: new Date().toISOString()
      };
      recordQuizAttempt(attempt);
      setResult({
        score: res.data.score,
        total: res.data.total,
        feedback: res.data.feedback,
        weakTopics
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError('Failed to submit quiz.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetake = () => {
    if (!session) return;
    setSession(null);
    setAnswers([]);
    setResult(null);
    setSubmitted(false);
    setTimeLeft(QUESTION_TIME_SECONDS);
  };

  const currentQuestion = session ? session.questions[currentIndex] : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-2">Test your knowledge</h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          Configure a quick skill quiz and let Vidyamitra track your performance across sessions.
        </p>
      </div>
      <form
        onSubmit={startQuiz}
        className="grid gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 md:grid-cols-4"
      >
        <div className="space-y-1">
          <label className="text-xs text-slate-300">Domain</label>
          <select
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm outline-none focus:border-primary-500"
          >
            <option>Full-Stack</option>
            <option>Data Science</option>
            <option>Cloud</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs text-slate-300">Difficulty</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm outline-none focus:border-primary-500"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs text-slate-300">Questions</label>
          <input
            type="number"
            min={1}
            max={5}
            value={numQuestions}
            onChange={(e) => setNumQuestions(Number(e.target.value))}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm outline-none focus:border-primary-500"
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            disabled={starting}
            className="w-full rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium hover:bg-primary-700 disabled:opacity-60"
          >
            {starting ? 'Starting…' : 'Start quiz'}
          </button>
        </div>
      </form>
      {error && <p className="text-sm text-red-400">{error}</p>}

      {session && currentQuestion && (
        <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span>
              Question {currentIndex + 1} of {session.questions.length}
            </span>
            <div className="flex items-center gap-2">
              <span>Time left: {timeLeft}s</span>
              <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-amber-400"
                  style={{ width: `${(timeLeft / QUESTION_TIME_SECONDS) * 100}%` }}
                />
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
            <p className="text-sm font-medium text-slate-100 mb-2">
              {currentQuestion.question}
            </p>
            <div className="grid gap-2 md:grid-cols-2">
              {currentQuestion.options.map((opt, optIdx) => (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => {
                    if (submitted) return;
                    const copy = [...answers];
                    copy[currentIndex] = optIdx;
                    setAnswers(copy);
                  }}
                  className={
                    'rounded-lg border px-3 py-2 text-left text-xs transition-colors ' +
                    (answers[currentIndex] === optIdx
                      ? 'border-primary-500 bg-primary-500/20 text-primary-100'
                      : 'border-slate-700 bg-slate-900 text-slate-200 hover:border-primary-500')
                  }
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleNext}
              disabled={!canGoNext || currentIndex === (session.questions.length - 1)}
              className="rounded-lg border border-slate-700 px-4 py-2 text-xs font-medium text-slate-200 hover:border-primary-500 disabled:opacity-40"
            >
              Next question
            </button>
            <button
              type="button"
              onClick={submitQuiz}
              disabled={submitting || submitted}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium hover:bg-emerald-700 disabled:opacity-60"
            >
              {submitting ? 'Submitting…' : submitted ? 'Submitted' : 'Submit quiz'}
            </button>
          </div>
        </div>
      )}

      {result && (
        <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-200 mb-1">Quiz result</h2>
              <p className="mt-1 text-sm text-slate-300">{result.feedback}</p>
            </div>
            <div className="rounded-full border border-emerald-500/50 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-200">
              {result.score} / {result.total}
            </div>
          </div>
          <div className="mt-2 text-xs text-slate-300">
            Score: {Math.round((result.score / result.total) * 100)}%
          </div>
          <div className="mt-3 space-y-1">
            <p className="text-xs font-semibold text-slate-200">Weak topics</p>
            {result.weakTopics.length === 0 ? (
              <p className="text-xs text-slate-400">None detected — great job.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {result.weakTopics.map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => addGapSkillToRoadmap(topic)}
                    className="rounded-full border border-amber-400/60 bg-amber-500/10 px-3 py-1 text-[11px] font-medium text-amber-100 hover:bg-amber-500/20"
                  >
                    {topic} · add to roadmap
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={handleRetake}
              className="rounded-full border border-slate-700 px-4 py-2 text-xs font-medium text-slate-200 hover:border-primary-500"
            >
              Retake quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

