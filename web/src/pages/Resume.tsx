import { FormEvent, useState } from 'react';
import api from '../lib/api';
import { useUserData, ResumeInsight } from '../hooks/useUserData';

export function ResumeUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ResumeInsight | null>(null);
  const [parsedPreview, setParsedPreview] = useState<string>('');
  const { setResumeInsight, addGapSkillToRoadmap } = useUserData();

  const computeAtsScore = (text: string, suggestedSkills: string[]): number => {
    const lower = text.toLowerCase();
    let hits = 0;
    suggestedSkills.forEach((skill) => {
      if (lower.includes(skill.toLowerCase())) hits += 1;
    });
    const base = 60 + hits * 8;
    return Math.max(0, Math.min(98, base));
  };

  const buildSuggestions = (analysis: {
    improvements: string[];
    suggested_skills: string[];
  }): string[] => {
    const tips: string[] = [];
    if (analysis.improvements.length === 0 && analysis.suggested_skills.length === 0) {
      tips.push('Your resume already looks strong. Focus on tailoring it to specific roles.');
    }
    if (analysis.improvements.some((i) => /metrics|measurable|quantify/i.test(i))) {
      tips.push('Add 1–2 metrics per role (latency, revenue, conversions, users).');
    }
    if (analysis.suggested_skills.length > 0) {
      tips.push('Mirror role keywords in your skills and experience sections where relevant.');
    }
    tips.push('Keep formatting clean, single column, and consistent for better ATS parsing.');
    return tips;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please choose a resume file first.');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const text = await file.text();
      setParsedPreview(text);
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post<{
        summary: string;
        strengths: string[];
        improvements: string[];
        suggested_skills: string[];
      }>('/resume/parse', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const atsScore = computeAtsScore(text, res.data.suggested_skills);
      const suggestions = buildSuggestions(res.data);
      const analyzedAt = new Date().toISOString();
      const insight: ResumeInsight = {
        atsScore,
        summary: res.data.summary,
        strengths: res.data.strengths,
        gaps: res.data.improvements,
        suggestions,
        suggestedSkills: res.data.suggested_skills,
        parsedText: text,
        analyzedAt
      };
      setResult(insight);
      setResumeInsight(insight);
    } catch (err) {
      console.error(err);
      setError('Upload failed. Ensure backend is running on port 8000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="max-w-3xl">
        <h1 className="text-2xl md:text-3xl font-semibold mb-2 text-slate-900 dark:text-slate-50">
          Upload your resume
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Supported formats: PDF / DOCX / TXT. Vidyamitra will parse your resume, summarise it and
          identify strengths, gaps and suggested skills.
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 vm-glass vm-glass-hover p-5"
      >
        <div className="space-y-2">
          <label className="text-sm text-slate-800 dark:text-slate-200">Choose file</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-slate-700 file:mr-4 file:rounded-full file:border-0 file:bg-primary-600 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white hover:file:bg-primary-700 dark:text-slate-300"
          />
          {file && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Selected: <span className="font-medium text-slate-800 dark:text-slate-200">{file.name}</span>
            </p>
          )}
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium hover:bg-primary-700 disabled:opacity-60"
        >
          {loading ? 'Analyzing…' : 'Upload & analyze'}
        </button>
      </form>

      {result && (
        <div className="grid gap-4 md:grid-cols-4">
          <section className="vm-glass p-4 space-y-3">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              ATS match score
            </h2>
            <div className="flex items-center gap-3">
              <div className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-600 dark:text-emerald-200">
                {result.atsScore}%
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Higher scores indicate better keyword alignment and structure for most ATS parsers.
            </p>
          </section>
          <section className="vm-glass p-4 space-y-2">
            <h2 className="text-sm font-semibold text-emerald-500">Strengths</h2>
            <ul className="space-y-1 text-sm text-slate-800 dark:text-slate-200">
              {result.strengths.map((s) => (
                <li key={s}>• {s}</li>
              ))}
            </ul>
          </section>
          <section className="vm-glass p-4 space-y-2">
            <h2 className="text-sm font-semibold text-amber-400">Skill gaps</h2>
            <ul className="space-y-1 text-sm text-slate-800 dark:text-slate-200">
              {result.gaps.map((s) => (
                <li key={s} className="flex items-center justify-between gap-2">
                  <span>• {s}</span>
                  <button
                    type="button"
                    onClick={() => addGapSkillToRoadmap(s)}
                    className="rounded-full border border-aurora/60 px-2 py-0.5 text-[11px] font-medium text-aurora hover:bg-aurora/10"
                  >
                    Add to roadmap
                  </button>
                </li>
              ))}
            </ul>
          </section>
          <section className="vm-glass p-4 space-y-2 md:col-span-4">
            <h2 className="text-sm font-semibold text-primary-500 dark:text-primary-300">
              AI suggestions
            </h2>
            <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
              {result.suggestions.map((tip) => (
                <li key={tip}>• {tip}</li>
              ))}
            </ul>
          </section>
          <section className="vm-glass p-4 space-y-2 md:col-span-2">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Suggested skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {result.suggestedSkills.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => addGapSkillToRoadmap(skill)}
                  className="rounded-full border border-primary-500/40 bg-primary-500/10 px-3 py-1 text-xs font-medium text-primary-700 hover:bg-primary-500/20 dark:text-primary-100"
                >
                  {skill}
                </button>
              ))}
            </div>
          </section>
          <section className="vm-glass p-4 space-y-2 md:col-span-2">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Resume preview
            </h2>
            <div className="h-40 overflow-auto rounded-xl border border-slate-200 bg-slate-50 p-2 text-[11px] text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
              <pre className="whitespace-pre-wrap">{parsedPreview || result.parsedText}</pre>
            </div>
            <button
              type="button"
              onClick={() => {
                const blob = new Blob([parsedPreview || result.parsedText], {
                  type: 'text/plain;charset=utf-8'
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'resume-clean.txt';
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="mt-2 rounded-full border border-slate-300 bg-white/80 px-3 py-1 text-xs font-medium text-slate-700 hover:border-aurora dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200"
            >
              Download cleaned version
            </button>
          </section>
        </div>
      )}
    </div>
  );
}

export function ResumeTemplatesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold mb-1">Resume templates (placeholder)</h1>
      <p className="text-sm text-slate-400 max-w-2xl">
        This is a UI placeholder where you can later plug in downloadable resume templates for
        freshers, experienced professionals, and domain-specific roles.
      </p>
      <div className="grid gap-4 md:grid-cols-3">
        {['Fresher engineering', 'MBA / Management', 'Working professional'].map((title) => (
          <div
            key={title}
            className="vm-glass vm-glass-hover p-4 text-sm text-slate-900 dark:text-slate-200"
          >
            <p className="mb-2 font-semibold">{title}</p>
            <p className="text-xs text-slate-400 mb-3">
              Clean sections for summary, education, projects, skills and achievements.
            </p>
            <button className="rounded-full border border-primary-500/60 px-3 py-1 text-xs font-medium text-primary-200 hover:bg-primary-600/20">
              View sample
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

