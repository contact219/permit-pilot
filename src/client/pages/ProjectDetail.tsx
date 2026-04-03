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
  const reanalyzeMutation = useMutation({ mutationFn: () => post<any>(`/api/projects/${id}/analyze`, {}), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['project', id] }) });
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
            {jurisdiction?.lastVerified && (
              <p className="mt-1 inline-flex rounded-full border border-cyan-200/30 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-100">
                Data last verified: {new Date(jurisdiction.lastVerified).toLocaleDateString()}
              </p>
            )}
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
        <div className="mt-4 rounded-md border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-900">
          <strong>Important Disclaimer:</strong> This analysis is AI-generated for informational purposes only and does not constitute legal or professional advice. Permit requirements change frequently. Always verify requirements directly with your local permitting authority before submitting applications. Permit Pilot is not responsible for errors, omissions, or outdated information.
        </div>
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
            {jurisdiction?.portalUrl && (
              <p className="mt-2 text-sm">
                <a
                  href={jurisdiction.portalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-300 underline-offset-2 hover:underline"
                >
                  Official jurisdiction portal
                </a>
              </p>
            )}
          </div>
        )) : <p className="text-slate-300">No permits identified yet.</p>}
      </div>
    </div>
  );
}
