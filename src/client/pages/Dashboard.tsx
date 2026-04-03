import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { useEffect } from 'react';
import { get, post, del } from '../lib/api';
import StatusBadge from '../components/StatusBadge';
import ChecklistExport from '../components/ChecklistExport';
import FormZipExport from '../components/FormZipExport';

export default function Dashboard() {
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();

  const { data: projects, isLoading, error } = useQuery({ queryKey: ['projects'], queryFn: () => get<any[]>('/api/projects') });
  const { data: userData } = useQuery({ queryKey: ['user'], queryFn: () => get<any>('/api/auth/me') });

  const user = userData?.user;
  const planTier = user?.planTier || 'free';
  const isAdmin = user?.role === 'admin';

  const deleteMutation = useMutation({ mutationFn: (id: string) => del(`/api/projects/${id}`), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }) });

  useEffect(() => { if (error && (error as Error).message.includes('401')) navigate('/auth'); }, [error, navigate]);

  const handleUpgrade = async (plan: 'contractor' | 'homeowner') => {
    try { const { url } = await post<{ url: string }>('/api/billing/checkout', { planTier: plan }); window.location.href = url; }
    catch { alert('Failed to start checkout'); }
  };

  if (isLoading) return <div className="rounded-2xl border border-white/10 bg-white/5 p-8">Loading projects...</div>;
  if (error) return <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-8 text-rose-200">Error loading projects</div>;

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Project Command Center</h1>
            <p className="mt-1 text-slate-300">Free tier: up to 2 projects and 10 AI analyses/day.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${planTier === 'free' ? 'bg-slate-700 text-slate-100' : planTier === 'contractor' ? 'bg-cyan-400/20 text-cyan-200' : 'bg-emerald-400/20 text-emerald-200'}`}>
              {planTier.charAt(0).toUpperCase() + planTier.slice(1)}
            </span>
            {isAdmin && <button onClick={() => navigate('/admin')} className="px-4 py-2 rounded-lg bg-violet-500/80 text-white hover:bg-violet-500">Admin Panel</button>}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {planTier === 'free' ? (
            <>
              <button onClick={() => handleUpgrade('contractor')} className="px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 font-medium hover:bg-cyan-400">Upgrade to Contractor</button>
              <button onClick={() => handleUpgrade('homeowner')} className="px-4 py-2 rounded-lg bg-emerald-500 text-slate-950 font-medium hover:bg-emerald-400">Homeowner Plan</button>
            </>
          ) : (
            <button onClick={async () => { const { url } = await get<{ url: string }>('/api/billing/portal'); window.location.href = url; }} className="px-4 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-600">Manage Subscription</button>
          )}
          <button onClick={() => navigate('/projects/new')} className="px-4 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-400">+ New Project</button>
        </div>
      </div>

      {!projects || projects.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
          <p className="mb-4 text-slate-300">No projects yet.</p>
          <button onClick={() => navigate('/projects/new')} className="px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 font-medium hover:bg-cyan-400">Create Project</button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project: any) => (
            <div key={project.id} className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-slate-900/40">
              <div className="mb-3 flex items-start justify-between">
                <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                <StatusBadge status={project.status} />
              </div>
              <p className="mb-4 text-sm text-slate-300">{project.address}</p>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => navigate(`/projects/${project.id}`)} className="px-3 py-2 rounded-lg bg-white/10 text-slate-100 hover:bg-white/20">View Details</button>
                <ChecklistExport projectId={project.id} />
                <FormZipExport projectId={project.id} />
                <button onClick={() => deleteMutation.mutate(project.id)} className="px-3 py-2 rounded-lg bg-rose-500/15 text-rose-200 hover:bg-rose-500/25" title="Delete">🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
