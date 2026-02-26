import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { LoginPage, RegisterPage } from './pages/Auth';
import JourneyPage from './pages/Journey';
import { ResumeTemplatesPage, ResumeUploadPage } from './pages/Resume';
import QuizPage from './pages/Quiz';
import InterviewPage from './pages/Interview';
import { JobsPage, ProgressPage } from './pages/ProgressAndJobs';
import ProfilePage from './pages/Profile';
import { ThemeProvider } from './hooks/useTheme';
import { AuthProvider } from './hooks/useAuth';
import { UserDataProvider } from './hooks/useUserData';

const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Explore = lazy(() => import('./pages/Explore'));
const ExploreDetail = lazy(() => import('./pages/ExploreDetail'));
const Roadmap = lazy(() => import('./pages/Roadmap'));
const NotFound = lazy(() => import('./pages/NotFound'));

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <UserDataProvider>
          <Suspense
            fallback={
              <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-200">
                <div className="vm-glass px-6 py-3 text-sm text-slate-800 dark:text-slate-200">
                  Loading console…
                </div>
              </div>
            }
          >
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected app routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/explore" element={<Explore />} />
                  <Route path="/explore/:id" element={<ExploreDetail />} />
                  <Route path="/roadmap" element={<Roadmap />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/journey" element={<JourneyPage />} />
                  <Route path="/resume" element={<ResumeUploadPage />} />
                  <Route path="/resume/upload" element={<ResumeUploadPage />} />
                  <Route path="/resume/templates" element={<ResumeTemplatesPage />} />
                  <Route path="/quiz" element={<QuizPage />} />
                  <Route path="/interview" element={<InterviewPage />} />
                  <Route path="/progress" element={<ProgressPage />} />
                  <Route path="/jobs" element={<JobsPage />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Suspense>
        </UserDataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;



