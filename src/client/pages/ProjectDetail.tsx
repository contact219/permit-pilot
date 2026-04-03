import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useLocation } from 'wouter';
import { get, post, del } from '../lib/api';
import StatusBadge from '../components/StatusBadge';
import ChecklistExport from '../components/ChecklistExport';
import FormZipExport from '../components/FormZipExport';

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({ queryKey: ['project', id], queryFn: () => get<any>(`/api/projects/${id}`), enabled: !!id });
  const reanalyzeMutation = useMutation({ mutationFn: () => post<any>(`/api/projects/${id}/analyze`, {}), onSuccess: (d: any) => queryClient.setQueryData(['project', id], (old: any) => ({ ...old, analysis: d.analysis })) });
  const deleteMutation = useMutation({ mutationFn: () => del(`/api/projects/${id}`), onSuccess: () => navigate('/dashboard') });

  if (isLoading) return <div className="rounded-2xl border border-white/10 bg-white/5 p-8">Loading project...</div>;
  if (error || !data) return <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-8 text-rose-200">Project not found</div>;

  const { project, jurisdiction, permits } = data as any;

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="flex flex-wrap justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">{project.name}</h1>
            <p className="text-slate-300">{project.address}</p>
            <p className="text-sm text-slate-400">Jurisdiction: {jurisdiction?.name || 'Unknown'}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <ChecklistExport projectId={project.id} />
            <FormZipExport projectId={project.id} />
            <button onClick={() => reanalyzeMutation.mutate()} disabled={reanalyzeMutation.isPending} className="px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 font-medium hover:bg-cyan-400 disabled:opacity-50">
              {reanalyzeMutation.isPending ? 'Analyzing...' : 'Re-run Analysis'}
            </button>
            <button onClick={() => deleteMutation.mutate()} className="px-4 py-2 rounded-lg bg-rose-500/80 text-white hover:bg-rose-500">Delete</button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-cyan-300/20 bg-cyan-400/10 p-6">
        <h2 className="mb-2 text-xl font-semibold text-white">AI Analysis Summary</h2>
        <p className="whitespace-pre-wrap text-slate-100">{project.aiSummary || 'No summary available'}</p>
        <p className="mt-3 text-xs text-cyan-100/80">Verify all requirements directly with your local permitting authority. This is informational only.</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Required Permits</h2>
        {permits?.length > 0 ? permits.map((item: any) => (
          <div key={item.pp.id} className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="mb-4 flex justify-between items-start gap-4">
              <div>
                <h3 className="text-lg font-semibold text-white">{item.pt?.name}</h3>
                <p className="text-sm text-slate-400">Code: {item.pt?.code}</p>
              </div>
              <StatusBadge status={item.pp.status} />
            </div>
            <p className="mb-3 text-slate-200">{item.pp.notes || 'No additional notes.'}</p>
            {item.pt?.feeBase && <p className="text-sm text-slate-300"><strong>Fee:</strong> ${item.pt.feeBase} base{item.pt.feePerSqft ? ` + $${item.pt.feePerSqft}/sqft` : ''}</p>}
            {item.pt?.lastVerified && (
              <p className="mt-2 text-xs text-slate-400">Last verified: {new Date(item.pt.lastVerified).toLocaleDateString()}</p>
            )}
          </div>
        )) : <p className="text-slate-300">No permits identified yet.</p>}
      </div>
    </div>
  );
}
