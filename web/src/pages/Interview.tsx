import { FormEvent, useState } from 'react';
import api from '../lib/api';

type InterviewQuestion = {
  id: number;
  question: string;
};

type InterviewStartResponse = {
  session_id: string;
  questions: InterviewQuestion[];
};

type InterviewFeedback = {
  score: number;
  strengths: string[];
  improvements: string[];
  overall_feedback: string;
};

export default function InterviewPage() {
  const [jobRole, setJobRole] = useState('Data Analyst');
  const [experienceYears, setExperienceYears] = useState(0);
  const [starting, setStarting] = useState(false);
  const [answering, setAnswering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [session, setSession] = useState<InterviewStartResponse | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState<InterviewQuestion | null>(null);
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(null);

  const startInterview = async (e: FormEvent) => {
    e.preventDefault();
    setStarting(true);
    setError(null);
    setFeedback(null);
    try {
      const res = await api.post<InterviewStartResponse>('/interview/start', {
        job_role: jobRole,
        experience_years: experienceYears
      });
      setSession(res.data);
      setSelectedQuestion(res.data.questions[0] ?? null);
    } catch (err) {
      console.error(err);
      setError('Failed to start interview. Ensure backend is running.');
    } finally {
      setStarting(false);
    }
  };

  const submitAnswer = async () => {
    if (!session || !selectedQuestion || !currentAnswer.trim()) return;
    setAnswering(true);
    setError(null);
    try {
      const res = await api.post<InterviewFeedback>('/interview/answer', {
        session_id: session.session_id,
        question_id: selectedQuestion.id,
        answer: currentAnswer
      });
      setFeedback(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to evaluate answer.');
    } finally {
      setAnswering(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="max-w-3xl">
        <h1 className="text-2xl md:text-3xl font-semibold mb-2">Mock interview</h1>
        <p className="text-sm text-slate-400">
          Practice interview questions tailored to your target role. This demo uses text mode; in a
          full version you can extend it with voice input.
        </p>
      </div>
      <form
        onSubmit={startInterview}
        className="grid gap-4 vm-glass vm-glass-hover p-5 md:grid-cols-3"
      >
        <div className="space-y-1">
          <label className="text-xs text-slate-300">Target job role</label>
          <input
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm outline-none focus:border-primary-500"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-slate-300">Years of experience</label>
          <input
            type="number"
            min={0}
            max={30}
            value={experienceYears}
            onChange={(e) => setExperienceYears(Number(e.target.value))}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm outline-none focus:border-primary-500"
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            disabled={starting}
            className="w-full rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium hover:bg-primary-700 disabled:opacity-60"
          >
            {starting ? 'Preparing…' : 'Start interview'}
          </button>
        </div>
      </form>
      {error && <p className="text-sm text-red-400">{error}</p>}

      {session && selectedQuestion && (
        <div className="grid gap-4 md:grid-cols-[2fr,1.2fr]">
          <div className="vm-glass p-5 space-y-3">
            <p className="text-xs font-medium uppercase tracking-wide text-primary-300">
              Question
            </p>
            <p className="text-sm text-slate-100">{selectedQuestion.question}</p>
            <textarea
              rows={6}
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Type your answer here as if you are speaking to the interviewer…"
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-primary-500"
            />
            <button
              type="button"
              onClick={submitAnswer}
              disabled={answering || !currentAnswer.trim()}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium hover:bg-emerald-700 disabled:opacity-60"
            >
              {answering ? 'Evaluating…' : 'Submit answer'}
            </button>
          </div>
          <div className="vm-glass p-5 space-y-3">
            <p className="text-xs font-medium uppercase tracking-wide text-primary-300">
              Feedback
            </p>
            {feedback ? (
              <>
                <p className="text-sm text-slate-200">
                  Score: <span className="font-semibold">{feedback.score} / 10</span>
                </p>
                <div>
                  <p className="text-xs font-semibold text-emerald-400">Strengths</p>
                  <ul className="mt-1 space-y-1 text-xs text-slate-200">
                    {feedback.strengths.map((s) => (
                      <li key={s}>• {s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold text-amber-400">Improvements</p>
                  <ul className="mt-1 space-y-1 text-xs text-slate-200">
                    {feedback.improvements.map((s) => (
                      <li key={s}>• {s}</li>
                    ))}
                  </ul>
                </div>
                <p className="text-xs text-slate-300">{feedback.overall_feedback}</p>
              </>
            ) : (
              <p className="text-xs text-slate-400">
                Submit your answer to see AI feedback on strengths, gaps and suggested improvements.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

