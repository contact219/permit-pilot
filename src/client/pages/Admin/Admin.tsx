import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { get } from '../../lib/api';
import AdminLayout from './Layout';

export default function Admin() {
  const [, navigate] = useLocation();
  const { data: stats } = useQuery({ queryKey: ['admin', 'scraper', 'stats'], queryFn: () => get<any>('/api/admin/scraper/stats') });

  const sections = [
    { title: 'Jurisdictions CRUD', href: '/admin/jurisdictions', description: 'Maintain jurisdiction records, portal URLs, and permit data.', badge: 'Data' },
    { title: 'Users & Plan Gating', href: '/admin/users', description: 'Manage user roles, plan tiers, and Stripe customer metadata.', badge: 'Billing' },
    { title: 'Scraper Automation', href: '/admin/scraper/run', description: 'Run BullMQ + Playwright scraper sources for Municode, Socrata, and city portals.', badge: 'Automation' },
    { title: 'Scraper Logs', href: '/admin/scraper/logs', description: 'Review full job history, failures, and source-level diagnostics.', badge: 'Observability' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="mt-2 text-slate-300">Operational controls for form ZIP exports, scraper automation, and billing-enabled access tiers.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-slate-800/80 p-3"><p className="text-xs text-slate-400">Total Jobs</p><p className="text-xl font-semibold text-white">{stats?.total ?? 0}</p></div>
            <div className="rounded-lg bg-slate-800/80 p-3"><p className="text-xs text-slate-400">Pending</p><p className="text-xl font-semibold text-amber-300">{stats?.pending ?? 0}</p></div>
            <div className="rounded-lg bg-slate-800/80 p-3"><p className="text-xs text-slate-400">Completed</p><p className="text-xl font-semibold text-emerald-300">{stats?.success ?? 0}</p></div>
            <div className="rounded-lg bg-slate-800/80 p-3"><p className="text-xs text-slate-400">Failed</p><p className="text-xl font-semibold text-rose-300">{stats?.failed ?? 0}</p></div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {sections.map((s) => (
            <button key={s.href} className="rounded-xl border border-white/10 bg-white/5 p-5 text-left transition hover:border-cyan-300/50 hover:bg-cyan-400/10" onClick={() => navigate(s.href)}>
              <p className="mb-2 inline-flex rounded-full bg-cyan-400/20 px-2 py-1 text-xs font-semibold text-cyan-200">{s.badge}</p>
              <h2 className="text-xl font-semibold text-white">{s.title}</h2>
              <p className="mt-2 text-sm text-slate-300">{s.description}</p>
            </button>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
