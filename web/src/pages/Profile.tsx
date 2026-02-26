export default function ProfilePage() {
  const email = localStorage.getItem('vm_email');

  return (
    <div className="space-y-8">
      <div className="max-w-3xl">
        <h1 className="text-2xl md:text-3xl font-semibold mb-1">Your profile</h1>
        <p className="text-sm text-slate-400">
          This is a simple demo profile view. In a full implementation it would pull real data from
          the backend or Supabase.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-[1.3fr,1fr]">
        <section className="vm-glass vm-glass-hover p-5 space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-accent-500 text-lg font-semibold text-white shadow-lg shadow-primary-900/40">
              {email ? email.charAt(0).toUpperCase() : '?'}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-100">
                {email ?? 'Not signed in'}
              </p>
              <p className="text-xs text-slate-400">Vidyamitra learner</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center text-xs text-slate-300 mt-3">
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
              <p className="text-[11px] text-slate-400">Quizzes taken</p>
              <p className="mt-1 text-lg font-semibold text-primary-300">3</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
              <p className="text-[11px] text-slate-400">Mock interviews</p>
              <p className="mt-1 text-lg font-semibold text-emerald-300">2</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
              <p className="text-[11px] text-slate-400">Skills completed</p>
              <p className="mt-1 text-lg font-semibold text-amber-300">5</p>
            </div>
          </div>
        </section>
        <section className="vm-glass vm-glass-hover p-5 space-y-2 text-xs text-slate-300">
          <p className="text-slate-200 font-semibold text-sm mb-1">Next best steps</p>
          <p>• Upload or refresh your resume for latest gap analysis.</p>
          <p>• Take a quiz in your target domain to benchmark your skills.</p>
          <p>• Schedule a mock interview session and review feedback.</p>
        </section>
      </div>
    </div>
  );
}

