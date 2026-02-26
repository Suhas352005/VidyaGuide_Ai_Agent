import { FormEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../hooks/useAuth';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.access_token, res.data.user_email);
      const from = (location.state as { from?: string } | null)?.from;
      navigate(from || '/dashboard', { replace: true });
    } catch (err) {
      console.error(err);
      setError('Login failed. This is a demo backend, any email/password should work.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-8 md:grid-cols-[1.2fr,1fr] items-center">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight mb-3">Welcome back to Vidyamitra</h1>
        <p className="text-slate-400 mb-4">
          Resume evaluator, skill mapper, mock interviews and personalized learning plans – all in
          one AI-powered dashboard.
        </p>
        <ul className="space-y-2 text-sm text-slate-300">
          <li>• Upload your resume and get instant gap analysis.</li>
          <li>• Practice interviews in text mode and track your scores.</li>
          <li>• Receive tailored YouTube and course recommendations.</li>
        </ul>
      </div>
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl space-y-4"
      >
        <h2 className="text-lg font-semibold">Login</h2>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <div className="space-y-1">
          <label className="text-sm text-slate-300">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-primary-500"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm text-slate-300">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-primary-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-primary-600 py-2 text-sm font-medium hover:bg-primary-700 disabled:opacity-60"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
        <p className="text-xs text-slate-500">
          Demo mode: any email and password with 6+ characters will log you in.
        </p>
      </form>
    </div>
  );
}

export function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/auth/register', {
        full_name: fullName,
        email,
        password
      });
      login(res.data.access_token, res.data.user_email);
      const from = (location.state as { from?: string } | null)?.from;
      navigate(from || '/dashboard', { replace: true });
    } catch (err) {
      console.error(err);
      setError('Registration failed. Please check fields and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-8 md:grid-cols-[1.2fr,1fr] items-center">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight mb-3">
          Create your Vidyamitra account
        </h1>
        <p className="text-slate-400 mb-4">
          We will guide you from resume to role selection, learning plan, quizzes and interview
          prep.
        </p>
        <p className="text-sm text-slate-300">
          Start by telling us who you are. You can refine your domain and job role later in the
          journey.
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl space-y-4"
      >
        <h2 className="text-lg font-semibold">Register</h2>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <div className="space-y-1">
          <label className="text-sm text-slate-300">Full name</label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-primary-500"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm text-slate-300">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-primary-500"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm text-slate-300">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-primary-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-primary-600 py-2 text-sm font-medium hover:bg-primary-700 disabled:opacity-60"
        >
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>
    </div>
  );
}

