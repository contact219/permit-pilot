import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { get } from '../../lib/api';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, navigate] = useLocation();
  const { data: userData, isLoading } = useQuery({ queryKey: ['user'], queryFn: () => get<any>('/api/auth/me') });
  const user = userData?.user;

  useEffect(() => { if (!isLoading && (!user || user.role !== 'admin')) navigate('/auth'); }, [user, isLoading, navigate]);

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (!user || user.role !== 'admin') return null;

  const navItems = [
    { label: 'Overview', href: '/admin' },
    { label: 'Jurisdictions', href: '/admin/jurisdictions' },
    { label: 'Users', href: '/admin/users' },
    { label: 'Scraper Logs', href: '/admin/scraper/logs' },
    { label: 'Run Scraper', href: '/admin/scraper/run' },
  ];

  return (
    <div className="min-h-[calc(100vh-8rem)] rounded-2xl border border-white/10 bg-slate-900/70 shadow-2xl shadow-slate-950/40 backdrop-blur md:flex">
      <aside className="border-b border-white/10 md:w-72 md:border-b-0 md:border-r">
        <div className="p-5">
          <h2 className="text-2xl font-bold text-white">Admin Control</h2>
          <p className="mt-1 text-xs text-slate-400">Data, billing, scraper, exports</p>
          <nav className="mt-6 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => navigate(item.href)}
                className={`w-full rounded-lg px-4 py-2 text-left text-sm transition ${location === item.href ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-200 hover:bg-white/10'}`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </aside>
      <main className="flex-1 p-6 md:p-8">{children}</main>
    </div>
  );
}
