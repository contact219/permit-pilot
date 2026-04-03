import { Route, Switch } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import NewProject from './pages/NewProject';
import ProjectDetail from './pages/ProjectDetail';
import Admin from './pages/Admin/Admin';
import AdminJurisdictions from './pages/Admin/Jurisdictions';
import AdminUsers from './pages/Admin/Users';
import AdminScraperLogs from './pages/Admin/ScraperLogs';
import AdminScraperRun from './pages/Admin/ScraperRun';

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
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <a href="/" className="text-xl font-bold text-blue-600">Permit Pilot</a>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <a href="/dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</a>
                  {user.role === 'admin' && (
                    <a href="/admin" className="text-gray-700 hover:text-blue-600">Admin</a>
                  )}
                  <button
                    onClick={async () => {
                      await fetch('/api/auth/logout', { method: 'POST' });
                      window.location.href = '/';
                    }}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <a href="/auth" className="text-blue-600 hover:text-blue-700 font-medium">Sign In</a>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        </Switch>
      </main>
    </div>
  );
}
