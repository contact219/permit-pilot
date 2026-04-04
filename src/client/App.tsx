import { Route, Switch } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import NewProject from './pages/NewProject';
import ProjectDetail from './pages/ProjectDetail';
import Admin from './pages/Admin/Admin';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AdminJurisdictions from './pages/Admin/Jurisdictions';
import AdminUsers from './pages/Admin/Users';
import AdminScraperLogs from './pages/Admin/ScraperLogs';
import AdminScraperRun from './pages/Admin/ScraperRun';
import About from './pages/About';
import SharedProject from './pages/SharedProject';

interface AppProps {}

export function App({}: AppProps) {
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) return null;
        return res.json();
      } catch {
        return null;
      }
    },
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_10%_20%,rgba(16,185,129,.25),transparent_30%),radial-gradient(circle_at_90%_0%,rgba(99,102,241,.2),transparent_35%),linear-gradient(180deg,#020617,#0f172a)]" />

      <nav className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-indigo-500 text-sm font-bold text-white">PP</span>
            <a href="/" className="text-lg font-semibold text-white">Permit Pilot</a>
          </div>

          <div className="flex items-center gap-3 text-sm">
            {user ? (
              <>
                <a href="/dashboard" className="rounded-md px-3 py-1.5 text-slate-200 transition hover:bg-white/10">Dashboard</a>
                <a href="/about" className="rounded-md px-3 py-1.5 text-slate-200 transition hover:bg-white/10">About</a>
                {user.role === 'admin' && (
                  <a href="/admin" className="rounded-md px-3 py-1.5 text-slate-200 transition hover:bg-white/10">Admin</a>
                )}
                <button
                  onClick={async () => {
                    await fetch('/api/auth/logout', { method: 'POST' });
                    window.location.href = '/';
                  }}
                  className="rounded-md bg-rose-500/10 px-3 py-1.5 text-rose-300 transition hover:bg-rose-500/20"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <a href="/about" className="rounded-md px-3 py-1.5 text-slate-200 transition hover:bg-white/10">About</a>
                <a href="/#pricing" className="rounded-md px-3 py-1.5 text-slate-200 transition hover:bg-white/10">Pricing</a>
                <a href="/auth" className="rounded-md bg-cyan-500 px-3 py-1.5 font-medium text-slate-950 transition hover:bg-cyan-400">Sign In</a>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/auth" component={Auth} />
          <Route path="/projects/new" component={NewProject} />
          <Route path="/projects/:id" component={ProjectDetail} />
          <Route path="/admin" component={Admin} />
          <Route path="/admin/jurisdictions" component={AdminJurisdictions} />
          <Route path="/admin/users" component={AdminUsers} />
          <Route path="/admin/scraper/logs" component={AdminScraperLogs} />
          <Route path="/admin/scraper/run" component={AdminScraperRun} />
          <Route path="/about" component={About} />
          <Route path="/share/:token" component={SharedProject} />
          <Route path="/verify-email" component={VerifyEmail} />
          <Route path="/forgot-password" component={ForgotPassword} />
          <Route path="/reset-password" component={ResetPassword} />
        </Switch>
      </main>
    </div>
  );
}
