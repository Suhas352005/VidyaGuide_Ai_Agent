import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../hooks/useAuth';

const navLinkClass =
  'px-3 py-1 rounded-full text-sm font-medium transition-colors hover:bg-slate-200 dark:hover:bg-slate-800';

export default function Layout() {
  const navigate = useNavigate();
  const { isAuthed, email, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = email ? email.charAt(0).toUpperCase() : '?';

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 shadow-md shadow-slate-900/10 dark:shadow-lg dark:shadow-primary-900/40" />
            <div>
              <p className="text-sm font-semibold tracking-tight">Vidyamitra</p>
              <p className="text-xs text-slate-400">AI Career Agent</p>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-2 text-slate-700 dark:text-slate-200">
            <NavLink to="/" end className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/dashboard" className={navLinkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/explore" className={navLinkClass}>
              Explore
            </NavLink>
            <NavLink to="/resume" className={navLinkClass}>
              Resume
            </NavLink>
            <NavLink to="/quiz" className={navLinkClass}>
              Quiz
            </NavLink>
          </nav>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {isAuthed && email ? (
              <>
                <button
                  type="button"
                  onClick={() => navigate('/profile')}
                  className="flex items-center gap-2 rounded-full border border-slate-300 bg-white/80 px-2 py-1 text-xs hover:border-primary-500 dark:border-slate-700 dark:bg-slate-900/80"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-600 text-xs font-semibold text-white">
                    {initials}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Signed in as</p>
                    <p className="text-xs font-medium text-slate-900 dark:text-slate-100 truncate max-w-[140px]">
                      {email}
                    </p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:border-red-500 hover:text-red-600 dark:border-slate-700 dark:text-slate-200 dark:hover:text-red-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="text-sm text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="rounded-full bg-primary-600 px-3 py-1 text-sm font-medium hover:bg-primary-700"
                >
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <Outlet />
        </div>
      </main>
      <footer className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
        Vidyamitra – AI-powered resume evaluator, trainer & career planner.
      </footer>
    </div>
  );
}

