import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { useEffect } from 'react';
import { get, post, del } from '../lib/api';
import StatusBadge from '../components/StatusBadge';
import ChecklistExport from '../components/ChecklistExport';

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

  if (isLoading) return <div className="p-8">Loading projects...</div>;
  if (error) return <div className="p-8 text-red-600">Error loading projects</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Projects</h1>
        <div className="flex gap-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${planTier === 'free' ? 'bg-gray-200 text-gray-800' : planTier === 'contractor' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
            {planTier.charAt(0).toUpperCase() + planTier.slice(1)}
          </span>
          {planTier === 'free' && (
            <div className="flex gap-2">
              <button onClick={() => handleUpgrade('contractor')} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Upgrade to Contractor</button>
              <button onClick={() => handleUpgrade('homeowner')} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Homeowner Plan</button>
            </div>
          )}
          {planTier !== 'free' && (
            <button onClick={async () => { const { url } = await get<{ url: string }>('/api/billing/portal'); window.location.href = url; }} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">Manage Subscription</button>
          )}
          {isAdmin && <button onClick={() => navigate('/admin')} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Admin Panel</button>}
        </div>
      </div>
      <p className="text-gray-600">Free tier: up to 2 projects, 10 AI analyses/day.</p>
      {!projects || projects.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-600 mb-4">No projects yet.</p>
          <button onClick={() => navigate('/projects/new')} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Create Project</button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project: any) => (
            <div key={project.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">{project.name}</h3>
                <StatusBadge status={project.status} />
              </div>
              <p className="text-gray-600 text-sm mb-4">{project.address}</p>
              <div className="flex gap-2">
                <button onClick={() => navigate(`/projects/${project.id}`)} className="flex-1 px-3 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200">View Details</button>
                <ChecklistExport projectId={project.id} />
                <button onClick={() => deleteMutation.mutate(project.id)} className="px-3 py-2 text-red-600 hover:bg-red-50 rounded" title="Delete">🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
