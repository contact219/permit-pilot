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
  const emailVerified = user?.emailVerified;

  const deleteMutation = useMutation({ mutationFn: (id: string) => del(`/api/projects/${id}`), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }) });

  useEffect(() => { if (error && (error as Error).message.includes('401')) navigate('/auth'); }, [error, navigate]);

  const handleUpgrade = async (plan: 'contractor' | 'agency') => {
    try { const { url } = await post<{ url: string }>('/api/billing/checkout', { planTier: plan }); window.location.href = url; }
    catch { alert('Failed to start checkout'); }
  };

  if (isLoading) return (
    <div className="space-y-4">
      {[1,2,3].map(i => <div key={i} className="h-36 rounded-2xl border border-white/10 bg-white/5 animate-pulse" />)}
    </div>
  );
  if (error) return <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-8 text-rose-200">Error loading projects</div>;

  const planBadge = planTier === 'free' ? 'bg-slate-700 text-slate-200' : planTier === 'contractor' ? 'bg-cyan-400/20 text-cyan-200' : 'bg-emerald-400/20 text-emerald-200';

  return (
    <div className="space-y-6">

      {user && !emailVerified && (
        <div className="rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-amber-200">📧 Please verify your email address to unlock all features.</p>
          <button onClick={async () => {
            await fetch('/api/auth/resend-verification', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: user.email }), credentials: 'include' });
            alert('Verification email sent!');
          }} className="text-xs px-3 py-1 rounded-full bg-amber-400/20 text-amber-200 hover:bg-amber-400/30">Resend Email</button>
        </div>
      )}

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">My Projects</h1>
            <p className="mt-1 text-sm text-slate-400">
              {planTier === 'free' ? 'Free tier: up to 2 projects · 3 AI analyses/day' : 'Unlimited projects and analyses'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={'px-3 py-1 rounded-full text-xs font-medium ' + planBadge}>
              {planTier.charAt(0).toUpperCase() + planTier.slice(1)}
            </span>
            {isAdmin && <button onClick={() => navigate('/admin')} className="px-3 py-1.5 rounded-lg bg-violet-500/80 text-white text-sm hover:bg-violet-500">Admin</button>}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {planTier === 'free' && (
            <>
              <button onClick={() => handleUpgrade('contractor')} className="px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 text-sm font-medium hover:bg-cyan-400">⚡ Contractor $29/mo</button>
              <button onClick={() => handleUpgrade('agency')} className="px-4 py-2 rounded-lg bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-400">🏢 Agency $99/mo</button>
            </>
          )}
          {planTier !== 'free' && (
            <button onClick={async () => { const { url } = await get<{ url: string }>('/api/billing/portal'); window.location.href = url; }} className="px-4 py-2 rounded-lg bg-slate-700 text-white text-sm hover:bg-slate-600">Manage Subscription</button>
          )}
          <button onClick={() => navigate('/projects/new')} className="px-4 py-2 rounded-lg bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-400">+ New Project</button>
        </div>
      </div>

      {!projects || projects.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
          <p className="text-4xl mb-4">🏗️</p>
          <p className="mb-2 text-lg font-medium text-white">No projects yet</p>
          <p className="mb-6 text-sm text-slate-400">Create your first project to get AI-powered permit analysis.</p>
          <button onClick={() => navigate('/projects/new')} className="px-5 py-2.5 rounded-lg bg-cyan-500 text-slate-950 font-medium hover:bg-cyan-400">Create First Project</button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((project: any) => (
            <div key={project.id} className="rounded-2xl border border-white/10 bg-white/5 p-5 flex flex-col gap-4 shadow-lg shadow-slate-900/40 hover:border-white/20 transition">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-semibold text-white truncate">{project.name}</h3>
                  <p className="text-xs text-slate-400 truncate mt-0.5">{project.address}</p>
                </div>
                <StatusBadge status={project.status} />
              </div>
              {project.aiSummary && (
                <p className="text-xs text-slate-400 line-clamp-2">{project.aiSummary}</p>
              )}
              <div className="flex flex-wrap gap-2 mt-auto">
                <button onClick={() => navigate(`/projects/${project.id}`)} className="flex-1 min-w-[80px] px-3 py-2 rounded-lg bg-white/10 text-slate-100 text-sm hover:bg-white/20 text-center">View</button>
                <ChecklistExport projectId={project.id} />
                <FormZipExport projectId={project.id} />
                <button onClick={() => { if (confirm('Delete this project?')) deleteMutation.mutate(project.id); }}
                  className="px-3 py-2 rounded-lg bg-rose-500/15 text-rose-300 text-sm hover:bg-rose-500/25">🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
