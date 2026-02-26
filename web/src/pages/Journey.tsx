import { Link } from 'react-router-dom';

export default function JourneyPage() {
  return (
    <div className="space-y-8">
      <div className="max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-3 text-slate-900 dark:text-slate-50">
          Start your career journey
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Tell Vidyamitra whether you already have a resume. We will either help you build one or
          analyse your existing resume, map skills and generate a learning plan.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Link
          to="/resume/upload"
          className="group vm-glass vm-glass-hover p-6"
        >
          <h2 className="mb-2 text-lg font-semibold flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary-600 text-xs font-semibold">
              01
            </span>
            I already have a resume
          </h2>
          <p className="text-sm text-slate-300 mb-4">
            Upload your existing resume for AI-powered evaluation, gap analysis and skill mapping.
          </p>
          <p className="text-sm font-medium text-primary-300 group-hover:text-primary-200">
            Go to resume upload →
          </p>
        </Link>
        <Link
          to="/resume/templates"
          className="group vm-glass vm-glass-hover p-6"
        >
          <h2 className="mb-2 text-lg font-semibold flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-accent-600 text-xs font-semibold">
              02
            </span>
            I don&apos;t have a resume yet
          </h2>
          <p className="text-sm text-slate-300 mb-4">
            Start from curated resume templates and guided sections to quickly build a professional
            resume.
          </p>
          <p className="text-sm font-medium text-primary-300 group-hover:text-primary-200">
            Explore templates →
          </p>
        </Link>
      </div>
    </div>
  );
}

